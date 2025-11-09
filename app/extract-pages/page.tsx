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
  FileCheck,
  Zap,
  Users,
  Eye,
} from 'lucide-react';

type ExtractMode = 'single' | 'multiple';

export default function ExtractPagesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [extractMode, setExtractMode] = useState<ExtractMode>('single');
  const [extractedFiles, setExtractedFiles] = useState<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF 파일 유효성 검증
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
        setSelectedPages([]);
        setExtractedFiles([]);
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
    setSelectedPages([]);
    setExtractedFiles([]);
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
    setExtractedFiles([]); // 변경 사항이 있으므로 추출된 파일 초기화
  }, []);

  // 전체 페이지 선택/해제
  const handleSelectAll = useCallback(() => {
    if (selectedPages.length === totalPages) {
      setSelectedPages([]);
    } else {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
    setExtractedFiles([]);
  }, [selectedPages.length, totalPages]);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 페이지 추출 핸들러
  const handleExtract = useCallback(async () => {
    if (!selectedFile || selectedPages.length === 0) {
      alert('추출할 페이지를 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    setExtractedFiles([]);

    try {
      // PDF 파일 로드
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(fileArrayBuffer);
      const sourcePageCount = sourcePdf.getPageCount();

      // 선택된 페이지 번호를 인덱스로 변환 (0부터 시작하므로 pageNum - 1)
      const pageIndices = selectedPages
        .filter(pageNum => pageNum >= 1 && pageNum <= sourcePageCount)
        .map(pageNum => pageNum - 1);

      if (pageIndices.length === 0) {
        alert('유효한 페이지가 선택되지 않았습니다.');
        setIsProcessing(false);
        return;
      }

      if (extractMode === 'single') {
        // 하나의 PDF로 추출: 선택된 모든 페이지를 하나의 PDF로 묶기
        const newPdf = await PDFDocument.create();

        // 선택된 페이지들을 새 PDF에 복사
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);

        // 복사된 페이지들을 새 PDF에 추가
        copiedPages.forEach(page => {
          newPdf.addPage(page);
        });

        // PDF를 바이트 배열로 변환
        const pdfBytes = await newPdf.save();

        // Blob으로 변환하여 상태에 저장
        const extractedBlob = new Blob([pdfBytes], {
          type: 'application/pdf',
        });
        setExtractedFiles([extractedBlob]);
      } else {
        // 개별 PDF로 추출: 각 페이지를 별도의 PDF 파일로 생성
        const extractedPdfFiles: Blob[] = [];

        for (const pageIndex of pageIndices) {
          try {
            // 새로운 PDF 문서 생성
            const newPdf = await PDFDocument.create();

            // 해당 페이지를 새 PDF에 복사
            const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
            newPdf.addPage(copiedPage);

            // PDF를 바이트 배열로 변환
            const pdfBytes = await newPdf.save();

            // Blob으로 변환하여 배열에 추가
            const pdfBlob = new Blob([pdfBytes], {
              type: 'application/pdf',
            });
            extractedPdfFiles.push(pdfBlob);
          } catch (pageError) {
            console.error(
              `페이지 ${pageIndex + 1} 처리 중 오류:`,
              pageError
            );
            // 개별 페이지 처리 실패 시 건너뛰고 계속 진행
            continue;
          }
        }

        if (extractedPdfFiles.length === 0) {
          alert('추출할 수 있는 유효한 페이지가 없습니다.');
          setIsProcessing(false);
          return;
        }

        setExtractedFiles(extractedPdfFiles);
      }
    } catch (error) {
      console.error('페이지 추출 중 오류 발생:', error);
      alert('페이지 추출 중 오류가 발생했습니다. 파일을 확인하고 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, selectedPages, extractMode]);

  // 추출된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (extractedFiles.length === 0 || !selectedFile) return;

    if (extractMode === 'single' && extractedFiles.length === 1) {
      // 하나의 파일 다운로드
      const url = URL.createObjectURL(extractedFiles[0]);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // 여러 파일 다운로드 (각 파일을 순차적으로 다운로드)
      extractedFiles.forEach((file, index) => {
        setTimeout(() => {
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          // 파일명에서 확장자 제거 후 새 이름 생성
          const baseFileName = selectedFile.name.replace(/\.pdf$/i, '');
          a.download = `extracted_page_${selectedPages[index]}_${baseFileName}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, index * 100);
      });
    }
  }, [extractedFiles, selectedFile, extractMode, selectedPages]);

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
            <li className='text-gray-900 font-medium'>PDF 페이지 추출</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PDF 페이지 추출
          </h1>
          <p className='text-lg text-gray-600'>
            PDF 문서에서 원하는 페이지만 추출해 새로운 파일로 저장하세요.
            다운로드, 회원가입, 유료 프로그램 없이 브라우저와 인터넷만 있으면
            됩니다.
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

        {/* 선택된 파일 및 페이지 추출 UI */}
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
                    {selectedPages.length > 0 && (
                      <span className='ml-2 text-primary'>
                        ({selectedPages.length}개 선택됨)
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

            {/* 추출 모드 선택 */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 text-sm font-semibold text-gray-900'>
                추출 옵션
              </h3>
              <div className='flex gap-4'>
                <button
                  onClick={() => setExtractMode('single')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    extractMode === 'single'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  하나의 PDF로 추출
                </button>
                <button
                  onClick={() => setExtractMode('multiple')}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    extractMode === 'multiple'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  개별 PDF로 저장
                </button>
              </div>
            </div>

            {/* 페이지 선택 영역 */}
            <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-gray-900'>
                  추출할 페이지 선택
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

              {/* 페이지 그리드 */}
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  pageNum => {
                    const isSelected = selectedPages.includes(pageNum);
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageToggle(pageNum)}
                        className={`relative rounded-lg border p-3 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <span className='text-xs font-medium text-gray-600'>
                            페이지 {pageNum}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className='h-4 w-4 text-primary' />
                          )}
                        </div>
                        {/* 페이지 미리보기 영역 (시뮬레이션) */}
                        <div className='flex h-20 items-center justify-center rounded border border-gray-200 bg-gray-50'>
                          <Eye className='h-6 w-6 text-gray-400' />
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {selectedPages.length > 0 && (
                <div className='mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3'>
                  <p className='text-sm text-blue-700'>
                    {selectedPages.length}개 페이지가 선택되었습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 추출 버튼 */}
            <button
              onClick={handleExtract}
              disabled={isProcessing || selectedPages.length === 0}
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  추출 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className='h-5 w-5' />
                  완료
                </>
              )}
            </button>

            {/* 추출 완료 후 다운로드 버튼 */}
            {extractedFiles.length > 0 && (
              <div className='mt-6 space-y-3'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    <p className='font-semibold text-green-900'>
                      추출 완료! {extractedFiles.length}개 파일이
                      생성되었습니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className='w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
                >
                  <Download className='h-5 w-5' />
                  추출된 PDF 다운로드
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
                <CheckCircle2 className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              회원가입 없이 무료 사용 가능
            </h3>
            <p className='text-sm text-gray-600'>
              다운로드나 회원가입 없이 바로 시작할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <Users className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              2013년 이후 17억 명 이상이 신뢰한 도구
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 PDF 추출 도구입니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Shield className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              TLS 암호화로 안전하게 문서 처리
            </h3>
            <p className='text-sm text-gray-600'>
              모든 파일은 최신 암호화 기술로 안전하게 처리됩니다
            </p>
          </div>
        </div>

        {/* 가장 간단한 PDF 추출 도구 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            가장 간단한 PDF 추출 도구
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            Freeconvert의 PDF 추출 도구는 복잡한 설정 없이 빠르고 쉽게 PDF에서
            원하는 페이지만 골라낼 수 있도록 설계되었습니다. 불필요한 페이지는
            빼고, 필요한 부분만 간편하게 추출하세요.
          </p>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF에서 원하는 페이지만 선택 추출
              </h3>
              <p className='text-sm text-gray-600'>
                문서 전체가 아닌 필요한 페이지만 골라 새로운 PDF로 저장할 수
                있습니다. 하나의 PDF로 묶어서 저장하거나, 각각 따로 저장할 수도
                있습니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                여러 문서도 동시에 처리 가능
              </h3>
              <p className='text-sm text-gray-600'>
                여러 개의 PDF를 한 번에 업로드하고 각 문서에서 원하는 페이지만
                추출할 수 있습니다. 요약 페이지만 모으거나, 이미지 또는 표가
                포함된 페이지만 추출하는 것도 가능합니다.
              </p>
            </div>
            <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                PDF 페이지 추출은 어떻게 작동하나요?
              </h3>
              <p className='text-sm text-gray-600'>
                PDF를 Freeconvert의 안전한 서버에 업로드하고, 원하는 페이지만
                선택하세요. 선택한 페이지는 새로운 PDF 파일로 다운로드할 수
                있으며, 하나의 PDF로 묶거나 개별 파일로 저장할 수도 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 필요한 페이지만 골라서 추출하세요 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Zap className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                지금 바로 무료로 시작
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              다운로드나 회원가입 없이 바로 시작할 수 있습니다. PDF를 업로드하고
              페이지 추출을 바로 실행하세요.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <FileCheck className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                PDF를 더 쉽게 다루는 방법
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF 추출이 이렇게 쉬운 적은 없었습니다. 원하는 페이지만 추출해
              나만의 문서를 만들 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                하나든 여러 개든 문제없음
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              문서를 한 개만 업로드해도, 여러 개를 동시에 올려도 괜찮습니다.
              여러 PDF에서 페이지를 선택해 하나의 문서로 결합하는 것도
              가능합니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Eye className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                추출 옵션도 다양하게
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              페이지 회전, 복제, 다른 PDF 파일 추가 등 다양한 옵션으로 나만의
              맞춤형 추출이 가능합니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>
                여러 포맷으로 내보내기 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF 외에도 JPG, Word, PowerPoint 등 다양한 형식으로 추출한
              페이지를 저장할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-red-600' />
              <h3 className='font-semibold text-gray-900'>
                ISO/IEC 27001 인증으로 더욱 안전하게
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Freeconvert는 ISO/IEC 27001 인증을 받은 서비스를 제공하며, 매년 외부
              감사도 진행하고 있습니다. 개인정보와 문서는 항상 안전하게
              보호됩니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF 페이지 추출하는 방법 (무료)
          </h2>
          <div className='grid gap-6 md:grid-cols-5'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                위에 있는 도구에 PDF 파일을 업로드하거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                추출하고 싶은 페이지를 선택합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                하나의 PDF로 추출할지, 개별 PDF로 저장할지 선택합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                "완료"를 클릭해 추출을 실행합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  5
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                추출된 PDF를 다운로드하면 끝!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



