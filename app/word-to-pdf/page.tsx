'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FileText,
  Upload,
  Loader2,
  Shield,
  Globe,
  CheckCircle2,
  Download,
  X,
  FileCheck,
  Users,
  Zap,
  ArrowRight,
  Share2,
  Edit,
  Cloud,
} from 'lucide-react';

export default function WordToPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // Word 파일만 허용 (DOC, DOCX)
    if (
      fileType.includes('word') ||
      fileType.includes('document') ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx')
    ) {
      setSelectedFile(file);
      setConvertedFile(null);
    }
  }, []);

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  // 파일 삭제 핸들러
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setConvertedFile(null);
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Word to PDF 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setConvertedFile(null);

    try {
      // 파일 데이터 가져오기
      const fileBuffer = await selectedFile.arrayBuffer();

      // 1) mammoth.js를 사용하여 Word 파일을 HTML로 변환 (표와 줄바꿈 유지)
      let htmlContent = '';
      const mammoth = await import('mammoth');

      try {
        // HTML로 변환 시도 (서식 정보 포함, 표와 줄바꿈 유지)
        // styleMap은 mammoth.js에서 지원하지만 타입 정의에 없어서 타입 단언 사용
        const result = await mammoth.convertToHtml({ 
          arrayBuffer: fileBuffer,
          // 표 스타일 보존
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "r[style-name='Strong'] => strong",
          ]
        } as any);
        htmlContent = result.value;
      } catch (mammothError) {
        console.warn('HTML 변환 실패, 텍스트만 추출로 진행합니다.', mammothError);
        // HTML 변환 실패 시 텍스트만 추출 시도
        try {
          const textResult = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
          // 줄바꿈 유지를 위해 텍스트를 HTML로 감싸기
          htmlContent = '<p>' + textResult.value.replace(/\n/g, '<br>') + '</p>';
        } catch (textError) {
          console.error('텍스트 추출 실패:', textError);
          throw new Error('문서 내용을 추출할 수 없습니다. 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다.');
        }
      }

      // HTML 내용이 없으면 에러 처리
      if (!htmlContent || htmlContent.trim().length === 0) {
        throw new Error('문서에서 내용을 추출할 수 없습니다.');
      }

      // 2) jspdf를 사용하여 PDF 생성 (한글 폰트 지원)
      // @ts-ignore - jsPDF 타입 정의 문제 (named export 지원)
      const { jsPDF } = await import('jspdf');
      
      // PDF 인스턴스 생성
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 한글 폰트 로드 및 추가
      let fontLoaded = false;
      const fontName = 'NotoSansKR';
      
      try {
        // TTF 폰트를 CDN에서 로드 (jspdf는 TTF만 지원)
        const fontSources = [
          'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR-Regular.ttf',
          'https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Regular.ttf',
        ];

        let fontBase64 = '';

        // 각 소스에서 폰트 로드 시도
        for (const fontUrl of fontSources) {
          try {
            const fontResponse = await fetch(fontUrl);
            if (!fontResponse.ok) continue;
            
            const fontArrayBuffer = await fontResponse.arrayBuffer();
            const uint8Array = new Uint8Array(fontArrayBuffer);
            
            // 큰 파일을 위해 청크 단위로 변환 (btoa는 큰 버퍼에서 문제 발생 가능)
            let binaryString = '';
            const chunkSize = 0x8000; // 32KB 청크
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
              const chunk = uint8Array.subarray(i, i + chunkSize);
              binaryString += String.fromCharCode.apply(null, Array.from(chunk));
            }
            fontBase64 = btoa(binaryString);
            
            // jspdf에 폰트 추가 (인스턴스 메서드 사용)
            const fileName = 'NotoSansKR-Regular.ttf';
            // @ts-ignore - jspdf 타입 정의가 불완전할 수 있음
            doc.addFileToVFS(fileName, fontBase64);
            // @ts-ignore
            doc.addFont(fileName, fontName, 'normal');
            // @ts-ignore
            doc.setFont(fontName);
            
            fontLoaded = true;
            break;
          } catch (err) {
            console.warn(`폰트 소스 로드 실패: ${fontUrl}`, err);
            continue;
          }
        }

        if (!fontLoaded) {
          console.warn('한글 폰트를 로드할 수 없습니다. 기본 폰트를 사용합니다.');
        }
      } catch (fontError) {
        console.warn('한글 폰트 로드 실패, 기본 폰트로 진행합니다.', fontError);
      }

      // 페이지 크기 설정
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // HTML을 파싱하여 표와 줄바꿈을 유지하면서 Canvas로 렌더링
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Noto Sans KR 폰트 로드 확인 및 대기
      const fontSize = 12;
      if (document.fonts && document.fonts.check) {
        if (!document.fonts.check(`12px "Noto Sans KR"`)) {
          await document.fonts.load(`12px "Noto Sans KR"`);
        }
      }

      const mmToPx = 3.779527559; // 1mm = 3.779527559px
      const lineHeight = fontSize * 1.5;

      // HTML 요소를 순회하며 렌더링
      const renderElement = (element: Node, parentY: number): number => {
        let currentY = parentY;
        
        if (element.nodeType === Node.TEXT_NODE) {
          const text = element.textContent || '';
          if (text.trim()) {
            // 텍스트 노드 처리
            const words = text.split(/(\s+)/);
            let currentLine = '';
            
            for (const word of words) {
              const testLine = currentLine + word;
              const testCanvas = document.createElement('canvas');
              const testCtx = testCanvas.getContext('2d');
              if (testCtx) {
                testCtx.font = `${fontSize}px "Noto Sans KR", sans-serif`;
                const width = testCtx.measureText(testLine).width;
                
                if (width > maxWidth * mmToPx && currentLine.length > 0) {
                  // 줄바꿈 필요
                  currentY = renderTextLine(currentLine.trim(), currentY);
                  currentLine = word;
                } else {
                  currentLine = testLine;
                }
              }
            }
            
            if (currentLine.trim()) {
              currentY = renderTextLine(currentLine.trim(), currentY);
            }
          }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
          const el = element as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          
          if (tagName === 'table') {
            // 표 처리
            currentY = renderTable(el, currentY);
          } else if (tagName === 'tr') {
            // 표 행은 renderTable 내부에서 처리
            return currentY;
          } else if (tagName === 'td' || tagName === 'th') {
            // 표 셀은 renderTable 내부에서 처리
            return currentY;
          } else if (tagName === 'p' || tagName === 'div') {
            // 문단 처리 - 자식 요소들 렌더링
            let childY = currentY;
            const hasChildren = el.childNodes.length > 0;
            
            if (hasChildren) {
              for (const child of Array.from(el.childNodes)) {
                childY = renderElement(child, childY);
              }
            } else {
              // 빈 문단도 줄바꿈 처리
              childY += lineHeight / mmToPx;
            }
            
            currentY = childY + (lineHeight / mmToPx) * 0.3; // 문단 간격
          } else if (tagName === 'br') {
            // 줄바꿈
            currentY += lineHeight / mmToPx;
          } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
            // 제목 처리
            const text = el.textContent || '';
            if (text.trim()) {
              const titleSize = tagName === 'h1' ? 18 : tagName === 'h2' ? 16 : 14;
              currentY = renderTextLine(text.trim(), currentY, titleSize);
              currentY += lineHeight / mmToPx * 0.5;
            }
          } else {
            // 기타 요소 - 자식 요소들 렌더링
            for (const child of Array.from(el.childNodes)) {
              currentY = renderElement(child, currentY);
            }
          }
        }
        
        return currentY;
      };

      // 텍스트 줄 렌더링 함수
      const renderTextLine = (text: string, y: number, size: number = fontSize): number => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return y;

        ctx.font = `${size}px "Noto Sans KR", sans-serif`;
        const metrics = ctx.measureText(text);
        
        canvas.width = Math.ceil(metrics.width) + 10;
        canvas.height = Math.ceil(size * 1.5);
        
        ctx.font = `${size}px "Noto Sans KR", sans-serif`;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.fillText(text, 0, 0);
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width / mmToPx;
        const imgHeight = canvas.height / mmToPx;
        
        doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        
        return y + imgHeight + 2;
      };

      // 표 렌더링 함수
      const renderTable = (table: HTMLElement, startY: number): number => {
        let currentY = startY;
        const rows = table.querySelectorAll('tr');
        const cellPadding = 2;
        const fontSizeTable = fontSize - 1;
        
        // 표 크기 계산
        let maxCols = 0;
        rows.forEach(row => {
          const cols = row.querySelectorAll('td, th').length;
          maxCols = Math.max(maxCols, cols);
        });
        
        const cellWidth = maxWidth / maxCols;
        const cellHeight = fontSizeTable * 1.8;
        
        // 각 행 렌더링
        rows.forEach((row, rowIndex) => {
          if (currentY + cellHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
          }
          
          const cells = row.querySelectorAll('td, th');
          let currentX = margin;
          
          cells.forEach((cell, colIndex) => {
            const cellText = cell.textContent || '';
            const actualCellWidth = cellWidth * (parseInt((cell as HTMLElement).getAttribute('colspan') || '1'));
            
            // 셀 배경 그리기 (선)
            if (rowIndex === 0 || (cell as HTMLElement).tagName.toLowerCase() === 'th') {
              // 헤더 셀 배경
              doc.setDrawColor(200, 200, 200);
              doc.setFillColor(240, 240, 240);
              doc.rect(currentX, currentY, actualCellWidth, cellHeight, 'FD'); // Fill and Draw
            } else {
              // 일반 셀 선
              doc.setDrawColor(200, 200, 200);
              doc.rect(currentX, currentY, actualCellWidth, cellHeight, 'D'); // Draw only
            }
            
            // 셀 텍스트 렌더링
            if (cellText.trim()) {
              const cellCanvas = document.createElement('canvas');
              const cellCtx = cellCanvas.getContext('2d');
              if (cellCtx) {
                cellCtx.font = `${fontSizeTable}px "Noto Sans KR", sans-serif`;
                const textMetrics = cellCtx.measureText(cellText);
                
                cellCanvas.width = Math.min(Math.ceil(textMetrics.width) + 10, Math.ceil(actualCellWidth * mmToPx));
                cellCanvas.height = Math.ceil(cellHeight);
                
                cellCtx.font = `${fontSizeTable}px "Noto Sans KR", sans-serif`;
                cellCtx.fillStyle = (cell as HTMLElement).tagName.toLowerCase() === 'th' ? '#000000' : '#000000';
                cellCtx.textBaseline = 'top';
                cellCtx.fillText(cellText, cellPadding, cellPadding);
                
                const cellImgData = cellCanvas.toDataURL('image/png');
                const cellImgWidth = cellCanvas.width / mmToPx;
                const cellImgHeight = cellCanvas.height / mmToPx;
                
                doc.addImage(cellImgData, 'PNG', currentX + cellPadding, currentY + cellPadding, 
                  Math.min(cellImgWidth, actualCellWidth - cellPadding * 2), cellImgHeight);
              }
            }
            
            currentX += actualCellWidth;
          });
          
          currentY += cellHeight;
        });
        
        return currentY + (lineHeight / mmToPx) * 0.5; // 표 후 간격
      };

      // HTML 루트 요소 렌더링
      yPosition = renderElement(tempDiv, yPosition);

      // PDF를 Blob으로 변환
      const pdfBlob = doc.output('blob');
      setConvertedFile(pdfBlob);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      alert('변환 중 오류가 발생했습니다. 파일이 손상되었거나 지원되지 않는 형식일 수 있습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!convertedFile || !selectedFile) return;

    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;
    const fileName = selectedFile.name.replace(/\.(doc|docx)$/i, '.pdf');
    a.download = fileName || 'converted.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [convertedFile, selectedFile]);

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* 메인 컨텐츠 */}
      <main className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* 브레드크럼 */}
        <nav className='mb-6 text-sm text-gray-600'>
          <ol className='flex items-center space-x-2'>
            <li>
              <a href='/' className='hover:text-primary transition-colors'>
                홈
              </a>
            </li>
            <li>
              <span className='mx-2'>›</span>
            </li>
            <li className='text-gray-900 font-medium'>워드 PDF 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            워드 PDF 변환기
          </h1>
          <p className='text-lg text-gray-600'>
            온라인에서 무료로 Word 문서를 고품질 PDF로 변환해 보세요. 회원
            가입이 필요 없으며, 변환된 PDF 파일에는 워터마크가 삽입되지
            않습니다.
          </p>
        </div>

        {/* 파일 업로드 영역 */}
        <div
          className={`mb-8 rounded-2xl border-2 border-dashed transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className='flex flex-col items-center justify-center p-12 text-center'>
            <Upload className='mb-4 h-16 w-16 text-gray-400' />
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>
              파일 선택
            </h3>
            <p className='mb-6 text-gray-600'>
              또는 파일을 여기로 끌어 놓으세요
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className='rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700'
            >
              파일 선택
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='.doc,.docx'
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              지원하는 형식: DOC, DOCX
            </p>
          </div>
        </div>

        {/* 선택된 파일 및 변환 옵션 */}
        {selectedFile && (
          <div className='mb-8 rounded-2xl border border-gray-200 bg-white p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FileText className='h-5 w-5 text-primary' />
                <div>
                  <p className='font-medium text-gray-900'>
                    {selectedFile.name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className='rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors'
                aria-label='파일 삭제'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* 변환 버튼 */}
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  변환 중...
                </>
              ) : (
                <>
                  <ArrowRight className='h-5 w-5' />
                  PDF로 변환
                </>
              )}
            </button>

            {/* 변환 완료 후 다운로드 버튼 */}
            {convertedFile && (
              <div className='mt-6 space-y-3'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    <p className='font-semibold text-green-900'>
                      변환 완료! PDF 파일이 준비되었습니다.
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={handleDownload}
                    className='flex-1 rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                  >
                    <Download className='h-5 w-5' />
                    다운로드
                  </button>
                  <button className='flex-1 rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 flex items-center justify-center gap-2'>
                    <Share2 className='h-5 w-5' />
                    공유
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 주요 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-blue-100 p-3'>
                <FileCheck className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              DOC 또는 DOCX 파일을 끌어다 놓으면 바로 시작
            </h3>
            <p className='text-sm text-gray-600'>
              간단한 드래그 앤 드롭으로 즉시 변환을 시작할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Globe className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Windows, Mac, Linux, 모바일에서 PDF 변환
            </h3>
            <p className='text-sm text-gray-600'>
              어떤 기기에서든 브라우저만 있으면 사용할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Users className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              2013년부터 17억 명이 신뢰하는 플랫폼
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 변환 서비스입니다
            </p>
          </div>
        </div>

        {/* 최고의 온라인 워드 PDF 변환기 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            최고의 온라인 워드 PDF 변환기
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            Freeconvert는 가장 인기 있는 온라인 PDF 소프트웨어입니다. 매일 수백만
            명의 사용자가 Freeconvert를 사용하여 Word 파일을 간편한 PDF 형식으로
            변환합니다. 파일 크기에 상관없이 문서를 변환하고 만족스러운 결과물을
            얻어보세요. 지금 체험해 보세요!
          </p>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                워드를 PDF로 원활하게 변환
              </h3>
              <p className='text-sm text-gray-600'>
                이처럼 유용한 도구를 사용하여 온라인에서 Word 문서를 PDF로
                정확하고 효율적으로 변환해 보세요. 모든 레이아웃과 서식, 글꼴은
                원본과 동일하게 유지됩니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                변환된 파일을 다른 사람과 공유
              </h3>
              <p className='text-sm text-gray-600'>
                워드 파일을 PDF로 변환하고 공유 기능을 사용하여 공유 가능한
                다운로드 링크를 빠르게 생성하거나 간단한 클릭만으로 PDF를
                이메일로 전송하세요.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF 문서 개선
              </h3>
              <p className='text-sm text-gray-600'>
                파일을 저장하기 전에 다른 도구를 활용하여 PDF를 추가로
                수정하세요. 텍스트와 주석을 추가하고, 이메일 전송에 적합하도록
                압축하거나, 다른 PDF와 병합하여 손쉽게 파일을 처리할 수도
                있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인에서 무료로 워드를 PDF로 변환하는 방법
          </h2>
          <div className='grid gap-6 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                Microsoft Word 문서를 이 페이지로 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                이 도구는 업로드된 Word 파일을 PDF 형식으로 변환할 때까지
                기다립니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                결과 페이지에서 미리 보고 필요한 경우 계속 편집합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                "다운로드" 버튼을 눌러 PDF를 저장합니다
              </p>
            </div>
          </div>
        </div>

        {/* 간편한 문서 PDF 변환기 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Zap className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                빠르고 효율적인 온라인 도구
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Word 문서를 PDF로 간단하게 변환해 보세요. 파일 변환을 시작하려면
              Word 파일을 업로드하고 잠시 기다리시면 곧바로 PDF 파일이
              완성됩니다. Freeconvert를 이용하면 DOC 및 DOCX 파일을 변환할 수
              있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                안전한 온라인 PDF 소프트웨어
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              걱정하지 마세요! 변환된 파일은 1시간 후 서버에서 영구적으로
              삭제됩니다. 변환된 파일을 온라인에 저장하려면 무료 Freeconvert 계정을
              생성하세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                모든 기기 및 운영 체제 지원
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Word PDF 변환기는 온라인 브라우저 기반 소프트웨어입니다. PC 웹
              브라우저부터 Android나 iOS 스마트폰, 태블릿까지 언제 어디서나
              편리하게 이용해 보세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                기타 지원하는 파일 형식
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              그 외에도 놀라운 기능이 가득합니다! 올인원 PDF 변환기로 JPG, PNG,
              엑셀, PPT 등의 기타 파일 형식을 PDF로 변환해보세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>
                고급 워드 PDF 변환 기능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              매일 수많은 파일을 변환해야 한다면 Freeconvert Pro를 확인해보세요.
              올인원 도구로 워드 파일을 얼마든지 PDF로 변환할 수 있습니다. 변환
              가능한 최대 파일 크기는 15GB입니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Cloud className='h-5 w-5 text-red-600' />
              <h3 className='font-semibold text-gray-900'>클라우드에서 작업</h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 원활한 디지털 작업 환경을 구축하고자 합니다. DOC 파일을
              PDF로 변환하고 미리 보기, 편집, 저장 기능을 자유롭게 이용하세요.
              모든 작업은 클라우드에서 가능합니다.
            </p>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            워드 PDF 변환기에 대한 FAQ
          </h2>
          <div className='space-y-6'>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                이 도구를 사용하면 워드를 PDF로 무료 변환할 수 있나요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠! 누구나 Freeconvert 변환 도구를 사용하여 하루에 무료로
                2번, Word 및 기타 여러 파일 형식을 PDF로 변환할 수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                오프라인에서도 워드를 PDF로 변환할 수 있나요?
              </h3>
              <p className='text-sm text-gray-700'>
                그럼요! Freeconvert 데스크톱 앱을 확인해보세요. 데스크톱 앱을
                사용하면 인터넷에 연결하지 않아도 PDF 문서를 변환, 수정, 압축할
                수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Freeconvert Pro는 어떤 서비스인가요?
              </h3>
              <p className='text-sm text-gray-700'>
                Freeconvert Pro는 프리미엄 요금제입니다. 모든 PDF 도구를 무제한
                사용할 수 있으며 일괄 처리 및 OCR과 같은 고급 기능이 제공됩니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Freeconvert를 사용해도 안전한가요?
              </h3>
              <p className='text-sm text-gray-700'>
                그럼요. 모든 파일 전송은 최신 TLS 암호화를 통해 안전하게
                보호됩니다. 또한, Freeconvert 계정에 저장하지 않은 모든 파일은
                1시간이 지나면 서버에서 자동 삭제됩니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                다른 Microsoft Office 파일 형식으로도 변환할 수 있나요?
              </h3>
              <p className='text-sm text-gray-700'>
                당연하죠! 워드 피디에프 변환 도구는 PowerPoint와 Excel을 비롯해
                모든 종류의 이미지 파일과 호환됩니다. 파일을 PDF로 변환하거나
                PDF에서 다른 파일 형식으로 손쉽게 변환해 보세요.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                워드 PDF 변환에 대한 다른 질문이 있어요!
              </h3>
              <p className='text-sm text-gray-700'>
                걱정하지 마세요! Freeconvert 고객지원팀은 24시간 연중무휴로
                운영되며, PDF와 관련된 모든 요청 사항을 해결할 수 있도록
                지원합니다. support@freeconvert.com으로 이메일을 보내주시면 몇 분
                내로 답변 받으실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
