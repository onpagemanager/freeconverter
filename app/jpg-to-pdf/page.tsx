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
  Image as ImageIcon,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

type ImageFile = {
  file: File;
  id: string;
  preview: string;
};

export default function JpgToPdfPage() {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [margin, setMargin] = useState<'none' | 'small' | 'medium' | 'large'>(
    'small'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles: ImageFile[] = [];
    Array.from(files).forEach(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      // 이미지 파일만 허용 (JPG, PNG, BMP, GIF, TIFF)
      if (
        fileType.startsWith('image/') ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.bmp') ||
        fileName.endsWith('.gif') ||
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
    setConvertedFile(null);
  }, []);

  // 모든 이미지 삭제
  const handleRemoveAll = useCallback(() => {
    setSelectedImages([]);
    setConvertedFile(null);
  }, []);

  // 이미지 순서 변경 (위로)
  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    setSelectedImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      return newImages;
    });
  }, []);

  // 이미지 순서 변경 (아래로)
  const handleMoveDown = useCallback((index: number) => {
    setSelectedImages(prev => {
      if (index === prev.length - 1) return prev;
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      return newImages;
    });
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 이미지 형식 감지 함수
  const getImageFormat = useCallback((fileType: string): string => {
    if (fileType === 'image/png') return 'PNG';
    if (fileType === 'image/jpeg' || fileType === 'image/jpg') return 'JPEG';
    if (fileType === 'image/gif') return 'GIF';
    if (fileType === 'image/bmp') return 'BMP';
    if (fileType === 'image/webp') return 'WEBP';
    // 기본값으로 JPEG 반환
    return 'JPEG';
  }, []);

  // JPG to PDF 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    setConvertedFile(null);

    try {
      // jsPDF 동적 import
      // @ts-ignore - jsPDF 타입 정의 문제
      const { jsPDF } = await import('jspdf');

      // PDF 인스턴스 생성 (방향 설정)
      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // 마진 값 계산
      const marginValues = {
        none: 0,
        small: 10,
        medium: 20,
        large: 30,
      };
      const marginValue = marginValues[margin];

      let isFirstPage = true;

      // 각 이미지를 PDF에 추가
      for (const imageFile of selectedImages) {
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

        // 첫 페이지가 아니면 새 페이지 추가
        if (!isFirstPage) {
          pdf.addPage();
        }

        // PDF 페이지 크기 계산 (마진 제외)
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const availableWidth = pdfWidth - marginValue * 2;
        const availableHeight = pdfHeight - marginValue * 2;

        // 이미지 비율에 맞춰 크기 조정
        const imgAspectRatio = img.width / img.height;
        const availableAspectRatio = availableWidth / availableHeight;

        let imgWidth = availableWidth;
        let imgHeight = availableHeight;
        let x = marginValue;
        let y = marginValue;

        // 이미지 비율에 맞춰 크기 조정
        if (imgAspectRatio > availableAspectRatio) {
          // 이미지가 더 넓은 경우 - 너비를 기준으로 조정
          imgHeight = availableWidth / imgAspectRatio;
          y = marginValue + (availableHeight - imgHeight) / 2;
        } else {
          // 이미지가 더 높은 경우 - 높이를 기준으로 조정
          imgWidth = availableHeight * imgAspectRatio;
          x = marginValue + (availableWidth - imgWidth) / 2;
        }

        // 이미지 형식 감지
        const imageFormat = getImageFormat(imageFile.file.type);

        // 이미지를 PDF에 추가
        try {
          pdf.addImage(img.src, imageFormat, x, y, imgWidth, imgHeight);
        } catch (addImageError) {
          // 형식이 지원되지 않는 경우 JPEG로 재시도
          console.warn(
            `${imageFormat} 형식 지원 실패, JPEG로 재시도:`,
            addImageError
          );
          pdf.addImage(img.src, 'JPEG', x, y, imgWidth, imgHeight);
        }

        isFirstPage = false;
      }

      // PDF를 Blob으로 변환
      const pdfBlob = pdf.output('blob');
      setConvertedFile(pdfBlob);
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
  }, [selectedImages, orientation, margin, getImageFormat]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!convertedFile || selectedImages.length === 0) return;

    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;

    // 파일명 생성: 이미지가 하나면 원본 파일명 사용, 여러 개면 기본 이름 사용
    const fileName =
      selectedImages.length === 1
        ? `${selectedImages[0].file.name.replace(/\.[^/.]+$/, '')}.pdf`
        : 'converted-images.pdf';

    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [convertedFile, selectedImages]);

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
            <li className='text-gray-900 font-medium'>JPG PDF 변환</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            JPG PDF 변환
          </h1>
          <p className='text-lg text-gray-600'>
            파일 크기 제한 및 광고 워터 마크가 없습니다. 모든 이미지를 사용자가
            원하는 스타일의 PDF 파일로 변환해주는 참신한 무료 인터넷 도구입니다.
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
              accept='image/*'
              multiple
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              지원하는 형식: PDF, DOC, XLS, PPT, PNG, JPG
            </p>
          </div>
        </div>

        {/* 선택된 이미지 목록 및 설정 */}
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
            <div className='mb-6 space-y-3'>
              {selectedImages.map((image, index) => (
                <div
                  key={image.id}
                  className='flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
                >
                  <div className='flex items-center gap-2'>
                    <GripVertical className='h-5 w-5 text-gray-400' />
                    <span className='text-sm text-gray-500'>{index + 1}</span>
                  </div>
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className='h-16 w-16 rounded object-cover'
                  />
                  <div className='flex-1'>
                    <p className='font-medium text-gray-900'>
                      {image.file.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {formatFileSize(image.file.size)}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className='rounded p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      aria-label='위로 이동'
                    >
                      <ArrowUp className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedImages.length - 1}
                      className='rounded p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      aria-label='아래로 이동'
                    >
                      <ArrowDown className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className='rounded p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors'
                      aria-label='삭제'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PDF 설정 */}
            <div className='mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h4 className='font-semibold text-gray-900'>PDF 설정</h4>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    방향
                  </label>
                  <select
                    value={orientation}
                    onChange={e =>
                      setOrientation(e.target.value as 'portrait' | 'landscape')
                    }
                    className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                  >
                    <option value='portrait'>세로</option>
                    <option value='landscape'>가로</option>
                  </select>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    여백
                  </label>
                  <select
                    value={margin}
                    onChange={e =>
                      setMargin(
                        e.target.value as 'none' | 'small' | 'medium' | 'large'
                      )
                    }
                    className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                  >
                    <option value='none'>없음</option>
                    <option value='small'>작게</option>
                    <option value='medium'>보통</option>
                    <option value='large'>크게</option>
                  </select>
                </div>
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
                  지금 PDF 만들기
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
                <Users className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              2013년부터 17억 명이 신뢰하는 플랫폼
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 변환 서비스입니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Globe className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              소프트웨어 설치 없이 브라우저에서 작업
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
              계정 등록 없이 무료 변환
            </h3>
            <p className='text-sm text-gray-600'>
              회원가입 없이 바로 사용할 수 있는 간편한 변환 도구입니다
            </p>
          </div>
        </div>

        {/* JPG를 PDF로 변환하는 방법 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            JPG를 PDF로 변환하는 방법
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            위의 박스에 JPG 파일을 끌어다 놓으세요. 바로 파일 정렬하거나 원하는
            대로 설정을 할 수 있습니다. "지금 PDF 만들기" 버튼을 누르고 PDF
            파일을 다운로드하세요.
          </p>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                온라인 파일 처리 안전성
              </h3>
              <p className='text-sm text-gray-600'>
                개인 정보는 안전하게 보호됩니다. 누구도 사용자의 JPG 및 PDF
                파일에 접근할 수 없으며, 모든 파일은 1시간 후 서버에서 영구
                삭제됩니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                모든 플랫폼 지원
              </h3>
              <p className='text-sm text-gray-600'>
                JPG의 PDF 변환 프로그램은 브라우저를 기반으로 작동하기 때문에
                Mac, Windows, Linux 등 어떤 운영체제를 사용하든 모든 플랫폼에서
                이용할 수 있습니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                빠르고 쉬운 변환
              </h3>
              <p className='text-sm text-gray-600'>
                누구나 사전 경험 없이도 쉽고 빠르게 이미지를 PDF로 전환할 수
                있습니다. 클릭 한 번으로 PDF를 다운로드할 수 있습니다!
              </p>
            </div>
          </div>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <ImageIcon className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                대부분 이미지 포맷 지원
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              JPG는 가장 널리 사용되는 이미지 포맷이지만 GIF, BMP, PNG 및 TIFF
              파일에 비해 다양하며 식별이 어려울 수 있습니다. 이 도구를 사용하여
              손쉽게 변환하세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Cloud className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>클라우드에서 변환</h3>
            </div>
            <p className='text-sm text-gray-600'>
              이미지 변환은 클라우드에서 처리되므로 사용자의 컴퓨터 용량을 전혀
              사용하지 않습니다. 대단하죠?
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인으로 JPG를 PDF로 변환하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                JPG PDF 변환기에 이미지를 업로드합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                크기, 문서의 방향 및 여백을 원하는 대로 조정합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '변환'을 클릭하면 변환 작업이 시작됩니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환된 PDF를 다운로드하거나 공유하면 완료!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            JPG PDF 변환 관련 FAQ
          </h2>
          <div className='space-y-6'>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF로 변환할 수 있는 이미지 형식은 무엇인가요?
              </h3>
              <p className='text-sm text-gray-700'>
                Freeconvert 도구는 JPG, PNG, BMP, GIF, TIFF 형식을 지원합니다.
                이미지를 업로드하기만 하면 Freeconvert에서 해당 파일을 고품질
                PDF로 변환해 드립니다. 또한 Freeconvert 변환기를 사용하면
                워드(DOC, DOCX), 엑셀(XLS, XLSX), 파워포인트(PPT, PPTX)를 비롯한
                기타 문서 유형도 PDF로 변환할 수 있습니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                여러 JPG 파일을 하나의 PDF에 병합할 수 있나요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠! 여러 이미지 파일을 업로드한 뒤 원하는 순서로 배열하고
                클릭만 하면 하나의 PDF 파일로 손쉽게 병합할 수 있습니다. 정말
                간단하죠?
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                사진 PDF 변환 시 이미지 품질이 영향을 받을까요?
              </h3>
              <p className='text-sm text-gray-700'>
                아니요. Freeconvert 도구는 변환하는 동안 품질 저하 없이 이미지
                파일을 또렷하고 선명하게 유지합니다. 필요한 파일 형식을 원본
                이미지와 동일한 품질로 받아 보세요.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Mac이나 Windows PC에서 JPG를 PDF로 변환하려면 어떻게 해야
                하나요?
              </h3>
              <p className='text-sm text-gray-700'>
                아무 브라우저에서나 Freeconvert의 JPG PDF 변환기를 열고 파일을
                업로드하기만 하면 됩니다. 그러면 별도의 소프트웨어 설치 없이도
                업로드한 파일을 즉시 PDF로 변환할 수 있습니다. 지금
                체험해보세요. 페이지 상단에 있는 도구에 이미지를 끌어다 놓기만
                하면 됩니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                JPG를 PDF로 변환할 때 데이터는 안전하게 보호되나요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠! Freeconvert는 최신 TLS 암호화를 사용하여 파일을
                안전하게 보호합니다. 또한, 처리 후 1시간이 지나면 서버에서 모든
                이미지 파일을 자동 삭제합니다.
              </p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Freeconvert의 JPG PDF 변환기는 무료인가요?
              </h3>
              <p className='text-sm text-gray-700'>
                물론이죠. 무료 계정을 이용하면 모든 문서 형식을 자유롭게 변환할
                수 있습니다. Pro를 구독하면 30가지가 넘는 PDF 도구와 무제한 변환
                기능을 이용하실 수 있습니다. 지금 무료로 사용해보세요. 구독은
                체험 기간 내에 언제든지 취소할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
