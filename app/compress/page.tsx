'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  FileCheck,
} from 'lucide-react';

export default function CompressPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<'basic' | 'strong'>(
    'basic'
  );
  const [compressedFiles, setCompressedFiles] = useState<
    { name: string; originalSize: number; compressedSize: number }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    // PDF 및 이미지 파일 필터링
    const allowedFiles = Array.from(files).filter(file => {
      const fileType = file.type.toLowerCase();
      return (
        fileType === 'application/pdf' ||
        fileType.startsWith('image/') ||
        file.name.toLowerCase().endsWith('.pdf')
      );
    });

    if (allowedFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...allowedFiles]);
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
  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setCompressedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 압축률 계산
  const calculateCompressionRatio = (
    original: number,
    compressed: number
  ): number => {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  // 파일 압축 핸들러
  const handleCompress = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setCompressedFiles([]);

    try {
      // 실제 압축 로직은 백엔드 API나 라이브러리를 사용해야 하지만,
      // 여기서는 시뮬레이션으로 처리
      const simulatedResults = await Promise.all(
        selectedFiles.map(async file => {
          // 실제로는 PDF.js나 다른 라이브러리를 사용하여 압축
          // 여기서는 시뮬레이션으로 30-70% 압축률 적용
          const compressionRate = compressionLevel === 'strong' ? 0.3 : 0.5;
          const compressedSize = Math.round(file.size * compressionRate);

          // 실제 압축 시간 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));

          return {
            name: file.name,
            originalSize: file.size,
            compressedSize: compressedSize,
          };
        })
      );

      setCompressedFiles(simulatedResults);
    } catch (error) {
      console.error('압축 중 오류 발생:', error);
      alert('압축 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFiles, compressionLevel]);

  // 압축된 파일 다운로드
  const handleDownload = useCallback(
    (index: number) => {
      const file = selectedFiles[index];
      const compressed = compressedFiles[index];

      if (!file || !compressed) return;

      // 실제로는 압축된 파일을 생성하여 다운로드해야 함
      // 여기서는 시뮬레이션으로 원본 파일을 다운로드
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [selectedFiles, compressedFiles]
  );

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
            <li className='text-gray-900 font-medium'>PDF 압축</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>PDF 압축</h1>
          <p className='text-lg text-gray-600'>
            Freeconvert 도구로 온라인에서도 간편하게 PDF 크기를 줄여보세요
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
              multiple
              accept='.pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              지원하는 형식: PDF, DOC, XLS, PPT, PNG, JPG
            </p>
          </div>
        </div>

        {/* 선택된 파일 목록 및 압축 옵션 */}
        {selectedFiles.length > 0 && (
          <div className='mb-8 rounded-2xl border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 text-lg font-semibold text-gray-900'>
              선택된 파일 ({selectedFiles.length}개)
            </h2>

            {/* 압축 옵션 선택 */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 text-sm font-semibold text-gray-900'>
                압축 옵션 선택
              </h3>
              <div className='flex gap-4'>
                <button
                  onClick={() => setCompressionLevel('basic')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    compressionLevel === 'basic'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  기본 압축
                </button>
                <button
                  onClick={() => setCompressionLevel('strong')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    compressionLevel === 'strong'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  강력(프로) 압축
                </button>
              </div>
            </div>

            {/* 파일 목록 */}
            <div className='mb-6 space-y-3'>
              {selectedFiles.map((file, index) => {
                const compressed = compressedFiles[index];
                const compressionRatio = compressed
                  ? calculateCompressionRatio(
                      compressed.originalSize,
                      compressed.compressedSize
                    )
                  : null;

                return (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='flex items-center gap-3 flex-1'>
                      <FileText className='h-5 w-5 text-primary shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-900 truncate'>
                          {file.name}
                        </p>
                        <div className='flex items-center gap-4 mt-1'>
                          <p className='text-sm text-gray-500'>
                            원본: {formatFileSize(file.size)}
                          </p>
                          {compressed && (
                            <>
                              <p className='text-sm text-green-600 font-medium'>
                                압축 후:{' '}
                                {formatFileSize(compressed.compressedSize)}
                              </p>
                              <p className='text-sm text-primary font-medium'>
                                {compressionRatio}% 감소
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {compressed && (
                        <button
                          onClick={() => handleDownload(index)}
                          className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors'
                        >
                          다운로드
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className='rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors'
                        aria-label='파일 삭제'
                      >
                        <svg
                          className='h-5 w-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 압축 버튼 */}
            <button
              onClick={handleCompress}
              disabled={
                isProcessing || compressedFiles.length === selectedFiles.length
              }
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  압축 중...
                </>
              ) : (
                <>
                  <Zap className='h-5 w-5' />
                  압축하기
                </>
              )}
            </button>
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
              최대 99%까지 파일 크기 압축
            </h3>
            <p className='text-sm text-gray-600'>
              품질을 유지하면서도 파일 크기를 대폭 줄일 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Shield className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              GDPR 준수 및 ISO/IEC 27001 인증 완료
            </h3>
            <p className='text-sm text-gray-600'>
              데이터 보안과 개인정보 보호를 최우선으로 합니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Globe className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              100% 브라우저 기반 PDF 용량 줄이기 도구
            </h3>
            <p className='text-sm text-gray-600'>
              별도 소프트웨어 설치 없이 바로 사용할 수 있습니다
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인에서 무료로 PDF를 압축하는 방법
          </h2>
          <div className='grid gap-6 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                압축 도구에 PDF 파일을 가져오거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                기본 압축과 강력(프로) 압축 중에서 선택하고 '압축'을 클릭합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요하다면 다른 도구로 PDF를 편집합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                준비되는 대로 압축한 PDF를 다운로드하거나 공유하면 끝!
              </p>
            </div>
          </div>
        </div>

        {/* 추가 장점 */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                번거로운 절차 없이 즉시 압축 시작
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              별도의 소프트웨어 설치나 교육을 받을 필요가 없습니다. 가장 간편한
              pdf 용량 줄이기 도구로 즉시 작업을 시작하세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                모든 기기에서 압축 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              클라우드 기반 플랫폼입니다. 데스크톱에서 태블릿이나 모바일까지,
              기기나 브라우저 종류에 상관없이 온라인으로 손쉽게 파일 크기를
              줄여보세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                PDF 외 다른 파일 형식도 압축 지원
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert 압축 도구는 PDF 외에도 Word, PPT, Excel, JPG, PNG, GIF,
              TIFF 등 다양한 파일 형식의 압축을 지원합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
