'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  FileText,
  Upload,
  Loader2,
  Shield,
  Globe,
  CheckCircle2,
  Download,
  X,
  RotateCw,
  RotateCcw,
  RefreshCw,
  FileCheck,
  Users,
  Zap,
  ArrowRight,
  Share2,
} from 'lucide-react';

type PageRotation = {
  pageNum: number;
  rotation: number; // 0, 90, 180, 270
};

export default function RotatePdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageRotations, setPageRotations] = useState<PageRotation[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF 파일인지 확인하는 함수 (헤더 검증)
  const isValidPdf = async (arrayBuffer: ArrayBuffer): Promise<boolean> => {
    try {
      // PDF 파일은 "%PDF-"로 시작해야 함
      const uint8Array = new Uint8Array(arrayBuffer);
      if (uint8Array.length < 5) return false;

      // 첫 5바이트를 확인
      const headerBytes = uint8Array.slice(0, 5);
      const header = Array.from(headerBytes)
        .map(byte => String.fromCharCode(byte))
        .join('');
      return header === '%PDF-';
    } catch {
      return false;
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // PDF 파일만 허용
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        // PDF 파일 유효성 검증
        const fileArrayBuffer = await file.arrayBuffer();
        const isPdf = await isValidPdf(fileArrayBuffer);

        if (!isPdf) {
          alert('유효한 PDF 파일이 아닙니다. 파일을 확인해주세요.');
          return;
        }

        // PDF 파일 로드하여 페이지 수 확인
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        const pageCount = pdfDoc.getPageCount();

        setSelectedFile(file);
        setPageRotations([]);
        setProcessedFile(null);
        setTotalPages(pageCount);
      } catch (error) {
        console.error('PDF 파일 로드 중 오류:', error);
        alert(
          'PDF 파일을 읽는 중 오류가 발생했습니다. 파일이 손상되었을 수 있습니다.'
        );
      }
    } else {
      alert('PDF 파일만 업로드할 수 있습니다.');
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
    setPageRotations([]);
    setProcessedFile(null);
    setTotalPages(0);
  }, []);

  // 페이지 회전 처리 (시계방향 90도)
  const handleRotateClockwise = useCallback((pageNum: number) => {
    setPageRotations(prev => {
      const existing = prev.find(p => p.pageNum === pageNum);
      if (existing) {
        const newRotation = (existing.rotation + 90) % 360;
        return prev.map(p =>
          p.pageNum === pageNum ? { ...p, rotation: newRotation } : p
        );
      } else {
        return [...prev, { pageNum, rotation: 90 }];
      }
    });
    setProcessedFile(null); // 변경 사항이 있으므로 처리된 파일 초기화
  }, []);

  // 페이지 회전 처리 (반시계방향 90도)
  const handleRotateCounterClockwise = useCallback((pageNum: number) => {
    setPageRotations(prev => {
      const existing = prev.find(p => p.pageNum === pageNum);
      if (existing) {
        const newRotation = (existing.rotation - 90 + 360) % 360;
        return prev.map(p =>
          p.pageNum === pageNum ? { ...p, rotation: newRotation } : p
        );
      } else {
        return [...prev, { pageNum, rotation: 270 }];
      }
    });
    setProcessedFile(null);
  }, []);

  // 전체 문서 회전 (시계방향 90도)
  const handleRotateAll = useCallback(() => {
    const newRotations = Array.from({ length: totalPages }, (_, i) => ({
      pageNum: i + 1,
      rotation: 90,
    }));
    setPageRotations(newRotations);
    setProcessedFile(null);
  }, [totalPages]);

  // 선택된 페이지만 회전 (시계방향 90도)
  const handleRotateSelected = useCallback(() => {
    if (pageRotations.length === 0) {
      alert('회전할 페이지를 선택해주세요. 페이지에서 회전 버튼을 클릭하세요.');
      return;
    }
    // 선택된 페이지만 유지 (이미 회전이 설정된 페이지들)
    setProcessedFile(null);
  }, [pageRotations]);

  // 모든 회전 초기화
  const handleResetAll = useCallback(() => {
    setPageRotations([]);
    setProcessedFile(null);
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 페이지의 현재 회전 각도 가져오기
  const getPageRotation = useCallback(
    (pageNum: number): number => {
      const pageRotation = pageRotations.find(p => p.pageNum === pageNum);
      return pageRotation ? pageRotation.rotation : 0;
    },
    [pageRotations]
  );

  // 회전 적용 (PDF 처리)
  const handleApplyRotation = useCallback(async () => {
    if (!selectedFile) return;

    // 브라우저 환경에서만 실행 (Blob은 브라우저 전용 API)
    if (typeof window === 'undefined') return;

    setIsProcessing(true);
    setProcessedFile(null);

    try {
      // PDF 파일 로드
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      // 각 페이지에 회전 적용
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pageCount; i++) {
        const pageNum = i + 1;
        const pageRotation = pageRotations.find(p => p.pageNum === pageNum);

        if (pageRotation && pageRotation.rotation !== 0) {
          // pdf-lib의 setRotation은 Rotation 타입을 받음
          // 현재 회전 각도에 추가 회전을 더함
          const currentRotation = pages[i].getRotation().angle || 0;
          const newRotation = (currentRotation + pageRotation.rotation) % 360;
          // Rotation 타입: { type: 'degrees', angle: number }
          pages[i].setRotation({ type: 'degrees', angle: newRotation } as any);
        }
      }

      // 회전이 적용된 PDF를 바이트 배열로 변환
      const pdfBytes = await pdfDoc.save();

      // Blob으로 변환하여 상태에 저장 (동적 참조로 빌드 시 오류 방지)
      const BlobConstructor = (window as any).Blob;
      if (!BlobConstructor) {
        throw new Error('Blob API를 사용할 수 없습니다.');
      }
      const processedBlob = new BlobConstructor([pdfBytes], {
        type: 'application/pdf',
      });

      setProcessedFile(processedBlob);
    } catch (error) {
      console.error('회전 처리 중 오류 발생:', error);
      alert(
        '회전 처리 중 오류가 발생했습니다. 파일을 확인하고 다시 시도해주세요.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, pageRotations]);

  // 처리된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!processedFile || !selectedFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rotated_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processedFile, selectedFile]);

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
            <li className='text-gray-900 font-medium'>PDF 회전</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>PDF 회전</h1>
          <p className='text-lg text-gray-600'>
            잘못된 방향의 페이지를 간편하게 바로잡으세요. 단일 페이지 또는
            스캔된 전체 문서를 회전해 정렬할 수 있습니다. 브라우저만 있으면
            어디서든 무료로 사용 가능합니다.
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

        {/* 선택된 파일 및 회전 옵션 */}
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
                    {formatFileSize(selectedFile.size)} · {totalPages}페이지
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

            {/* 전체 문서 회전 옵션 */}
            <div className='mb-6 flex flex-wrap gap-3'>
              <button
                onClick={handleRotateAll}
                className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                <RefreshCw className='h-4 w-4' />
                전체 문서 90° 회전
              </button>
              <button
                onClick={handleRotateSelected}
                className='flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100'
              >
                <RotateCw className='h-4 w-4' />
                선택된 페이지만 회전 ({pageRotations.length}개)
              </button>
              <button
                onClick={handleResetAll}
                className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
              >
                <X className='h-4 w-4' />
                모든 회전 초기화
              </button>
            </div>

            {/* 페이지 목록 */}
            <div className='mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const rotation = getPageRotation(pageNum);
                return (
                  <div
                    key={pageNum}
                    className='relative rounded-lg border border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='mb-2 flex items-center justify-center'>
                      <div
                        className='flex h-24 w-16 items-center justify-center rounded bg-white text-xs text-gray-500'
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transition: 'transform 0.3s',
                        }}
                      >
                        {rotation}°
                      </div>
                    </div>
                    <p className='mb-2 text-center text-sm font-medium text-gray-900'>
                      페이지 {pageNum}
                    </p>
                    <div className='flex items-center justify-center gap-1'>
                      <button
                        onClick={() => handleRotateCounterClockwise(pageNum)}
                        className='rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors'
                        aria-label='반시계방향 회전'
                        title='반시계방향 90° 회전'
                      >
                        <RotateCcw className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleRotateClockwise(pageNum)}
                        className='rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-primary transition-colors'
                        aria-label='시계방향 회전'
                        title='시계방향 90° 회전'
                      >
                        <RotateCw className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 적용 버튼 */}
            <button
              onClick={handleApplyRotation}
              disabled={isProcessing || pageRotations.length === 0}
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  회전 처리 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className='h-5 w-5' />
                  회전 적용하기 ({pageRotations.length}개 페이지)
                </>
              )}
            </button>

            {/* 처리 완료 후 다운로드 버튼 */}
            {processedFile && (
              <div className='mt-6 space-y-3'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    <p className='font-semibold text-green-900'>
                      회전 완료! PDF 파일이 준비되었습니다.
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
                <Globe className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Mac, Windows, iOS, Android, Linux에서 사용 가능
            </h3>
            <p className='text-sm text-gray-600'>
              어떤 기기에서든 브라우저만 있으면 사용할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Users className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              2013년부터 17억 명 이상이 신뢰
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 PDF 서비스입니다
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
              최고 수준의 보안과 개인정보 보호를 제공합니다
            </p>
          </div>
        </div>

        {/* PDF를 온라인에서 빠르게 회전 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF를 온라인에서 빠르게 회전
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            옆으로 눕혀진 페이지나 거꾸로 된 스캔본도 몇 초 만에 바로잡을 수
            있습니다. 가입 없이도 바로 시작해 보세요.
          </p>

          <div className='grid gap-6 md:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                단일 페이지 또는 전체 문서 회전
              </h3>
              <p className='text-sm text-gray-600'>
                특정 페이지만 회전하거나, 문서 전체를 한 번에 회전할 수 있어
                읽기 편하게 정렬할 수 있습니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                서식과 레이아웃은 그대로 유지
              </h3>
              <p className='text-sm text-gray-600'>
                텍스트나 이미지, 문서 형식은 그대로 유지되며, 회전된 방향만
                반영됩니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                모든 기기에서 작동
              </h3>
              <p className='text-sm text-gray-600'>
                Mac, Windows, iOS, Android 등 어떤 기기에서도 설치 없이 PDF
                돌리기를 실행할 수 있습니다. 파일을 끌어다 놓고 회전한 후 저장만
                하면 됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                30개 이상의 PDF 도구 포함
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              회전 기능 외에도, PDF 편집, 병합, 압축 등 다양한 도구를 한 곳에서
              모두 이용할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                안전하고 개인 정보 보호 강화
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              모든 파일은 TLS 암호화로 보호되며, 업로드 후 1시간이 지나면 자동
              삭제됩니다. ISO/IEC 27001 인증을 받았으며 GDPR도 준수합니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인에서 PDF 파일 회전하는 방법
          </h2>
          <div className='grid gap-6 md:grid-cols-5'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                회전 도구에 PDF 파일을 업로드하거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                원하는 페이지에서 회전 아이콘을 사용해 방향을 조정하세요
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                "완료"를 클릭한 후 잠시 기다립니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요하다면 다른 PDF 편집 도구도 사용해 보세요
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  5
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                회전이 적용된 새 PDF 파일을 다운로드하면 끝!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
