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

export default function ExcelToPdfPage() {
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

    // Excel 파일만 허용 (XLS, XLSX)
    if (
      fileType.includes('excel') ||
      fileType.includes('spreadsheet') ||
      fileType === 'application/vnd.ms-excel' ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx')
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

  // Excel to PDF 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setConvertedFile(null);

    try {
      // 1) xlsx 라이브러리로 Excel 파일 읽기
      const XLSX = await import('xlsx');
      const fileBuffer = await selectedFile.arrayBuffer();
      
      // Excel 파일을 워크북으로 읽기 (한글 인코딩 보존을 위한 옵션 추가)
      const workbook = XLSX.read(fileBuffer, { 
        type: 'array',
        cellDates: false, // 날짜 변환 비활성화
        raw: true, // 원시 값 사용 (한글 인코딩 보존)
        codepage: 65001 // UTF-8 명시
      });
      
      // 2) jsPDF로 PDF 생성
      // @ts-ignore - jsPDF 타입 정의 문제 (named export 지원)
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF();
      
      // 한글 폰트 로드 및 추가 (더 확실한 폰트 로딩)
      let fontLoaded = false;
      const fontName = 'NotoSansKR';
      
      try {
        // TTF 폰트를 CDN에서 로드 (jspdf는 TTF만 지원)
        // 여러 소스를 시도하여 로드 성공률 향상
        const fontSources = [
          'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR-Regular.ttf',
          'https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Regular.ttf',
        ];

        let fontBase64 = '';

        // 각 소스에서 폰트 로드 시도
        for (const fontUrl of fontSources) {
          try {
            const fontResponse = await fetch(fontUrl, {
              mode: 'cors',
              cache: 'default'
            });
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
            pdf.addFileToVFS(fileName, fontBase64);
            // @ts-ignore
            pdf.addFont(fileName, fontName, 'normal');
            // @ts-ignore
            pdf.setFont(fontName);
            
            fontLoaded = true;
            console.log('한글 폰트 로드 성공:', fontName);
            break;
          } catch (err) {
            console.warn(`폰트 소스 로드 실패: ${fontUrl}`, err);
            continue;
          }
        }

        if (!fontLoaded) {
          console.warn('한글 폰트를 로드할 수 없습니다. 기본 폰트를 사용합니다.');
          // 폰트 로드 실패 시에도 계속 진행
        }
      } catch (fontError) {
        console.warn('한글 폰트 로드 실패, 기본 폰트로 진행합니다.', fontError);
      }

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // 각 시트를 PDF에 추가
      workbook.SheetNames.forEach((sheetName, sheetIndex) => {
        if (sheetIndex > 0) {
          // 첫 번째 시트가 아니면 새 페이지 추가
          pdf.addPage();
          // 새 페이지에서도 한글 폰트 설정 유지
          if (fontLoaded) {
            pdf.setFont(fontName);
          }
          yPosition = margin;
        }

        const worksheet = workbook.Sheets[sheetName];
        
        // 시트 이름을 제목으로 추가
        pdf.setFontSize(14);
        pdf.setFont(fontLoaded ? fontName : 'helvetica', 'bold');
        pdf.text(sheetName, margin, yPosition);
        yPosition += 10;

        // Excel 데이터를 배열로 변환 (한글 인코딩 보존)
        // 원시 셀 값을 직접 읽어서 인코딩 문제 방지
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const jsonData: any[][] = [];
        
        // 시트 범위를 순회하며 원시 셀 값 읽기
        for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
          const row: any[] = [];
          for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
            const cell = worksheet[cellAddress];
            
            if (cell) {
              // 셀 값이 있는 경우 - 원시 값 사용
              let cellValue = cell.v;
              
              // 날짜인 경우 문자열로 변환
              if (cell.t === 'd' && cellValue instanceof Date) {
                cellValue = cellValue.toISOString().split('T')[0];
              }
              // 숫자인 경우 그대로 사용
              else if (cell.t === 'n') {
                cellValue = cellValue;
              }
              // 문자열인 경우 원시 값 사용 (한글 보존)
              else if (cell.t === 's') {
                cellValue = String(cellValue);
              }
              // 공식 결과 사용
              else if (cell.t === 'e') {
                cellValue = cell.w || '';
              }
              // 기타 타입
              else {
                cellValue = String(cellValue || '');
              }
              
              row.push(cellValue);
            } else {
              // 빈 셀
              row.push('');
            }
          }
          
          // 빈 행이 아닌 경우에만 추가 (모든 셀이 비어있지 않은 행)
          if (row.some(cell => cell !== '' && cell !== null && cell !== undefined)) {
            jsonData.push(row);
          }
        }
        
        // 빈 시트 처리
        if (jsonData.length === 0) {
          // sheet_to_json을 폴백으로 사용
          const fallbackData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '',
            raw: true // 원시 값 사용
          });
          if (fallbackData.length > 0) {
            jsonData.push(...(fallbackData as any[][]));
          }
        }

        if (jsonData.length === 0) {
          pdf.setFontSize(10);
          pdf.setFont(fontLoaded ? fontName : 'helvetica', 'normal');
          pdf.text('(빈 시트)', margin, yPosition);
          yPosition += 10;
          return;
        }

        // 열 너비 계산
        pdf.setFontSize(10);
        pdf.setFont(fontLoaded ? fontName : 'helvetica', 'normal');
        
        const colWidths: number[] = [];
        const numCols = Math.max(...jsonData.map(row => (row as any[]).length));
        
        // 각 열의 최대 너비 계산 (샘플링하여 성능 최적화)
        for (let col = 0; col < numCols; col++) {
          let maxWidth = 0;
          const sampleSize = Math.min(jsonData.length, 100); // 처음 100개 행만 샘플링
          for (let row = 0; row < sampleSize; row++) {
            const cellValue = String(jsonData[row]?.[col] || '').trim();
            const textWidth = pdf.getTextWidth(cellValue);
            maxWidth = Math.max(maxWidth, textWidth);
          }
          // 최소 너비 보장 (너무 좁지 않게)
          colWidths.push(Math.max(maxWidth + 5, 20));
        }

        // 총 너비가 페이지를 넘지 않도록 조정
        const totalColWidth = colWidths.reduce((sum, width) => sum + width, 0);
        if (totalColWidth > maxWidth) {
          const scale = maxWidth / totalColWidth;
          colWidths.forEach((width, index) => {
            colWidths[index] = width * scale;
          });
        }

        // 데이터 행 처리
        pdf.setFont(fontLoaded ? fontName : 'helvetica', 'normal');
        const rowHeight = 8;
        
        for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
          // 페이지 하단에 도달하면 새 페이지 추가
          if (yPosition + rowHeight > pageHeight - margin) {
            pdf.addPage();
            // 새 페이지에서도 한글 폰트 설정 유지
            if (fontLoaded) {
              pdf.setFont(fontName);
            }
            yPosition = margin;
          }

          const row = jsonData[rowIndex] as any[];
          let xPosition = margin;

          // 각 셀 내용 추가
          for (let colIndex = 0; colIndex < Math.min(numCols, colWidths.length); colIndex++) {
            let cellValue = row[colIndex];
            
            // 셀 값이 null이나 undefined인 경우 빈 문자열로 처리
            if (cellValue === null || cellValue === undefined) {
              cellValue = '';
            }
            
            // 숫자나 날짜인 경우 문자열로 변환 (한글 인코딩 보존)
            let displayText = '';
            if (typeof cellValue === 'number') {
              displayText = cellValue.toString();
            } else if (cellValue instanceof Date) {
              displayText = cellValue.toISOString().split('T')[0];
            } else {
              displayText = String(cellValue || '').trim();
            }
            
            // 셀 내용이 너무 길면 잘라내기
            const maxCellWidth = colWidths[colIndex];
            
            if (pdf.getTextWidth(displayText) > maxCellWidth) {
              let truncatedText = displayText;
              while (pdf.getTextWidth(truncatedText + '...') > maxCellWidth && truncatedText.length > 0) {
                truncatedText = truncatedText.slice(0, -1);
              }
              displayText = truncatedText + '...';
            }

            // 한글 폰트 설정 (첫 번째 행은 볼드)
            if (fontLoaded) {
              pdf.setFont(fontName, rowIndex === 0 ? 'bold' : 'normal');
            } else {
              pdf.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal');
            }

            pdf.text(displayText, xPosition, yPosition, {
              maxWidth: colWidths[colIndex],
              align: 'left'
            });
            
            xPosition += colWidths[colIndex];
          }

          yPosition += rowHeight;
          
          // 너무 많은 행이 있으면 일부만 변환 (성능 최적화)
          if (rowIndex >= 1000) {
            pdf.setFont(fontLoaded ? fontName : 'helvetica', 'italic');
            pdf.text('(더 많은 데이터가 있지만 표시되지 않았습니다)', margin, yPosition);
            break;
          }
        }
      });

      // PDF를 Blob으로 변환
      const pdfBlob = pdf.output('blob');
      setConvertedFile(pdfBlob);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      alert(`변환 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
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
    const fileName = selectedFile.name.replace(/\.(xls|xlsx)$/i, '.pdf');
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
            <li className='text-gray-900 font-medium'>엑셀 PDF 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            엑셀 PDF 변환
          </h1>
          <p className='text-lg text-gray-600'>
            파일 크기 제한이나 광고 워터마크는 없습니다. 간단히, 그리고 무료로
            엑셀 파일을 PDF로 만들 수 있는 온라인 툴입니다.
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
              accept='.xls,.xlsx'
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              지원하는 형식: PDF, DOC, XLS, PPT, PNG, JPG
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
              계정 등록 없이 무료 사용
            </h3>
            <p className='text-sm text-gray-600'>
              회원가입 없이 바로 사용할 수 있는 간편한 변환 도구입니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Zap className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              시작하려면 파일을 끌어서 놓으세요. 쉽죠!
            </h3>
            <p className='text-sm text-gray-600'>
              드래그 앤 드롭으로 간단하게 파일을 업로드하고 변환할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Users className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              2013년부터 17억 명이 사용
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 변환 서비스입니다
            </p>
          </div>
        </div>

        {/* Convert Excel Spreadsheets to PDFs With Ease */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            엑셀 파일을 PDF로 변환하는 방법
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            엑셀 파일을 상자 안으로 드래그 앤 드롭하거나 파일 선택 버튼을
            클릭해서 업로드할 파일을 검색합니다. 파일은 즉시 PDF로 변환되며,
            바로 다운로드가 가능합니다.
          </p>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                안전한 변환 작업
              </h3>
              <p className='text-sm text-gray-600'>
                작업이 완료된 엑셀 및 PDF 파일은 한 시간 후 서버에서 영구히
                삭제됩니다. 더 많은 정보를 원하시면 개인정보 보호정책을
                확인하시기 바랍니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                모든 플랫폼 지원
              </h3>
              <p className='text-sm text-gray-600'>
                윈도우, 맥 또는 리눅스 등, 사용자의 OS에 상관이 없이 모든
                플랫폼에서 엑셀을 PDF로 변환 가능합니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                순식간에 엑셀을 PDF로!
              </h3>
              <p className='text-sm text-gray-600'>
                자동 설정으로 액셀 파일을 간단히 변환합니다. 복잡한 옵션을
                선택하지 않아도, 생성된 PDF 파일은 정확히 원하는 형태로
                표시됩니다!
              </p>
            </div>
          </div>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Zap className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                단 한 번의 클릭으로 PDF 만들기
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              사용자가 파일을 업로드하기만 하면 xls나 xlsx 파일이 자동으로 PDF로
              변환되며, 나머지 작업은 서버가 모두 처리합니다. 이보다 더 간편할
              수 있을까요?
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Cloud className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>클라우드에서 변환</h3>
            </div>
            <p className='text-sm text-gray-600'>
              엑셀 PDF 변환 작업은 클라우드에서 처리되기 때문에 사용자의 컴퓨터
              메모리를 전혀 소모하지 않습니다. 정말 편리하죠?
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                파일 크기 제한 없음
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              파일 크기에 상관없이 엑셀 파일을 PDF로 변환할 수 있습니다. 큰
              스프레드시트도 문제없이 처리됩니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인으로 Excel을 PDF로 변환하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환기에 XLS 또는 XLSX 파일을 가져오거나 끌어다 놓습니다
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
                변환된 PDF 파일을 다운로드하거나 공유하기만 하면 끝!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
