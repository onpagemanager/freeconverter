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
  ArrowUpDown,
  X,
  Users,
  Eye,
  Cloud,
} from 'lucide-react';

export default function MergePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedFile, setMergedFile] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    // PDF, 이미지, Word, Excel, PowerPoint 파일 필터링
    const allowedFiles = Array.from(files).filter(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      return (
        fileType === 'application/pdf' ||
        fileType.startsWith('image/') ||
        fileType.includes('word') ||
        fileType.includes('excel') ||
        fileType.includes('powerpoint') ||
        fileType.includes('spreadsheet') ||
        fileName.endsWith('.pdf') ||
        fileName.endsWith('.doc') ||
        fileName.endsWith('.docx') ||
        fileName.endsWith('.xls') ||
        fileName.endsWith('.xlsx') ||
        fileName.endsWith('.ppt') ||
        fileName.endsWith('.pptx') ||
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png')
      );
    });

    if (allowedFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...allowedFiles]);
      setMergedFile(null);
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
    setMergedFile(null);
  }, []);

  // 파일 순서 변경 (위로 이동)
  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [
        newFiles[index],
        newFiles[index - 1],
      ];
      return newFiles;
    });
    setMergedFile(null);
  }, []);

  // 파일 순서 변경 (아래로 이동)
  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === selectedFiles.length - 1) return;
      setSelectedFiles(prev => {
        const newFiles = [...prev];
        [newFiles[index], newFiles[index + 1]] = [
          newFiles[index + 1],
          newFiles[index],
        ];
        return newFiles;
      });
      setMergedFile(null);
    },
    [selectedFiles.length]
  );

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // 파일 형식 감지
  const getFileFormat = (fileName: string, fileType: string): string => {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    if (fileType === 'application/pdf' || ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'Word';
    if (ext === 'xls' || ext === 'xlsx') return 'Excel';
    if (ext === 'ppt' || ext === 'pptx') return 'PowerPoint';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(ext))
      return 'Image';
    return ext.toUpperCase();
  };

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

  // 파일 병합 핸들러
  const handleMerge = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setMergedFile(null);

    try {
      // 새로운 PDF 문서 생성
      const mergedPdf = await PDFDocument.create();

      // 각 파일을 순서대로 처리
      let processedCount = 0; // 처리된 파일 수 추적

      for (const file of selectedFiles) {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        const fileArrayBuffer = await file.arrayBuffer();

        let fileProcessed = false; // 현재 파일이 처리되었는지 추적

        // PDF 파일인 경우 (확장자 또는 타입이 PDF인 경우)
        if (
          fileType === 'application/pdf' ||
          fileName.endsWith('.pdf')
        ) {
          // PDF 헤더 검증
          const isPdf = await isValidPdf(fileArrayBuffer);
          if (isPdf) {
            try {
              // PDF 파일 로드
              const pdfDoc = await PDFDocument.load(fileArrayBuffer);
              // 모든 페이지를 복사하여 병합된 PDF에 추가
              const pages = await mergedPdf.copyPages(
                pdfDoc,
                pdfDoc.getPageIndices()
              );
              pages.forEach(page => mergedPdf.addPage(page));
              processedCount++;
              fileProcessed = true;
            } catch (pdfError) {
              console.error(`PDF 파일 처리 중 오류 (${file.name}):`, pdfError);
              // PDF 파일이 손상되었거나 유효하지 않은 경우 다음 형식 확인
            }
          } else {
            console.warn(
              `파일 "${file.name}"은(는) 유효한 PDF 파일이 아닙니다. 다른 형식으로 처리 시도합니다.`
            );
            // PDF가 아니지만 이미지일 수 있으므로 아래에서 확인
          }
        }

        // 이미지 파일인 경우 (PDF로 변환 후 병합)
        // PDF가 아니거나 PDF 처리에 실패한 경우 이미지로 처리 시도
        if (!fileProcessed && fileType.startsWith('image/')) {
          try {
            // 이미지를 PDF 페이지로 추가
            const imageBytes = fileArrayBuffer;
            let image;

            // 이미지 타입에 따라 적절한 형식으로 로드
            if (
              fileType === 'image/jpeg' ||
              fileType === 'image/jpg' ||
              fileName.endsWith('.jpg') ||
              fileName.endsWith('.jpeg')
            ) {
              image = await mergedPdf.embedJpg(imageBytes);
            } else if (
              fileType === 'image/png' ||
              fileName.endsWith('.png')
            ) {
              image = await mergedPdf.embedPng(imageBytes);
            } else {
              // 지원하지 않는 이미지 형식은 건너뛰기
              console.warn(`지원하지 않는 이미지 형식: ${file.name}`);
              continue;
            }

            // 이미지 크기에 맞는 페이지 추가
            const page = mergedPdf.addPage([
              image.width,
              image.height,
            ]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });
            processedCount++;
            fileProcessed = true;
          } catch (imageError) {
            console.error(`이미지 파일 처리 중 오류 (${file.name}):`, imageError);
            // 이미지 파일 처리 중 오류 발생 시 건너뛰기
          }
        }

        // 처리되지 않은 파일은 지원하지 않는 형식
        if (!fileProcessed) {
          console.warn(`지원하지 않는 파일 형식 또는 손상된 파일: ${file.name}`);
        }
      }

      // 처리된 파일이 없는 경우 오류 표시
      if (processedCount === 0) {
        alert(
          '병합할 수 있는 유효한 파일이 없습니다. PDF 또는 이미지 파일인지 확인해주세요.'
        );
        setIsProcessing(false);
        return;
      }

      // 병합된 PDF를 바이트 배열로 변환
      const pdfBytes = await mergedPdf.save();

      // Blob으로 변환하여 상태에 저장
      const mergedBlob = new Blob([pdfBytes], {
        type: 'application/pdf',
      });

      setMergedFile(mergedBlob);
    } catch (error) {
      console.error('병합 중 오류 발생:', error);
      alert(
        '병합 중 오류가 발생했습니다. 파일 형식을 확인하고 다시 시도해주세요.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFiles]);

  // 병합된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!mergedFile) return;

    const url = URL.createObjectURL(mergedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mergedFile]);

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
            <li className='text-gray-900 font-medium'>PDF 합치기</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>PDF 합치기</h1>
          <p className='text-lg text-gray-600'>
            파일 제한, 광고 워터마크 없음 - 사용자가 원하는 대로 완벽하게 PDF
            파일 합치기가 가능한 무료 온라인 툴입니다.
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

        {/* 선택된 파일 목록 */}
        {selectedFiles.length > 0 && (
          <div className='mb-8 rounded-2xl border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 text-lg font-semibold text-gray-900'>
              선택된 파일 ({selectedFiles.length}개)
            </h2>

            {/* 파일 목록 */}
            <div className='mb-6 space-y-3'>
              {selectedFiles.map((file, index) => {
                const fileFormat = getFileFormat(file.name, file.type);

                return (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4'
                  >
                    <div className='flex items-center gap-3 flex-1'>
                      <div className='flex flex-col gap-1'>
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className='p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
                          aria-label='위로 이동'
                        >
                          <ArrowUpDown className='h-4 w-4 rotate-180' />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === selectedFiles.length - 1}
                          className='p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
                          aria-label='아래로 이동'
                        >
                          <ArrowUpDown className='h-4 w-4' />
                        </button>
                      </div>
                      <FileText className='h-5 w-5 text-primary shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-900 truncate'>
                          {file.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {fileFormat} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className='rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors'
                      aria-label='파일 삭제'
                    >
                      <X className='h-5 w-5' />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 병합 버튼 */}
            <button
              onClick={handleMerge}
              disabled={isProcessing || mergedFile !== null}
              className='w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  병합 중...
                </>
              ) : mergedFile ? (
                <>
                  <CheckCircle2 className='h-5 w-5' />
                  병합 완료
                </>
              ) : (
                <>
                  <ArrowUpDown className='h-5 w-5' />
                  병합하기
                </>
              )}
            </button>

            {/* 병합 완료 후 다운로드 버튼 */}
            {mergedFile && (
              <button
                onClick={handleDownload}
                className='mt-4 w-full rounded-full bg-green-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2'
              >
                <Download className='h-5 w-5' />
                병합된 PDF 다운로드
              </button>
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
              2013년부터 17억 명이 사용
            </h3>
            <p className='text-sm text-gray-600'>
              전 세계 수많은 사용자들이 신뢰하는 PDF 병합 도구입니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <CheckCircle2 className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              시작하려면 파일을 끌어다 놓으세요. 참 쉽죠?
            </h3>
            <p className='text-sm text-gray-600'>
              복잡한 절차 없이 간단하게 파일을 병합할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Globe className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Mac, Windows, 기타 플랫폼과 호환 가능
            </h3>
            <p className='text-sm text-gray-600'>
              어떤 운영체제에서도 브라우저만 있으면 사용할 수 있습니다
            </p>
          </div>
        </div>

        {/* PDF 병합하는 방법 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            PDF 병합하는 방법
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            위의 박스에 사용자의 PDF 파일 또는 여러 개의 파일을 끌어다 놓으세요.
            페이지가 보이면 바로 편집을 시작할 수 있습니다. 이후 아래에 있는
            버튼을 눌러 PDF를 다운로드할 수 있습니다.
          </p>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                안전한 온라인 PDF 파일 병합
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              서버에 업로드된 모든 파일 및 작업 파일은 한 시간 안에 영구히
              삭제됩니다. 더 많은 정보가 필요하시면 아래의 개인정보 보호정책을
              확인하시기 바랍니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                윈도우, 맥 및 리눅스에서 사용 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              본 웹 애플리케이션은 브라우저를 기반으로 하기 때문에 윈도우, 맥,
              그리고 리눅스를 포함한 모든 운영 체제에서 사용할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Eye className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                미리보기를 사용한 쉬운 PDF 결합
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              편집기 영역에 페이지를 드래그하여 재정렬하거나 단일 페이지를
              삭제할 수 있습니다. 페이지를 합치거나 하나의 문서로 병합하기 위해
              다른 PDF 파일을 추가할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>
                믿을 수 있는 서비스
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF 합치기 또는 페이지를 추가하려면 보통은 값비싼 소프트웨어가
              필요합니다. 하지만 이 웹사이트에서는 이러한 기능을 안전하게
              온라인으로 이용할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Cloud className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>클라우드에서 처리</h3>
            </div>
            <p className='text-sm text-gray-600'>
              파일이 병합되면 서버에서 PDF로 만드는 작업이 진행됩니다. 따라서,
              사용자의 컴퓨터 용량은 전혀 사용되지 않습니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인으로 PDF 파일을 병합하는 방법:
          </h2>
          <div className='grid gap-6 md:grid-cols-5'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                병합기에 PDF 파일을 가져오거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요에 따라 PDF, 이미지 또는 기타 파일 유형을 추가합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                문서 순서를 재정렬하고 방향을 조정할 수도 있습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '완료'를 클릭하여 문서를 병합합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  5
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                병합된 PDF 파일이 완료되면 바로 다운로드하거나 공유하면 됩니다.
                정말 간단하죠!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
