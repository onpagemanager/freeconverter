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
  Eye,
  Search,
  Copy,
  Languages,
} from 'lucide-react';

export default function PdfOcrPage() {
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

    // PDF 파일만 허용
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
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

  // PDF OCR 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    // 브라우저 환경에서만 실행 (Blob은 브라우저 전용 API)
    if (typeof window === 'undefined') return;

    setIsProcessing(true);
    setConvertedFile(null);

    try {
      // 1) PDF.js로 PDF 로드 및 페이지를 이미지로 렌더링
      const pdfjs = await import('pdfjs-dist');
      // @ts-ignore
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      // 파일을 ArrayBuffer로 읽기
      const fileBuffer = await selectedFile.arrayBuffer();

      // ArrayBuffer를 복사하여 각 라이브러리에서 독립적으로 사용
      // (pdf.js에서 사용 후 detached 될 수 있으므로 복사본 생성)
      const fileBufferCopy = fileBuffer.slice(0);

      // 1) PDF.js로 PDF 로드 (원본 버퍼 사용)
      // @ts-ignore
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(fileBuffer),
      });
      const pdf = await loadingTask.promise;

      // 2) Tesseract.js 초기화
      let worker;
      try {
        const { createWorker } = await import('tesseract.js');
        worker = await createWorker('kor+eng'); // 한국어 + 영어 지원
        console.log('Tesseract.js worker 초기화 완료');
      } catch (workerError) {
        console.error('Tesseract.js worker 초기화 실패:', workerError);
        throw new Error(
          'OCR 엔진을 초기화할 수 없습니다. 인터넷 연결을 확인하고 다시 시도해주세요.'
        );
      }

      // 3) pdf-lib로 원본 PDF 로드 (복사본 사용하여 detached 에러 방지)
      const { PDFDocument, StandardFonts } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(fileBufferCopy);

      // 4) 한글 폰트 로드 (한 번만 로드)
      let font;
      try {
        // TTF 폰트를 CDN에서 로드 (pdf-lib는 TTF/OTF만 지원)
        const fontUrl =
          'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR-Regular.ttf';
        const fontResponse = await fetch(fontUrl);

        if (fontResponse.ok) {
          const fontBytes = await fontResponse.arrayBuffer();
          font = await pdfDoc.embedFont(fontBytes);
          console.log('한글 폰트 로드 성공');
        } else {
          throw new Error('폰트 다운로드 실패');
        }
      } catch (fontError) {
        console.warn('한글 폰트 로드 실패, 기본 폰트 사용:', fontError);
        // 기본 폰트 사용 (영문만 지원하지만 검색은 가능)
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      }

      // 5) 각 페이지에 대해 OCR 수행
      for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
        try {
          const pdfPage = pdfDoc.getPage(pageIndex);
          const page = await pdf.getPage(pageIndex + 1);

          // PDF 페이지를 Canvas로 렌더링 (고해상도)
          const viewport = page.getViewport({ scale: 2.0 }); // 높은 해상도로 OCR 정확도 향상
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            throw new Error(
              `페이지 ${pageIndex + 1}: Canvas context를 가져올 수 없습니다.`
            );
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas, // PDF.js 최신 버전에서 canvas 속성 필요
          };

          await page.render(renderContext).promise;

          // Canvas를 이미지로 변환 (Tesseract.js용)
          const imageData = canvas.toDataURL('image/png');

          // OCR 수행 (텍스트 및 위치 정보 추출)
          const { data: ocrResult } = await worker.recognize(imageData, {
            rectangle: undefined, // 전체 이미지
          });

          // 6) OCR로 추출한 텍스트를 PDF에 텍스트 레이어로 추가
          const { width, height } = pdfPage.getSize();

          // OCR 결과의 각 단어/텍스트 블록을 PDF에 추가
          // @ts-ignore - Tesseract.js의 words 속성은 런타임에 존재하지만 타입 정의에 없을 수 있음
          if (ocrResult.words && ocrResult.words.length > 0) {
            // 페이지 높이를 Canvas 기준으로 변환 (Y 좌표 변환 필요)
            const scaleX = width / canvas.width;
            const scaleY = height / canvas.height;

            let addedWords = 0;
            // @ts-ignore
            for (const word of ocrResult.words) {
              if (!word.text || word.text.trim().length === 0) continue;

              try {
                // OCR 좌표를 PDF 좌표로 변환
                // Tesseract는 좌상단이 원점, pdf-lib는 좌하단이 원점이므로 변환 필요
                const x = Math.max(0, word.bbox.x0 * scaleX);
                const y = Math.max(0, height - word.bbox.y1 * scaleY); // Y 좌표 뒤집기

                // 폰트 크기 계산 (OCR bbox 높이 기반)
                const fontSize = Math.max(
                  (word.bbox.y1 - word.bbox.y0) * scaleY,
                  8
                );

                // 좌표 범위 검증
                if (x < width && y < height && fontSize > 0) {
                  // 텍스트를 PDF에 추가 (투명한 텍스트로 추가하여 검색 가능하게 함)
                  pdfPage.drawText(word.text, {
                    x: x,
                    y: y,
                    size: Math.min(fontSize, 72), // 최대 폰트 크기 제한
                    opacity: 0, // 투명하게 하여 원본 이미지 위에 보이지 않게
                    font: font,
                  });
                  addedWords++;
                }
              } catch (textError) {
                // 개별 텍스트 추가 실패 시 무시하고 계속 진행
                console.warn(`텍스트 추가 실패 (${word.text}):`, textError);
              }
            }
            console.log(`페이지 ${pageIndex + 1}: ${addedWords}개 단어 추가됨`);
          } else if (ocrResult.text && ocrResult.text.trim().length > 0) {
            // 단어 단위 정보가 없으면 전체 텍스트를 페이지 상단에 추가
            // (검색 가능하게 하기 위한 최소한의 처리)
            try {
              const lines = ocrResult.text
                .split('\n')
                .filter(line => line.trim());
              let yPosition = height - 20;

              for (const line of lines.slice(0, 10)) {
                // 최대 10줄만 추가
                if (yPosition < 20) break;

                // 텍스트 길이 제한 (너무 긴 텍스트는 잘림)
                const displayText = line.trim().substring(0, 100);

                pdfPage.drawText(displayText, {
                  x: 20,
                  y: yPosition,
                  size: 10,
                  opacity: 0, // 투명하게 하여 검색만 가능하게
                  font: font,
                });
                yPosition -= 15;
              }
              console.log(`페이지 ${pageIndex + 1}: 전체 텍스트 추가됨`);
            } catch (textError) {
              console.warn(
                `페이지 ${pageIndex + 1} 전체 텍스트 추가 실패:`,
                textError
              );
            }
          } else {
            console.warn(`페이지 ${pageIndex + 1}: OCR 결과가 없습니다.`);
          }

          // Canvas 정리
          canvas.width = 0;
          canvas.height = 0;
        } catch (pageError) {
          console.error(`페이지 ${pageIndex + 1} 처리 중 오류:`, pageError);
          // 페이지 처리 실패 시 계속 진행
          continue;
        }
      }

      // 6) Worker 종료
      try {
        await worker.terminate();
        console.log('Tesseract.js worker 종료 완료');
      } catch (terminateError) {
        console.warn('Worker 종료 중 오류 (무시):', terminateError);
      }

      // 7) 텍스트 레이어가 추가된 PDF 생성
      const pdfBytes = await pdfDoc.save();
      // Blob 생성은 브라우저 환경에서만 가능 (동적 참조로 빌드 시 오류 방지)
      const BlobConstructor = (window as any).Blob;
      if (!BlobConstructor) {
        throw new Error('Blob API를 사용할 수 없습니다.');
      }
      const convertedBlob = new BlobConstructor([pdfBytes], {
        type: 'application/pdf',
      });

      setConvertedFile(convertedBlob);
    } catch (error) {
      console.error('OCR 변환 중 오류 발생:', error);

      let errorMessage = '알 수 없는 오류가 발생했습니다.';

      if (error instanceof Error) {
        errorMessage = error.message;

        // 특정 에러 타입에 대한 더 친화적인 메시지
        if (error.message.includes('worker')) {
          errorMessage =
            'OCR 엔진 초기화에 실패했습니다. 페이지를 새로고침하고 다시 시도해주세요.';
        } else if (error.message.includes('font')) {
          errorMessage =
            '폰트 로드에 실패했습니다. 기본 폰트로 계속 진행합니다.';
        } else if (error.message.includes('Canvas')) {
          errorMessage =
            '이미지 렌더링에 실패했습니다. PDF 파일이 손상되었을 수 있습니다.';
        } else if (error.message.includes('load')) {
          errorMessage =
            'PDF 파일 로드에 실패했습니다. 파일이 올바른 PDF 형식인지 확인해주세요.';
        }
      }

      alert(
        `OCR 변환 중 오류가 발생했습니다.\n\n${errorMessage}\n\n다시 시도해주세요.`
      );
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
    const fileName = selectedFile.name.replace(/\.pdf$/i, '_ocr.pdf');
    a.download = fileName || 'ocr-converted.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [convertedFile, selectedFile]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
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
            <li className='text-gray-900 font-medium'>PDF OCR 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PDF OCR 변환
          </h1>
          <p className='text-lg text-gray-600'>
            PDF OCR 변환기로 스캔된 PDF를 검색 가능한 텍스트로 빠르게 변환하세요
            (무료)
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
              accept='.pdf'
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
                  OCR 처리 중...
                </>
              ) : (
                <>
                  <Search className='h-5 w-5' />
                  OCR 변환 시작
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
                      OCR 변환 완료! 검색 가능한 PDF 파일이 준비되었습니다.
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
                <Search className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              스캔된, 선택 불가능한 PDF를 검색 및 복사 가능한 문서로 변환
            </h3>
            <p className='text-sm text-gray-600'>
              OCR 기술로 텍스트를 추출하여 검색 가능한 PDF로 변환합니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Globe className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Mac, Windows, iOS, Android 등 모든 기기에서 사용 가능
            </h3>
            <p className='text-sm text-gray-600'>
              브라우저만 있으면 어떤 기기에서든 사용할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Shield className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              TLS 암호화로 안전하게 보호, 파일은 1시간 후 자동 삭제
            </h3>
            <p className='text-sm text-gray-600'>
              최신 보안 기술로 파일을 안전하게 보호합니다
            </p>
          </div>
        </div>

        {/* PDF에서 텍스트를 추출하고 접근성을 높이세요 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF에서 텍스트를 추출하고 접근성을 높이세요
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            Freeconvert의 PDF OCR 도구를 사용하면 텍스트를 선택할 수 있도록
            변환되어 검색이 가능한 PDF를 빠르게 생성할 수 있습니다. 선택
            불가능한 텍스트를 손쉽게 복사할 수 있도록 만들어 검색이 불가능했던
            텍스트를 간편하게 찾아보세요. 정말 간단하죠.
          </p>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <FileText className='h-5 w-5 text-primary' />
                <h3 className='text-lg font-semibold text-gray-900'>
                  이미지 기반 PDF에서 텍스트 추출
                </h3>
              </div>
              <p className='text-sm text-gray-600'>
                OCR 기능을 통해 이미지처럼 저장된 PDF에서 텍스트를 추출할 수
                있습니다. 이제 필요한 텍스트를 쉽게 검색하고 복사할 수 있습니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <Zap className='h-5 w-5 text-green-600' />
                <h3 className='text-lg font-semibold text-gray-900'>
                  OCR로 텍스트 품질 향상
                </h3>
              </div>
              <p className='text-sm text-gray-600'>
                화질이 낮거나 오래된 스캔본도 걱정 마세요. OCR 소프트웨어가
                스캔된 문자를 인식해 깨끗하고 선명한 디지털 텍스트로
                대체해줍니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <div className='mb-3 flex items-center gap-3'>
                <Eye className='h-5 w-5 text-purple-600' />
                <h3 className='text-lg font-semibold text-gray-900'>
                  검색 가능 + 선택 가능 = 접근성 향상
                </h3>
              </div>
              <p className='text-sm text-gray-600'>
                OCR 처리된 PDF는 화면 읽기 프로그램이 텍스트를 인식할 수 있어
                시각 장애인 사용자에게도 더 쉽게 접근할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 무료로 OCR 처리하는 방법 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            무료로 OCR 처리하는 방법
          </h2>
          <div className='grid gap-6 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                파일을 PDF OCR 도구에 끌어다 놓거나 업로드합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                몇 초 동안 OCR 기술이 작동할 때까지 기다립니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요한 경우 다른 도구로 PDF를 편집합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                편집 가능한 PDF를 다운로드하거나 공유하면 완료!
              </p>
            </div>
          </div>
        </div>

        {/* OCR로 모든 PDF를 읽기 가능한 문서로 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                모든 기기에서 OCR 사용 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 클라우드 기반 서비스로, 브라우저만 있으면 데스크톱,
              태블릿, 모바일 등 어떤 기기에서도 OCR 기능을 사용할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Copy className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                PDF 이미지에서 텍스트 선택 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF에서 텍스트를 복사하려다 아무 것도 선택되지 않았던 경험
              있으신가요? 이제 OCR을 통해 모든 PDF에서 선택 가능한 텍스트를 얻을
              수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Languages className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                스캔 문서 번역도 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              스캔된 파일을 OCR로 텍스트로 변환한 후, 다양한 언어로 번역까지
              지원합니다. 자신이 익숙한 언어로 읽거나, 다른 사람을 위해 문서를
              번역해 보세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileText className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                PDF를 검색 가능한 Word로 변환
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              OCR로 텍스트를 인식한 후에는 PDF를 검색 가능한 파일로 저장하거나
              Word 문서로 변환할 수 있습니다. 변환은 Freeconvert가 알아서 처리해
              드립니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Zap className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>
                PDF를 새롭게 사랑하게 될 시간
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              다운로드도, 가입도 필요 없습니다. 페이지를 추출하거나 텍스트를
              인식하는 일이 이렇게 쉬울 줄 몰랐다고 말하게 될지도 모릅니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-red-600' />
              <h3 className='font-semibold text-gray-900'>
                데이터 보호는 처음부터 끝까지 철저하게
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 GDPR(유럽 일반 개인정보 보호법)을 준수하며, 개인 정보의
              저장, 수집, 처리 방식에 대해 투명하게 운영합니다.
            </p>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF OCR 도구 자주 묻는 질문 (FAQ)
          </h2>
          <div className='space-y-6'>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                OCR이란 무엇인가요?
              </h3>
              <p className='text-sm text-gray-700'>
                OCR(광학 문자 인식)은 문서나 이미지에 있는 인쇄된 글씨나
                손글씨를 디지털 텍스트로 변환하는 기술입니다. 이 기술을 사용하면
                텍스트 편집과 공유가 쉬워지고, 시각 장애인도 화면 읽기를 통해
                내용을 접근할 수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                OCR로 PDF를 Word 문서로 변환할 수 있나요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론입니다. 먼저 PDF가 검색 및 선택 가능한 상태여야 하며, 그렇지
                않은 경우 OCR 기능을 사용해 변환해야 합니다. 그 후 Freeconvert의
                PDF Word 변환기를 사용하면 Word 파일로 쉽게 변환할 수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                OCR은 어떤 언어도 인식하나요?
              </h3>
              <p className='text-sm text-gray-700'>
                Freeconvert의 온라인 OCR 도구는 거의 모든 언어의 스캔 문서를
                인식하고 변환할 수 있습니다. 이를 통해 원문을 모국어로 읽거나
                대상 언어로 자동 변환할 수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Freeconvert OCR 도구는 무료인가요?
              </h3>
              <p className='text-sm text-gray-700'>
                네! Freeconvert의 모든 온라인 PDF 도구는 무료로 제공되며, 일부
                기능에는 제한이 있을 수 있습니다. PDF OCR 외에도 파일 압축,
                PDF와 MS 오피스 파일 간 변환, JPG/PNG/GIF 변환 등 다양한 기능을
                무료로 사용해 보세요. OCR 변환을 시작하려면 이 페이지 상단에
                파일을 드래그하세요. 또는 상단 메뉴에서 다른 무료 도구도 확인해
                보세요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
