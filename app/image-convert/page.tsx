'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  Loader2,
  Download,
  X,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

type ImageFile = {
  file: File;
  id: string;
  preview: string;
};

type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'bmp';

// 지원하는 이미지 형식
const supportedFormats: { value: ImageFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'gif', label: 'GIF' },
  { value: 'bmp', label: 'BMP' },
];

export default function ImageConvertPage() {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState<
    { id: string; blob: Blob; originalName: string; format: ImageFormat }[]
  >([]);
  const [fromFormat, setFromFormat] = useState<ImageFormat | 'auto'>('auto');
  const [toFormat, setToFormat] = useState<ImageFormat>('png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 파일 형식 감지
  const detectImageFormat = (file: File): ImageFormat | null => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    if (fileType === 'image/png' || fileName.endsWith('.png')) return 'png';
    if (
      fileType === 'image/jpeg' ||
      fileType === 'image/jpg' ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg')
    )
      return 'jpeg';
    if (fileType === 'image/webp' || fileName.endsWith('.webp')) return 'webp';
    if (fileType === 'image/gif' || fileName.endsWith('.gif')) return 'gif';
    if (fileType === 'image/bmp' || fileName.endsWith('.bmp')) return 'bmp';

    return null;
  };

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles: ImageFile[] = [];
    Array.from(files).forEach(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      // 이미지 파일만 허용
      if (
        fileType.startsWith('image/') ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.webp') ||
        fileName.endsWith('.gif') ||
        fileName.endsWith('.bmp') ||
        fileName.endsWith('.tiff')
      ) {
        const reader = new FileReader();
        reader.onload = e => {
          const preview = e.target?.result as string;
          const imageFile: ImageFile = {
            file,
            id: Math.random().toString(36).substring(7),
            preview,
          };
          imageFiles.push(imageFile);

          if (imageFiles.length === Array.from(files).length) {
            setSelectedImages(prev => [...prev, ...imageFiles]);
            setConvertedImages([]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
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

  // 이미지 삭제 핸들러
  const handleRemoveImage = useCallback((id: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
    setConvertedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  // 모든 이미지 삭제
  const handleRemoveAll = useCallback(() => {
    setSelectedImages([]);
    setConvertedImages([]);
  }, []);

  // 이미지 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    setConvertedImages([]);

    try {
      const converted: {
        id: string;
        blob: Blob;
        originalName: string;
        format: ImageFormat;
      }[] = [];

      for (const imageFile of selectedImages) {
        // 형식 확인
        const detectedFormat = detectImageFormat(imageFile.file);
        if (fromFormat !== 'auto' && detectedFormat !== fromFormat) {
          console.warn(
            `파일 형식이 일치하지 않습니다: ${imageFile.file.name} (감지: ${detectedFormat}, 선택: ${fromFormat})`
          );
        }

        // 이미지 로드
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = err => {
            console.error('이미지 로드 실패:', err);
            reject(new Error(`이미지 로드 실패: ${imageFile.file.name}`));
          };
          img.src = imageFile.preview;
        });

        // Canvas에 이미지 그리기
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 컨텍스트를 생성할 수 없습니다.');
        }

        // 이미지 그리기
        ctx.drawImage(img, 0, 0);

        // MIME 타입 결정
        let mimeType: string;
        let fileExtension: string;
        switch (toFormat) {
          case 'png':
            mimeType = 'image/png';
            fileExtension = 'png';
            break;
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            fileExtension = 'jpg';
            break;
          case 'webp':
            mimeType = 'image/webp';
            fileExtension = 'webp';
            break;
          case 'gif':
            mimeType = 'image/gif';
            fileExtension = 'gif';
            break;
          case 'bmp':
            mimeType = 'image/bmp';
            fileExtension = 'bmp';
            break;
          default:
            mimeType = 'image/png';
            fileExtension = 'png';
        }

        // Canvas를 Blob으로 변환
        const blob: Blob | null = await new Promise(resolve => {
          canvas.toBlob(
            blob => resolve(blob),
            mimeType,
            toFormat === 'jpg' || toFormat === 'jpeg' ? 0.92 : undefined
          );
        });

        if (!blob) {
          throw new Error('이미지 변환에 실패했습니다.');
        }

        converted.push({
          id: imageFile.id,
          blob,
          originalName: imageFile.file.name,
          format: toFormat,
        });
      }

      setConvertedImages(converted);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';
      alert(
        `변환 중 오류가 발생했습니다: ${errorMessage}\n\n다시 시도해주세요.`
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImages, fromFormat, toFormat]);

  // 개별 이미지 다운로드
  const handleDownloadImage = useCallback(
    (id: string) => {
      const converted = convertedImages.find(img => img.id === id);
      if (!converted) return;

      const url = URL.createObjectURL(converted.blob);
      const a = document.createElement('a');
      a.href = url;

      // 파일명 생성 (원본 파일명에서 확장자만 변경)
      const originalNameWithoutExt = converted.originalName.replace(
        /\.[^/.]+$/,
        ''
      );
      const fileExtension =
        converted.format === 'jpeg' ? 'jpg' : converted.format;
      a.download = `${originalNameWithoutExt}.${fileExtension}`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [convertedImages]
  );

  // 모든 이미지 다운로드
  const handleDownloadAll = useCallback(() => {
    convertedImages.forEach((converted, index) => {
      setTimeout(() => {
        handleDownloadImage(converted.id);
      }, index * 100);
    });
  }, [convertedImages, handleDownloadImage]);

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* 메인 컨텐츠 */}
      <main className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* 브레드크럼 */}
        <nav className='mb-6 text-sm text-gray-600'>
          <ol className='flex items-center space-x-2'>
            <li>
              <Link href='/' className='hover:text-primary transition-colors'>
                홈
              </Link>
            </li>
            <li>
              <span className='mx-2'>›</span>
            </li>
            <li className='text-gray-900 font-medium'>이미지변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>이미지 변환</h1>
          <p className='text-lg text-gray-600'>
            PNG, JPG, WEBP, GIF, BMP 등 다양한 이미지 형식을 원하는 형식으로
            변환하세요. 파일 크기 제한 없이 무료로 사용할 수 있습니다.
          </p>
        </div>

        {/* 형식 선택 섹션 */}
        <div className='mb-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>변환:</span>
            <select
              value={fromFormat}
              onChange={e =>
                setFromFormat(e.target.value as ImageFormat | 'auto')
              }
              className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
            >
              <option value='auto'>자동 감지</option>
              {supportedFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          <ArrowRight className='h-5 w-5 text-gray-400' />
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>
              변환할 형식:
            </span>
            <select
              value={toFormat}
              onChange={e => setToFormat(e.target.value as ImageFormat)}
              className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
            >
              {supportedFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
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
              accept='image/*'
              multiple
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              지원하는 형식: PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF
            </p>
          </div>
        </div>

        {/* 선택된 이미지 목록 */}
        {selectedImages.length > 0 && (
          <div className='mb-8 rounded-2xl border border-gray-200 bg-white p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                선택된 이미지 ({selectedImages.length}개)
              </h3>
              <button
                onClick={handleRemoveAll}
                className='text-sm text-red-600 hover:text-red-700 transition-colors'
              >
                모두 삭제
              </button>
            </div>

            {/* 이미지 목록 */}
            <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {selectedImages.map(image => {
                const converted = convertedImages.find(
                  img => img.id === image.id
                );
                return (
                  <div
                    key={image.id}
                    className='relative rounded-lg border border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-100'>
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className='h-full w-full object-contain'
                      />
                      {converted && (
                        <div className='absolute top-2 right-2 rounded-full bg-green-500 p-1'>
                          <CheckCircle2 className='h-4 w-4 text-white' />
                        </div>
                      )}
                    </div>
                    <div className='mb-2'>
                      <p className='truncate text-sm font-medium text-gray-900'>
                        {image.file.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {formatFileSize(image.file.size)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      {converted ? (
                        <button
                          onClick={() => handleDownloadImage(image.id)}
                          className='flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-1'
                        >
                          <Download className='h-4 w-4' />
                          다운로드
                        </button>
                      ) : (
                        <div className='flex-1 text-center text-xs text-gray-500'>
                          변환 대기 중
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className='rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors'
                        aria-label='삭제'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 변환 버튼 */}
            {convertedImages.length === 0 && (
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
                    <ImageIcon className='h-5 w-5' />
                    이미지 변환하기
                  </>
                )}
              </button>
            )}

            {/* 모든 파일 다운로드 버튼 */}
            {convertedImages.length > 0 &&
              convertedImages.length === selectedImages.length && (
                <button
                  onClick={handleDownloadAll}
                  className='mt-4 w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                >
                  <Download className='h-5 w-5' />
                  모든 파일 다운로드 ({convertedImages.length}개)
                </button>
              )}
          </div>
        )}

        {/* 기능 설명 섹션 */}
        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <ImageIcon className='h-6 w-6 text-blue-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              다양한 형식 지원
            </h3>
            <p className='text-gray-600'>
              PNG, JPG, WEBP, GIF, BMP 등 주요 이미지 형식을 모두 지원합니다.
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
              <CheckCircle2 className='h-6 w-6 text-green-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              고품질 변환
            </h3>
            <p className='text-gray-600'>
              원본 이미지의 품질을 최대한 유지하면서 변환합니다.
            </p>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
              <Upload className='h-6 w-6 text-purple-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              빠른 처리
            </h3>
            <p className='text-gray-600'>
              브라우저에서 직접 변환하므로 빠르고 안전합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
