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
  Cloud,
} from 'lucide-react';

export default function PptToPdfPage() {
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

    // PowerPoint 파일만 허용 (PPT, PPTX)
    if (
      fileType.includes('powerpoint') ||
      fileType.includes('presentation') ||
      fileType === 'application/vnd.ms-powerpoint' ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      fileName.endsWith('.ppt') ||
      fileName.endsWith('.pptx')
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

  // PPT to PDF 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setConvertedFile(null);

    try {
      // 파일 타입 검증
      const fileName = selectedFile.name.toLowerCase();
      const isPptx = fileName.endsWith('.pptx');
      const isPpt = fileName.endsWith('.ppt');

      if (!isPptx && !isPpt) {
        alert('PPT 또는 PPTX 파일만 변환할 수 있습니다.');
        setIsProcessing(false);
        return;
      }

      // PPTX 파일 처리 (PPT는 지원하지 않음 - 이진 형식이므로 복잡함)
      if (isPpt) {
        alert(
          'PPT 파일은 지원하지 않습니다. PPTX 파일로 변환 후 다시 시도해주세요.'
        );
        setIsProcessing(false);
        return;
      }

      // 파일 데이터 가져오기
      const fileBuffer = await selectedFile.arrayBuffer();

      // 1) jszip을 사용하여 PPTX 파일 압축 해제
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(fileBuffer);

      // 2) 슬라이드 XML 파일들 찾기 및 텍스트 추출
      const slideFiles: { name: string; content: string }[] = [];
      const slidePattern = /ppt\/slides\/slide(\d+)\.xml/;

      // PPTX 구조에서 슬라이드 파일 찾기
      for (const fileName in zip.files) {
        const match = fileName.match(slidePattern);
        if (match) {
          const slideNumber = parseInt(match[1], 10);
          const file = zip.files[fileName];
          if (!file.dir) {
            try {
              const content = await file.async('string');
              slideFiles.push({ name: fileName, content });
            } catch (err) {
              console.warn(`슬라이드 ${slideNumber} 읽기 실패:`, err);
            }
          }
        }
      }

      // 슬라이드를 번호 순서로 정렬
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/slide(\d+)/)?.[1] || '0', 10);
        const numB = parseInt(b.name.match(/slide(\d+)/)?.[1] || '0', 10);
        return numA - numB;
      });

      // 슬라이드가 없으면 에러
      if (slideFiles.length === 0) {
        throw new Error('PPTX 파일에서 슬라이드를 찾을 수 없습니다.');
      }

      // 3) 각 슬라이드에서 텍스트 추출 (XML 파싱)
      const slideTexts: string[] = [];
      slideFiles.forEach((slideFile, index) => {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(slideFile.content, 'text/xml');

          // XML 파싱 에러 확인
          const parserError = xmlDoc.querySelector('parsererror');
          if (parserError) {
            console.warn(`슬라이드 ${index + 1} XML 파싱 실패`);
            slideTexts.push(`슬라이드 ${index + 1}: (내용을 추출할 수 없음)`);
            return;
          }

          // 모든 텍스트 노드 추출
          const textNodes: string[] = [];
          const allElements = xmlDoc.getElementsByTagName('*');

          for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            // a:t (텍스트), a:p (문단) 등에서 텍스트 추출
            if (element.tagName === 'a:t' || element.tagName === 't') {
              const text = element.textContent?.trim();
              if (text) {
                textNodes.push(text);
              }
            }
          }

          const slideText =
            textNodes.length > 0
              ? textNodes.join(' ')
              : `슬라이드 ${index + 1}`;

          slideTexts.push(slideText);
        } catch (parseError) {
          console.warn(`슬라이드 ${index + 1} 파싱 중 오류:`, parseError);
          slideTexts.push(`슬라이드 ${index + 1}: (내용을 추출할 수 없음)`);
        }
      });

      // 4) jsPDF를 사용하여 PDF 생성
      // @ts-ignore - jsPDF 타입 정의 문제
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'landscape', // 프레젠테이션은 가로 방향
        unit: 'mm',
        format: 'a4',
      });

      // 한글 폰트 로드 시도
      let fontLoaded = false;
      const fontName = 'NotoSansKR';

      try {
        const fontUrl =
          'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR-Regular.ttf';
        const fontResponse = await fetch(fontUrl);

        if (fontResponse.ok) {
          const fontArrayBuffer = await fontResponse.arrayBuffer();
          const uint8Array = new Uint8Array(fontArrayBuffer);

          let binaryString = '';
          const chunkSize = 0x8000;
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize);
            binaryString += String.fromCharCode.apply(null, Array.from(chunk));
          }
          const fontBase64 = btoa(binaryString);

          const fileName = 'NotoSansKR-Regular.ttf';
          // @ts-ignore
          doc.addFileToVFS(fileName, fontBase64);
          // @ts-ignore
          doc.addFont(fileName, fontName, 'normal');
          // @ts-ignore
          doc.setFont(fontName);

          fontLoaded = true;
        }
      } catch (fontError) {
        console.warn('한글 폰트 로드 실패, 기본 폰트로 진행합니다.', fontError);
      }

      // 각 슬라이드를 PDF 페이지로 변환
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      const fontSize = 14;
      const lineHeight = fontSize * 1.5;

      slideTexts.forEach((slideText, index) => {
        // 첫 번째 슬라이드가 아니면 새 페이지 추가
        if (index > 0) {
          doc.addPage();
        }

        // 슬라이드 제목 추가
        const slideTitle = `슬라이드 ${index + 1}`;
        let yPosition = margin;

        // 제목 렌더링
        const titleCanvas = document.createElement('canvas');
        const titleCtx = titleCanvas.getContext('2d');
        if (titleCtx) {
          titleCtx.font = `bold 18px "${
            fontLoaded ? 'Noto Sans KR' : 'Arial'
          }", sans-serif`;
          const titleMetrics = titleCtx.measureText(slideTitle);

          titleCanvas.width = Math.ceil(titleMetrics.width) + 10;
          titleCanvas.height = 24;

          titleCtx.font = `bold 18px "${
            fontLoaded ? 'Noto Sans KR' : 'Arial'
          }", sans-serif`;
          titleCtx.fillStyle = '#000000';
          titleCtx.textBaseline = 'top';
          titleCtx.fillText(slideTitle, 0, 0);

          const titleImgData = titleCanvas.toDataURL('image/png');
          const mmToPx = 3.779527559;
          const titleImgWidth = titleCanvas.width / mmToPx;
          const titleImgHeight = titleCanvas.height / mmToPx;

          doc.addImage(
            titleImgData,
            'PNG',
            margin,
            yPosition,
            titleImgWidth,
            titleImgHeight
          );
          yPosition += titleImgHeight + 10;
        }

        // 슬라이드 내용 렌더링 (텍스트 줄바꿈 처리)
        const words = slideText.split(/\s+/);
        let currentLine = '';
        const lines: string[] = [];

        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testCanvas = document.createElement('canvas');
          const testCtx = testCanvas.getContext('2d');

          if (testCtx) {
            testCtx.font = `${fontSize}px "${
              fontLoaded ? 'Noto Sans KR' : 'Arial'
            }", sans-serif`;
            const width = testCtx.measureText(testLine).width;
            const maxWidthPx = maxWidth * 3.779527559; // mm to px

            if (width > maxWidthPx && currentLine.length > 0) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        // 각 줄을 렌더링
        lines.forEach(line => {
          if (yPosition + lineHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }

          const lineCanvas = document.createElement('canvas');
          const lineCtx = lineCanvas.getContext('2d');

          if (lineCtx && line.trim()) {
            lineCtx.font = `${fontSize}px "${
              fontLoaded ? 'Noto Sans KR' : 'Arial'
            }", sans-serif`;
            const lineMetrics = lineCtx.measureText(line);

            lineCanvas.width = Math.ceil(lineMetrics.width) + 10;
            lineCanvas.height = Math.ceil(lineHeight);

            lineCtx.font = `${fontSize}px "${
              fontLoaded ? 'Noto Sans KR' : 'Arial'
            }", sans-serif`;
            lineCtx.fillStyle = '#000000';
            lineCtx.textBaseline = 'top';
            lineCtx.fillText(line, 0, 0);

            const lineImgData = lineCanvas.toDataURL('image/png');
            const mmToPx = 3.779527559;
            const lineImgWidth = lineCanvas.width / mmToPx;
            const lineImgHeight = lineCanvas.height / mmToPx;

            doc.addImage(
              lineImgData,
              'PNG',
              margin,
              yPosition,
              lineImgWidth,
              lineImgHeight
            );
            yPosition += lineImgHeight + 2;
          }
        });
      });

      // PDF를 Blob으로 변환
      const pdfBlob = doc.output('blob');
      setConvertedFile(pdfBlob);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`변환 중 오류가 발생했습니다: ${errorMessage}`);
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
    const fileName = selectedFile.name.replace(/\.(ppt|pptx)$/i, '.pdf');
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
            <li className='text-gray-900 font-medium'>PPT PDF 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PPT PDF 변환
          </h1>
          <p className='text-lg text-gray-600'>
            파일 크기 제한이나 광고 워터마크 없음 - PPT 슬라이드를 PDF로
            바꿔주는 무료 온라인 툴입니다.
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
              accept='.ppt,.pptx'
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              지원하는 형식: PPTX (PPT는 지원하지 않음)
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
              믿고 이용할 수 있는 PPT, PPTX 파일 PDF 변환 도구
            </h3>
            <p className='text-sm text-gray-600'>
              안전하고 신뢰할 수 있는 변환 서비스를 제공합니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Globe className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              소프트웨어 설치가 필요 없어 웹 브라우저에서 작업 가능
            </h3>
            <p className='text-sm text-gray-600'>
              브라우저만 있으면 어디서나 사용할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <CheckCircle2 className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              모든 서식 및 이미지 그대로 유지
            </h3>
            <p className='text-sm text-gray-600'>
              원본 파일의 레이아웃과 디자인이 그대로 보존됩니다
            </p>
          </div>
        </div>

        {/* A Smarter Way to Convert PowerPoint to PDF */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PPT 파일을 PDF로 변환하는 방법
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            사용자의 파일을 간단히 드롭 박스에 드롭하거나 '파일 옵션 선택'을
            골라 파일을 업로드합니다. 그럼 서버에서 PPT PDF 변환이 즉시 가능하기
            때문에 바로 다운로드 하실 수 있습니다.
          </p>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                완벽한 개인정보 보호
              </h3>
              <p className='text-sm text-gray-600'>
                저희는 보안을 중요하게 생각합니다. PPT에서 PDF로 변환한 후, 모든
                파일은 서버에서 영구히 삭제됩니다. 더 자세한 정보가 필요하시면
                개인정보 보호정책을 확인하시기 바랍니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                모든 운영 체제가 지원됩니다
              </h3>
              <p className='text-sm text-gray-600'>
                PPT PDF 변환기는 윈도우, 맥 또는 리눅스 등, 사용자의 OS에
                상관없이 모든 플랫폼에서 사용 가능합니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                변환 작업이 간단해집니다
              </h3>
              <p className='text-sm text-gray-600'>
                사용자의 PPT 파일은 추가로 설정한 옵션 없이 PDF로 변환됩니다.
                파일을 업로드만 하신 후, 편히 앉아 지켜만 보세요. 그럼 저희가
                알아서 모든 작업을 해드립니다!
              </p>
            </div>
          </div>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>PPT 및 PPTX 지원</h3>
            </div>
            <p className='text-sm text-gray-600'>
              기존 PPT 형식과 최신 PPTX 형식 모두 변환이 가능합니다. 변환을
              원하시는 파일을 업로드해 주시면 저희가 자동으로 변환 작업을 진행해
              드립니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Users className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                팀 및 전문가를 위한 설계
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              변환된 PDF를 동료, 고객 또는 학생과 공유 기능을 통해 원활하게
              공유하세요.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인으로 PPT를 PDF로 변환하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환기에 PPT 또는 PPTX 파일을 가져오거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요하다면 다른 도구로 변환된 PDF를 편집합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환된 PDF 파일을 다운로드하거나 공유합니다. 간편하죠!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
