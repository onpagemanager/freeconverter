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
  Trash2,
  Zap,
  FileCheck,
  Eye,
} from 'lucide-react';

export default function DeletePagesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
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
        setDeletedPages([]);
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
    setDeletedPages([]);
    setProcessedFile(null);
    setTotalPages(0);
  }, []);

  // 페이지 삭제 토글
  const handleDeletePage = useCallback((pageNum: number) => {
    setDeletedPages(prev => {
      if (prev.includes(pageNum)) {
        // 이미 삭제 목록에 있으면 제거 (복원)
        return prev.filter(p => p !== pageNum);
      } else {
        // 삭제 목록에 추가
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
    setProcessedFile(null); // 변경 사항이 있으므로 처리된 파일 초기화
  }, []);

  // 전체 페이지 삭제/복원
  const handleDeleteAll = useCallback(() => {
    if (deletedPages.length === totalPages) {
      setDeletedPages([]);
    } else {
      setDeletedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
    setProcessedFile(null);
  }, [deletedPages.length, totalPages]);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 변경 사항 적용 (페이지 삭제 처리)
  const handleApplyChanges = useCallback(async () => {
    if (!selectedFile || deletedPages.length === 0) return;

    // 브라우저 환경에서만 실행 (Blob은 브라우저 전용 API)
    if (typeof window === 'undefined') return;

    setIsProcessing(true);
    setProcessedFile(null);

    try {
      // PDF 파일 로드
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(fileArrayBuffer);
      const sourcePageCount = sourcePdf.getPageCount();

      // 삭제할 페이지가 모든 페이지인지 확인
      if (deletedPages.length >= sourcePageCount) {
        alert(
          '모든 페이지를 삭제할 수 없습니다. 최소 1개 페이지는 남겨야 합니다.'
        );
        setIsProcessing(false);
        return;
      }

      // 삭제할 페이지를 제외한 나머지 페이지 인덱스 계산 (0부터 시작)
      const pagesToKeep: number[] = [];
      for (let i = 0; i < sourcePageCount; i++) {
        const pageNum = i + 1; // 사용자에게 보여지는 페이지 번호 (1부터 시작)
        if (!deletedPages.includes(pageNum)) {
          pagesToKeep.push(i); // PDF 인덱스는 0부터 시작
        }
      }

      if (pagesToKeep.length === 0) {
        alert('최소 1개 페이지는 남겨야 합니다.');
        setIsProcessing(false);
        return;
      }

      // 새로운 PDF 문서 생성
      const newPdf = await PDFDocument.create();

      // 유지할 페이지들을 새 PDF에 복사
      const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);

      // 복사된 페이지들을 새 PDF에 추가
      copiedPages.forEach(page => {
        newPdf.addPage(page);
      });

      // 페이지 삭제가 적용된 PDF를 바이트 배열로 변환
      const pdfBytes = await newPdf.save();

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
      console.error('페이지 삭제 중 오류 발생:', error);
      alert(
        '페이지 삭제 중 오류가 발생했습니다. 파일을 확인하고 다시 시도해주세요.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, deletedPages]);

  // 처리된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!processedFile || !selectedFile) return;

    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processedFile, selectedFile]);

  // 남은 페이지 수 계산
  const remainingPages = totalPages - deletedPages.length;

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
            <li className='text-gray-900 font-medium'>PDF 페이지 삭제</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PDF 페이지 삭제
          </h1>
          <p className='text-lg text-gray-600'>
            무료의 사용이 쉬운 온라인 PDF 도구로 PDF에서 페이지를 삭제하세요.
            등록이나 설치가 필요하지 않습니다.
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

        {/* 선택된 파일 및 페이지 삭제 UI */}
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
                    {deletedPages.length > 0 && (
                      <span className='ml-2 text-red-600'>
                        ({deletedPages.length}개 삭제 예정)
                      </span>
                    )}
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

            {/* 페이지 삭제 영역 */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-gray-900'>
                  삭제할 페이지 선택
                </h3>
                <button
                  onClick={handleDeleteAll}
                  className='text-sm text-primary hover:text-blue-700'
                >
                  {deletedPages.length === totalPages
                    ? '전체 복원'
                    : '전체 삭제'}
                </button>
              </div>

              {/* 페이지 그리드 */}
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  pageNum => {
                    const isDeleted = deletedPages.includes(pageNum);
                    return (
                      <div
                        key={pageNum}
                        className={`relative rounded-lg border p-3 transition-all ${
                          isDeleted
                            ? 'border-red-300 bg-red-50 opacity-60'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <span className='text-xs font-medium text-gray-600'>
                            페이지 {pageNum}
                          </span>
                          <button
                            onClick={() => handleDeletePage(pageNum)}
                            className={`rounded-full p-1 transition-colors ${
                              isDeleted
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-600'
                            }`}
                            aria-label={`페이지 ${pageNum} ${
                              isDeleted ? '복원' : '삭제'
                            }`}
                          >
                            <Trash2 className='h-3 w-3' />
                          </button>
                        </div>
                        {/* 페이지 미리보기 영역 (시뮬레이션) */}
                        <div className='flex h-20 items-center justify-center rounded border border-gray-200 bg-gray-50'>
                          <Eye className='h-6 w-6 text-gray-400' />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {deletedPages.length > 0 && (
                <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3'>
                  <p className='text-sm text-red-700'>
                    {deletedPages.length}개 페이지가 삭제 예정입니다. (남은
                    페이지: {remainingPages}개)
                  </p>
                </div>
              )}
            </div>

            {/* 변경 사항 적용 버튼 */}
            <button
              onClick={handleApplyChanges}
              disabled={isProcessing || deletedPages.length === 0}
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  처리 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className='h-5 w-5' />
                  변경 사항 적용
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
                      처리 완료! {remainingPages}개 페이지가 남은 PDF가
                      생성되었습니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className='w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                >
                  <Download className='h-5 w-5' />새 PDF 파일 다운로드
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
                <Shield className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              TLS 암호화 기술로 안전하게 파일 처리
            </h3>
            <p className='text-sm text-gray-600'>
              모든 파일은 최신 암호화 기술로 안전하게 처리됩니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <FileCheck className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              PDF에서 여러 페이지 한번에 삭제
            </h3>
            <p className='text-sm text-gray-600'>
              원하는 페이지를 선택하여 한번에 삭제할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Zap className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              소프트웨어 없이 브라우저에서 작업
            </h3>
            <p className='text-sm text-gray-600'>
              별도 소프트웨어 설치 없이 바로 사용할 수 있습니다
            </p>
          </div>
        </div>

        {/* PDF에서 페이지를 삭제하는 방법 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF에서 페이지를 삭제하는 방법
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            PDF 파일을 끌어서 위 상자에 놓으세요. 페이지 위로 가서 작은 쓰레기통
            아이콘을 클릭하면 PDF에서 페이지가 삭제됩니다. "변경 사항 적용"을
            클릭하고 새로운 PDF를 다운로드하세요.
          </p>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>안전한 PDF 삭제</h3>
            </div>
            <p className='text-sm text-gray-600'>
              아무 걱정 없이 온라인으로 PDF에서 페이지를 제거할 수 있습니다.
              업로드된 문서는 처리 60분 후에 삭제됩니다. 누구도 파일에 액세스할
              수 없으며 프라이버시가 보장됩니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>모든 기기에 적용</h3>
            </div>
            <p className='text-sm text-gray-600'>
              Mac, Windows 또는 Linux의 모든 브라우저에서 온라인으로 PDF
              페이지를 삭제하세요. 페이지를 삭제하려는 장소나 시간은 상관이
              없습니다. 모든 플랫폼에서 작동합니다!
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                무료로 PDF 페이지 삭제
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 PDF 페이지를 삭제하는 온라인 도구이며 어디에서나 문서의
              페이지를 삭제하고 새 파일로 저장할 수 있습니다. 필요하지 않는
              페이지를 삭제하고 다운로드하세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Zap className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>쉬운 사용</h3>
            </div>
            <p className='text-sm text-gray-600'>
              사용이 쉬운 PDF 페이지 제거로 문서를 더 작게 만들 수 있습니다.
              정말 필요한 페이지로만 문서를 만드세요. 정말 쉽죠?
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>모든 곳에서 접속</h3>
            </div>
            <p className='text-sm text-gray-600'>
              아무런 소프트웨어를 다운로드 또는 설치할 필요 없이 PDF에서
              페이지를 삭제하세요. 파일을 업로드하고, PDF 파일에서 페이지를
              삭제하고, 다시 다운로드하세요.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF 파일에서 페이지를 삭제하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-5'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                페이지 삭제 도구에 PDF 파일을 가져오거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                휴지통 아이콘을 클릭하여 원치 않는 문서 페이지를 삭제합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요하다면 문서를 추가하거나 페이지를 회전합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '완료'를 클릭하고 몇 초만 기다리세요
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  5
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                새 PDF 파일을 다운로드하거나 공유하기만 하면 끝!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
