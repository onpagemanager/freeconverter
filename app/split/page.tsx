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
  Scissors,
  Eye,
  Zap,
  FileCheck,
} from 'lucide-react';

type SplitMode = 'all' | 'custom';

export default function SplitPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>('all');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitFiles, setSplitFiles] = useState<Blob[]>([]);
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
      setSplitFiles([]);
      setSelectedPages([]);
        setTotalPages(pageCount);
      } catch (error) {
        console.error('PDF 파일 로드 중 오류:', error);
        alert('PDF 파일을 읽는 중 오류가 발생했습니다. 파일이 손상되었을 수 있습니다.');
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
    setSplitFiles([]);
    setSelectedPages([]);
    setTotalPages(0);
  }, []);

  // 페이지 선택 토글
  const handlePageToggle = useCallback((pageNum: number) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNum)) {
        return prev.filter(p => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  }, []);

  // 전체 페이지 선택/해제
  const handleSelectAll = useCallback(() => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [selectedPages.length, totalPages]);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // PDF 분할 핸들러
  const handleSplit = useCallback(async () => {
    if (!selectedFile) return;

    // 브라우저 환경에서만 실행 (Blob은 브라우저 전용 API)
    if (typeof window === 'undefined') return;

    setIsProcessing(true);
    setSplitFiles([]);

    try {
      // 분할할 페이지 목록 결정
      const pagesToSplit =
        splitMode === 'all'
          ? Array.from({ length: totalPages }, (_, i) => i + 1)
          : selectedPages;

      if (pagesToSplit.length === 0) {
        alert('분할할 페이지를 선택해주세요.');
        setIsProcessing(false);
        return;
      }

      // PDF 파일 로드
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(fileArrayBuffer);
      const sourcePageCount = sourcePdf.getPageCount();

      // 각 페이지를 개별 PDF 파일로 생성
      const splitPdfFiles: Blob[] = [];
      // Blob 생성은 브라우저 환경에서만 가능 (동적 참조로 빌드 시 오류 방지)
      const BlobConstructor = (window as any).Blob;
      if (!BlobConstructor) {
        throw new Error('Blob API를 사용할 수 없습니다.');
      }

      for (const pageNum of pagesToSplit) {
        // 페이지 번호가 유효한지 확인 (1부터 시작)
        if (pageNum < 1 || pageNum > sourcePageCount) {
          console.warn(`페이지 ${pageNum}는 유효하지 않습니다. 건너뜁니다.`);
          continue;
        }

        try {
          // 새로운 PDF 문서 생성
          const newPdf = await PDFDocument.create();
          
          // 해당 페이지를 새 PDF에 복사 (0부터 시작하는 인덱스이므로 pageNum - 1)
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageNum - 1]);
          newPdf.addPage(copiedPage);

          // PDF를 바이트 배열로 변환
          const pdfBytes = await newPdf.save();

          // Blob으로 변환하여 배열에 추가
          const pdfBlob = new BlobConstructor([pdfBytes], {
          type: 'application/pdf',
        });
          splitPdfFiles.push(pdfBlob);
        } catch (pageError) {
          console.error(`페이지 ${pageNum} 처리 중 오류:`, pageError);
          // 개별 페이지 처리 실패 시 건너뛰고 계속 진행
          continue;
        }
      }

      if (splitPdfFiles.length === 0) {
        alert('분할할 수 있는 유효한 페이지가 없습니다.');
        setIsProcessing(false);
        return;
      }

      setSplitFiles(splitPdfFiles);
    } catch (error) {
      console.error('분할 중 오류 발생:', error);
      alert('분할 중 오류가 발생했습니다. 파일을 확인하고 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, splitMode, selectedPages, totalPages]);

  // 분할된 파일 다운로드 (ZIP으로)
  const handleDownload = useCallback(async () => {
    if (splitFiles.length === 0) return;

    // 실제로는 ZIP 파일로 압축하여 다운로드해야 하지만,
    // 여기서는 첫 번째 파일만 다운로드
    const url = URL.createObjectURL(splitFiles[0]);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile
      ? `split_${selectedFile.name.split('.')[0]}_1.pdf`
      : 'split_file_1.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [splitFiles, selectedFile]);

  // 모든 분할 파일 다운로드
  const handleDownloadAll = useCallback(async () => {
    if (splitFiles.length === 0) return;

    // 실제로는 ZIP 파일로 압축하여 다운로드해야 함
    // 여기서는 각 파일을 개별적으로 다운로드
    for (let i = 0; i < splitFiles.length; i++) {
      const url = URL.createObjectURL(splitFiles[i]);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile
        ? `split_${selectedFile.name.split('.')[0]}_${i + 1}.pdf`
        : `split_file_${i + 1}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 다운로드 간격을 두기 위해 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }, [splitFiles, selectedFile]);

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
            <li className='text-gray-900 font-medium'>PDF 분할</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>PDF 분할</h1>
          <p className='text-lg text-gray-600'>
            온라인에서 무료로 PDF 페이지를 손쉽게 나눠보세요. Freeconvert의 PDF
            분할 도구는 계정을 만들지 않고도 이용할 수 있습니다.
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

        {/* 선택된 파일 및 분할 옵션 */}
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
                    {formatFileSize(selectedFile.size)} • {totalPages}페이지
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

            {/* 분할 옵션 선택 */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 text-sm font-semibold text-gray-900'>
                분할 옵션 선택
              </h3>
              <div className='flex gap-4'>
                <button
                  onClick={() => {
                    setSplitMode('all');
                    setSelectedPages([]);
                  }}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    splitMode === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  전체 페이지 분할
                </button>
                <button
                  onClick={() => setSplitMode('custom')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    splitMode === 'custom'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  특정 페이지 선택
                </button>
              </div>
            </div>

            {/* 페이지 선택 (특정 페이지 선택 모드) */}
            {splitMode === 'custom' && (
              <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-sm font-semibold text-gray-900'>
                    분할할 페이지 선택
                  </h3>
                  <button
                    onClick={handleSelectAll}
                    className='text-sm text-primary hover:text-blue-700'
                  >
                    {selectedPages.length === totalPages
                      ? '전체 해제'
                      : '전체 선택'}
                  </button>
                </div>
                <div className='grid grid-cols-5 gap-2 sm:grid-cols-10'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageToggle(pageNum)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          selectedPages.includes(pageNum)
                            ? 'border-blue-600 bg-blue-50 text-primary'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>
                {selectedPages.length > 0 && (
                  <p className='mt-3 text-sm text-gray-600'>
                    {selectedPages.length}개 페이지 선택됨
                  </p>
                )}
              </div>
            )}

            {/* 분할 버튼 */}
            <button
              onClick={handleSplit}
              disabled={
                isProcessing ||
                (splitMode === 'custom' && selectedPages.length === 0)
              }
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  분할 중...
                </>
              ) : (
                <>
                  <Scissors className='h-5 w-5' />
                  분할하기
                </>
              )}
            </button>

            {/* 분할 완료 후 다운로드 버튼 */}
            {splitFiles.length > 0 && (
              <div className='mt-6 space-y-3'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    <p className='font-semibold text-green-900'>
                      분할 완료! {splitFiles.length}개 파일이 생성되었습니다.
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={handleDownloadAll}
                    className='flex-1 rounded-full bg-green-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                  >
                    <Download className='h-5 w-5' />
                    모두 다운로드
                  </button>
                  <button
                    onClick={handleDownload}
                    className='flex-1 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 flex items-center justify-center gap-2'
                  >
                    <Download className='h-5 w-5' />첫 번째 파일 다운로드
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
              대용량 PDF 문서를 여러 파일로 분할
            </h3>
            <p className='text-sm text-gray-600'>
              큰 PDF 파일을 작은 문서들로 나누어 관리하기 쉽게 만들어보세요
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Zap className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              몇 초 만에 PDF 내용 분할
            </h3>
            <p className='text-sm text-gray-600'>
              빠르고 간편하게 PDF를 분할할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <CheckCircle2 className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              누구나 손쉽게 이용할 수 있는 무료 도구
            </h3>
            <p className='text-sm text-gray-600'>
              복잡한 소프트웨어 없이 브라우저에서 바로 사용 가능합니다
            </p>
          </div>
        </div>

        {/* 클릭 두 번만으로 PDF 나누기 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            클릭 두 번만으로 PDF 나누기
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            PDF를 한 페이지짜리 개별 문서로 즉시 분할하거나 특정 페이지를
            선택하여 새로운 PDF 문서를 만들어보세요. Freeconvert의 무료 온라인 PDF
            분할 도구를 이용하면 단일 문서나 여러 문서를 한번에 체계적으로
            정리할 수 있습니다.
          </p>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                온라인으로 안전하게 PDF 분리
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 사용자의 개인정보 보호 및 파일 보안을 중요하게
              생각합니다. 파일 분할 도구에 업로드된 모든 문서는 1시간이 지나면
              자동 삭제됩니다. 즉, 파일이 서버에 저장되지 않기 때문에 전혀
              위험하지 않습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                모든 기기와 호환되는 PDF 분할 도구
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              운영 체제에 상관 없이 모든 기기에서 PDF 문서를 분할해보세요. 이
              도구는 Windows, Mac, Linux와 호환됩니다. 인터넷에 연결한 후 웹
              브라우저와 PDF 파일만 준비하면 됩니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Eye className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                PDF 분할 작업시 미리보기 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert 도구를 이용해 PDF를 분할하면 분할하려는 페이지의
              미리보기를 확인할 수 있습니다. 이렇게 하면 PDF에서 분할하고 싶은
              페이지를 손쉽게 선택할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                무료 온라인 소프트웨어
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF를 분할하려고 값비싼 프리미엄 소프트웨어에 힘들게 번 돈을
              낭비하지 마세요. Freeconvert의 PDF 분할 도구는 일일 사용 횟수 제한이
              있지만 누구나 무료로 이용할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인으로 PDF를 분할하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-5'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                PDF 분할 도구에 파일을 가져오거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                가위 도구 아이콘을 클릭하여 원하는 부분에서 PDF를 분할합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '분할'을 클릭하여 PDF를 여러 파일로 분할합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요하다면 다른 도구로 PDF를 편집합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  5
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                분할이 완료되면 바로 다운로드하거나 공유하면 끝!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
