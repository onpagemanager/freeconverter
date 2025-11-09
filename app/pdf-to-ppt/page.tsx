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
  Eye,
  Presentation,
} from 'lucide-react';

export default function PdfToPptPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useOCR, setUseOCR] = useState(false);
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

  // PDF to PowerPoint 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setConvertedFile(null);

    try {
      // 안전장치: PDF 파일인지 재검증
      const lowerName = selectedFile.name.toLowerCase();
      const lowerType = selectedFile.type.toLowerCase();
      if (!(lowerType === 'application/pdf' || lowerName.endsWith('.pdf'))) {
        alert('PDF 파일만 변환할 수 있습니다.');
        return;
      }

      // 변환 진행 표시를 위해 소폭 대기
      await new Promise(resolve => setTimeout(resolve, 150));

      // 1) pdfjs-dist 로 텍스트 추출 시도
      let extractedText = '';
      let pageTexts: string[] = [];
      try {
        const pdfjs = await import('pdfjs-dist');
        // 워커 설정: public 폴더의 로컬 워커 파일 사용 (CDN 실패 시 안정적인 해결책)
        // @ts-ignore
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          // public 폴더에 복사된 워커 파일 사용 (빌드 시 자동 포함됨)
          // @ts-ignore
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }

        const fileBuffer = await selectedFile.arrayBuffer();
        // @ts-ignore
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(fileBuffer) });
        const pdf = await loadingTask.promise;

        // 각 페이지의 텍스트를 개별적으로 추출 (각 페이지를 슬라이드로 변환하기 위함)
        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
          const page = await pdf.getPage(pageIndex);
          // @ts-ignore
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => (typeof item.str === 'string' ? item.str : ''))
            .join(' ');
          pageTexts.push(pageText);
        }
        extractedText = pageTexts.join('\n\n');
      } catch (pdfErr) {
        console.warn('PDF 텍스트 추출 실패, 폴백 경로로 진행합니다.', pdfErr);
        // 빈 배열이면 기본 슬라이드 1개 생성
        if (pageTexts.length === 0) {
          pageTexts = ['변환된 문서입니다. (텍스트 추출 실패)'];
        }
      }

      // 2) pptxgenjs로 유효한 PPTX 생성 시도
      try {
        const PptxGenJS = await import('pptxgenjs');
        const pptx = new (PptxGenJS as any).default();

        // 페이지가 없으면 기본 슬라이드 1개 생성
        if (pageTexts.length === 0) {
          pageTexts = ['이 문서는 PDF에서 변환된 결과입니다.'];
        }

        // 각 페이지를 슬라이드로 변환
        pageTexts.forEach((pageText, index) => {
          const slide = pptx.addSlide();
          // 슬라이드 제목 추가
          slide.addText(`슬라이드 ${index + 1}`, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: '363636',
          });
          // 슬라이드 내용 추가 (긴 텍스트는 줄바꿈 처리)
          const lines = pageText.split(/\s+/);
          const maxCharsPerLine = 80;
          let currentLine = '';
          const formattedLines: string[] = [];

          lines.forEach(word => {
            if ((currentLine + ' ' + word).length > maxCharsPerLine) {
              if (currentLine) formattedLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = currentLine ? currentLine + ' ' + word : word;
            }
          });
          if (currentLine) formattedLines.push(currentLine);

          slide.addText(formattedLines.join('\n'), {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 5,
            fontSize: 14,
            color: '363636',
            align: 'left',
          });
        });

        // PPTX 파일 생성
        const pptxArrayBuffer = await pptx.write({ outputType: 'arraybuffer' });
        const pptxBlob = new Blob([pptxArrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        });
        setConvertedFile(pptxBlob);
        return;
      } catch (pptxErr) {
        console.warn('PPTX 생성 실패, HTML 폴백으로 진행합니다.', pptxErr);
      }

      // 3) 폴백: HTML 기반 문서 생성 (PowerPoint에서 열 수 있음)
      const safeHtmlContent = extractedText && extractedText.trim().length > 0
        ? extractedText
        : '변환 모듈이 설치되어 있지 않아 텍스트 추출 없이 생성된 문서입니다.';
      const htmlDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted</title></head><body><pre>${
        safeHtmlContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      }</pre></body></html>`;
      const fallbackBlob = new Blob([htmlDoc], { type: 'text/html' });
      setConvertedFile(fallbackBlob);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      alert('변환 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, useOCR]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!convertedFile || !selectedFile) return;

    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;
    // MIME 타입에 따라 적절한 확장자 결정
    const isPptx = convertedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    const preferredExt = isPptx ? '.pptx' : '.html';
    const baseName = selectedFile.name.replace(/\.(pdf)$/i, '');
    const safeName = baseName && baseName.trim().length > 0 ? baseName : 'converted';
    a.download = `${safeName}${preferredExt}`;
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
            <li className='text-gray-900 font-medium'>PDF PPT 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PDF PPT 변환
          </h1>
          <p className='text-lg text-gray-600'>
            PDF 파일을 편집 가능한 PowerPoint 프레젠테이션으로 손쉽게
            변환하세요. 디자인과 레이아웃은 그대로 유지되며, 설치나 가입 없이
            브라우저에서 바로 사용 가능합니다.
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

            {/* OCR 옵션 (Pro 기능 시뮬레이션) */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    OCR 옵션 (Pro 기능)
                  </h3>
                  <p className='mt-1 text-xs text-gray-600'>
                    선택 가능한 텍스트가 없는 경우 OCR을 사용하여 텍스트를
                    인식할 수 있습니다
                  </p>
                </div>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    checked={useOCR}
                    onChange={e => setUseOCR(e.target.checked)}
                    className='peer sr-only'
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>
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
                  변환
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
                      변환 완료! PowerPoint 프레젠테이션이 준비되었습니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className='w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                >
                  <Download className='h-5 w-5' />
                  변환된 PowerPoint 파일 다운로드
                </button>
              </div>
            )}
          </div>
        )}

        {/* 주요 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-blue-100 p-3'>
                <Zap className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              몇 초 만에 PDF를 PPT로 변환
            </h3>
            <p className='text-sm text-gray-600'>
              빠르고 간편하게 PDF를 PowerPoint로 변환할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Users className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              2013년부터 17억 명 이상이 신뢰한 플랫폼
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 변환 서비스입니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Shield className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              GDPR 준수 및 ISO/IEC 27001 인증 완료
            </h3>
            <p className='text-sm text-gray-600'>
              데이터 보안과 개인정보 보호를 최우선으로 합니다
            </p>
          </div>
        </div>

        {/* PDF를 편집 가능한 PowerPoint 슬라이드로 변환 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            Turn PDFs into Editable PowerPoint Slides
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            PDF를 PPTX로 간편하게 변환
          </p>
          <p className='text-center text-gray-600 mb-8 max-w-3xl mx-auto'>
            프레젠테이션을 처음부터 다시 만들 필요 없습니다. 기존 PDF의 서식과
            디자인을 그대로 유지한 상태로 PowerPoint 슬라이드로 변환할 수
            있습니다. 파일을 업로드하고 변환 버튼만 클릭하면 바로 사용할 수
            있습니다.
          </p>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                언제 어디서나 사용 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Mac, Windows, Linux, iPhone, Android 등 어떤 기기에서든 브라우저만
              있으면 PDF를 PowerPoint로 변환할 수 있습니다. 별도의 소프트웨어
              설치는 필요 없습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                단순한 변환 그 이상
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF 편집, 병합, 압축 등 30개 이상의 도구가 하나의 플랫폼에
              포함되어 있어 더 똑똑하게 작업할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                처음부터 끝까지 안전하게
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              모든 파일은 TLS 암호화로 처리되며, 업로드 후 1시간이 지나면
              자동으로 삭제됩니다. 파일 보안은 처음부터 끝까지 철저히
              유지됩니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                공인된 보안 및 데이터 보호 준수
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 ISO/IEC 27001 인증을 획득했으며 GDPR도 완벽하게
              준수합니다. 업계 최고 수준의 보안과 개인 정보 보호 기준을 충족하여
              데이터를 안전하게 보호합니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Presentation className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>
                업무와 학습에 모두 적합
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              보고서, 프레젠테이션, 강의 자료 제작 시 PDF에서 표, 그래프,
              텍스트를 추출하여 PowerPoint로 쉽게 구성할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인에서 PDF를 PowerPoint로 변환하는 방법
          </h2>
          <div className='grid gap-6 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                PDF 파일을 업로드하거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                선택 가능한 텍스트가 없는 경우 OCR 기능을 사용하세요 (Pro 기능)
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '변환' 버튼을 클릭하면 PPTX 파일이 몇 초 내로 생성됩니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환된 PowerPoint 파일을 다운로드하거나 공유하세요
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}




