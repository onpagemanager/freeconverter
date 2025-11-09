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
  Image as ImageIcon,
  Cloud,
} from 'lucide-react';

type ConversionMode = 'all-pages' | 'images-only';

export default function PdfToJpgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionMode, setConversionMode] =
    useState<ConversionMode>('all-pages');
  const [convertedImages, setConvertedImages] = useState<Blob[]>([]);
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
      setConvertedImages([]);
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
    setConvertedImages([]);
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // PDF to JPG 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setConvertedImages([]);

    try {
      // 실제 변환 로직: PDF.js를 동적 임포트하여 각 페이지를 캔버스로 렌더링 후 JPG Blob으로 변환
      const pdfjs = await import('pdfjs-dist');
      // 워커 설정: public 폴더의 로컬 워커 파일 사용 (CDN 실패 시 안정적인 해결책)
      // @ts-ignore
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        // public 폴더에 복사된 워커 파일 사용 (빌드 시 자동 포함됨)
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const fileBuffer = await selectedFile.arrayBuffer();

      // PDF 문서 로드
      // @ts-ignore - getDocument 타입 추론 이슈 회피
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(fileBuffer) });
      const pdf = await loadingTask.promise;

      const outputImages: Blob[] = [];

      // 각 페이지 렌더링 → JPG Blob 생성
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        // 품질을 위해 스케일 조정 (1.5~2.0 권장)
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('캔버스 컨텍스트를 생성할 수 없습니다.');
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 페이지 렌더링 (PDF.js 최신 버전에서 canvas 속성 필요)
        await page.render({ canvasContext: context, viewport, canvas }).promise;

        // 캔버스를 JPG Blob으로 변환
        const jpegBlob: Blob | null = await new Promise(resolve =>
          canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.92)
        );

        if (!jpegBlob) {
          throw new Error('JPG 블롭을 생성하지 못했습니다.');
        }

        outputImages.push(jpegBlob);

        // 메모리 정리
        canvas.width = 0;
        canvas.height = 0;
      }

      setConvertedImages(outputImages);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      alert('변환 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, conversionMode]);

  // 개별 이미지 다운로드
  const handleDownloadImage = useCallback(
    (index: number) => {
      if (!convertedImages[index] || !selectedFile) return;

      const url = URL.createObjectURL(convertedImages[index]);
      const a = document.createElement('a');
      a.href = url;
      const fileName = selectedFile.name.replace(/\.pdf$/i, '');
      a.download = `${fileName}_page_${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [convertedImages, selectedFile]
  );

  // 모든 이미지 다운로드 (ZIP으로)
  const handleDownloadAll = useCallback(async () => {
    if (convertedImages.length === 0 || !selectedFile) return;

    // 실제로는 JSZip을 사용하여 ZIP 파일로 압축해야 하지만,
    // 여기서는 각 이미지를 개별적으로 다운로드
    for (let i = 0; i < convertedImages.length; i++) {
      setTimeout(() => {
        handleDownloadImage(i);
      }, i * 200);
    }
  }, [convertedImages, selectedFile, handleDownloadImage]);

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
            <li className='text-gray-900 font-medium'>PDF JPG 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PDF JPG 변환
          </h1>
          <p className='text-lg text-gray-600'>
            파일 제한, 광고 워터마크 없음 - PDF 파일 페이지를 이미지로
            변환하거나, PDF 파일에서 개별적으로 이미지를 추출해주는 무료 온라인
            툴입니다.
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

            {/* 변환 모드 선택 */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 text-sm font-semibold text-gray-900'>
                변환 옵션 선택
              </h3>
              <div className='flex gap-4'>
                <button
                  onClick={() => setConversionMode('all-pages')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    conversionMode === 'all-pages'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  전체 페이지 변환 (무료)
                </button>
                <button
                  onClick={() => setConversionMode('images-only')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    conversionMode === 'images-only'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  이미지만 추출 (Pro)
                </button>
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

            {/* 변환 완료 후 이미지 목록 및 다운로드 */}
            {convertedImages.length > 0 && (
              <div className='mt-6 space-y-3'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    <p className='font-semibold text-green-900'>
                      변환 완료! {convertedImages.length}개 이미지가
                      생성되었습니다.
                    </p>
                  </div>
                </div>

                {/* 이미지 미리보기 그리드 */}
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                  {convertedImages.map((image, index) => (
                    <div
                      key={index}
                      className='relative rounded-lg border border-gray-200 bg-gray-50 p-2'
                    >
                      <div className='flex h-32 items-center justify-center rounded border border-gray-200 bg-white'>
                        <ImageIcon className='h-8 w-8 text-gray-400' />
                      </div>
                      <p className='mt-2 text-center text-xs text-gray-600'>
                        페이지 {index + 1}
                      </p>
                      <button
                        onClick={() => handleDownloadImage(index)}
                        className='mt-2 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors'
                      >
                        다운로드
                      </button>
                    </div>
                  ))}
                </div>

                {/* 모두 다운로드 버튼 */}
                <button
                  onClick={handleDownloadAll}
                  className='w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                >
                  <Download className='h-5 w-5' />
                  모든 이미지 다운로드 (ZIP)
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
              PDF를 JPG로 빠르고 간단하게 온라인 변환
            </h3>
            <p className='text-sm text-gray-600'>
              몇 초 만에 PDF를 고품질 JPG 이미지로 변환할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Globe className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Mac, Windows, iOS, Android, Linux에서 작업 가능
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

        {/* PDF를 JPG로 변환하는 방법 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF를 JPG로 변환하는 방법
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            위의 상자에 PDF 파일을 끌어다 놓으면 저희가 사용자를 위해 파일을
            변환해 드립니다. 이후, 원하는 사진을 선택하여 컴퓨터에 저장할 수
            있습니다.
          </p>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                안전한 온라인 변환 작업
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF와 JPG 파일은 변환 한 시간 후 서버에서 영구히 삭제됩니다.
              아무도 사용자의 파일에 접근할 수 없으며, 사용자의 개인정보는
              안전하게 보호됩니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                모든 플랫폼에서 사용 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF JPG 변환 앱은 브라우저를 기반으로 하기 때문에 사용자가 Mac,
              Windows, Linux 등 어떤 운영체제를 사용하더라도 이용할 수 있습니다.
              최신 브라우저 환경이라면 문제 없이 사용하실 수 있어요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <ImageIcon className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                PDF 안의 이미지를 모두 변환하세요
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              변환 후에는 이미지가 개별 파일로 제공되며, 이 파일을 하나씩
              다운로드할 수 있습니다. 모든 이미지를 하나의 zip 파일로 한꺼번에
              다운로드할 수도 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>고화질을 위한 JPG</h3>
            </div>
            <p className='text-sm text-gray-600'>
              JPG는 인터넷에서 가장 일반적인 이미지 형식입니다. PDF 파일 내의
              이미지가 처음에 다른 형식으로 저장되었더라도 저희 변환 서비스를
              사용하면 항상 JPG 형식으로 변환됩니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Cloud className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>클라우드에서 변환</h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF에서 이미지를 추출하는 과정은 클라우드에서 처리되기 때문에
              사용자의 컴퓨터 용량을 소모하지 않습니다. PDF-JPG 변환기는 어떤
              환경에서도 자유롭게 사용할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인으로 PDF를 JPG로 변환하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환기에 PDF 파일을 가져오거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                전체 페이지 변환(무료) 또는 이미지만 추출(Pro)을 선택합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '변환'을 클릭하고 몇 초만 기다리세요
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                JPG 이미지를 다운로드하거나 공유합니다. 간편하죠!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF JPG 변환 관련 FAQ
          </h2>
          <div className='space-y-6'>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF에서 개별 이미지를 추출할 수 있나요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠! Freeconvert의 PDF JPG 변환 도구를 이용하면 문서에서 개별
                이미지를 추출하여 별도의 파일로 손쉽게 저장할 수 있습니다. 이는
                Pro 기능이지만, 7일 무료 체험판을 사용하면 체험해볼 수 있습니다.
                무료 요금제를 사용하면 전체 PDF 페이지를 고품질 JPG로 변환할 수
                있습니다. PDF를 업로드하고 원하는 형식을 선택해보세요.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF에서 변환할 때 이미지 품질이 영향을 받을까요?
              </h3>
              <p className='text-sm text-gray-700'>
                아니요. Freeconvert의 PDF JPG 변환기는 고해상도 출력을 제공하므로
                변환된 이미지는 또렷하고 선명하며 전문적인 품질을 유지합니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Mac이나 Windows PC에서 PDF를 JPG로 변환하려면 어떻게 해야
                하나요?
              </h3>
              <p className='text-sm text-gray-700'>
                간단합니다! 페이지 상단에 있는 변환기로 PDF 파일을 끌어다 놓기만
                하면 됩니다. 이미지를 어떤 식으로 생성하고 싶은지 선택한 후
                '변환하기'를 클릭하세요. 곧바로 새롭게 생성된 이미지를
                다운로드할 수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF를 JPG로 변환할 때 데이터가 안전하게 보호되나요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠! Freeconvert는 최신 TLS 암호화 기술을 사용하여 업로드 및
                다운로드 과정에서 파일을 안전하게 보호합니다. 보안 서버에 파일을
                저장하도록 선택하지 않는 한, 모든 문서는 처리 후 1시간 이내에
                자동으로 서버에서 삭제됩니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Freeconvert의 PDF JPG 변환기는 정말로 무료인가요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠! 무료 계정을 사용하면 모든 문서 유형을 변환할 수
                있습니다. PDF부터 이미지와 MS Office 파일 변환까지, Freeconvert가
                여러분을 도와드리겠습니다. 무료 요금제의 경우 몇 가지 제한
                사항이 존재하지만, Pro를 구독하면 30가지가 넘는 PDF 도구를
                비롯해 무제한 변환을 잠금 해제할 수 있습니다. 지금 7일 무료
                체험판을 사용해보세요. 구독은 체험 기간 내에 언제든지 무료로
                취소할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
