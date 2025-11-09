'use client';

import { useState, useCallback, useRef } from 'react';
import {
  FileText,
  Upload,
  Loader2,
  Shield,
  Globe,
  Zap,
  CheckCircle2,
  Download,
  ArrowRight,
  FileCheck,
  Users,
} from 'lucide-react';

type ConversionDirection = 'to-pdf' | 'from-pdf';
type OutputFormat = 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image';

export default function ConvertPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionDirection, setConversionDirection] =
    useState<ConversionDirection>('to-pdf');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('pdf');
  const [convertedFiles, setConvertedFiles] = useState<
    { name: string; originalFormat: string; convertedFormat: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const allowedFiles = Array.from(files).filter(file => {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        if (conversionDirection === 'to-pdf') {
          // PDF로 변환: Word, Excel, PowerPoint, 이미지 파일 허용
          return (
            fileType.includes('word') ||
            fileType.includes('excel') ||
            fileType.includes('powerpoint') ||
            fileType.includes('spreadsheet') ||
            fileType.startsWith('image/') ||
            fileName.endsWith('.doc') ||
            fileName.endsWith('.docx') ||
            fileName.endsWith('.xls') ||
            fileName.endsWith('.xlsx') ||
            fileName.endsWith('.ppt') ||
            fileName.endsWith('.pptx') ||
            fileName.endsWith('.jpg') ||
            fileName.endsWith('.jpeg') ||
            fileName.endsWith('.png') ||
            fileName.endsWith('.gif') ||
            fileName.endsWith('.bmp') ||
            fileName.endsWith('.tiff')
          );
        } else {
          // PDF에서 변환: PDF 파일만 허용
          return fileType === 'application/pdf' || fileName.endsWith('.pdf');
        }
      });

      if (allowedFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...allowedFiles]);
        setConvertedFiles([]);
      }
    },
    [conversionDirection]
  );

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
    setConvertedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

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
    if (fileType === 'application/pdf') return 'PDF';
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'Word';
    if (ext === 'xls' || ext === 'xlsx') return 'Excel';
    if (ext === 'ppt' || ext === 'pptx') return 'PowerPoint';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(ext))
      return 'Image';
    return ext.toUpperCase();
  };

  // 변환 방향 변경 시 파일 목록 초기화
  const handleDirectionChange = useCallback(
    (direction: ConversionDirection) => {
      setConversionDirection(direction);
      setSelectedFiles([]);
      setConvertedFiles([]);
      if (direction === 'to-pdf') {
        setOutputFormat('pdf');
      } else {
        setOutputFormat('word');
      }
    },
    []
  );

  // 파일 변환 핸들러
  const handleConvert = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setConvertedFiles([]);

    try {
      // 실제 변환 로직은 백엔드 API나 라이브러리를 사용해야 하지만,
      // 여기서는 시뮬레이션으로 처리
      const simulatedResults = await Promise.all(
        selectedFiles.map(async file => {
          // 실제 변환 시간 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1500));

          const originalFormat = getFileFormat(file.name, file.type);
          let convertedFormat = '';

          if (conversionDirection === 'to-pdf') {
            convertedFormat = 'PDF';
          } else {
            // PDF에서 변환
            switch (outputFormat) {
              case 'word':
                convertedFormat = 'Word';
                break;
              case 'excel':
                convertedFormat = 'Excel';
                break;
              case 'powerpoint':
                convertedFormat = 'PowerPoint';
                break;
              case 'image':
                convertedFormat = 'Image';
                break;
              default:
                convertedFormat = 'PDF';
            }
          }

          return {
            name: file.name,
            originalFormat,
            convertedFormat,
          };
        })
      );

      setConvertedFiles(simulatedResults);
    } catch (error) {
      console.error('변환 중 오류 발생:', error);
      alert('변환 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFiles, conversionDirection, outputFormat]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(
    (index: number) => {
      const file = selectedFiles[index];
      const converted = convertedFiles[index];

      if (!file || !converted) return;

      // 실제로는 변환된 파일을 생성하여 다운로드해야 함
      // 여기서는 시뮬레이션으로 원본 파일을 다운로드
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      const extension = converted.convertedFormat.toLowerCase();
      const newExtension =
        extension === 'pdf'
          ? 'pdf'
          : extension === 'word'
          ? 'docx'
          : extension === 'excel'
          ? 'xlsx'
          : extension === 'powerpoint'
          ? 'pptx'
          : 'jpg';
      a.download = `${file.name.split('.')[0]}.${newExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [selectedFiles, convertedFiles]
  );

  // 허용된 파일 형식 가져오기
  const getAllowedFormats = (): string => {
    if (conversionDirection === 'to-pdf') {
      return '.pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
    } else {
      return '.pdf';
    }
  };

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
            <li className='text-gray-900 font-medium'>PDF 변환기</li>
          </ol>
        </nav>

        {/* 제목 섹션 */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>
            PDF 변환 프로그램
          </h1>
          <p className='text-lg text-gray-600'>
            Word, Excel, PowerPoint, 이미지 등 다양한 파일을 PDF로 변환하거나,
            PDF를 다시 원하는 형식으로 손쉽게 바꿔보세요. 다운로드나 회원가입
            없이 빠르고 간편하게 이용할 수 있습니다.
          </p>
        </div>

        {/* 변환 방향 선택 */}
        <div className='mb-8 flex justify-center gap-4'>
          <button
            onClick={() => handleDirectionChange('to-pdf')}
            className={`rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
              conversionDirection === 'to-pdf'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            PDF로 변환
          </button>
          <button
            onClick={() => handleDirectionChange('from-pdf')}
            className={`rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
              conversionDirection === 'from-pdf'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            PDF에서 변환
          </button>
        </div>

        {/* 출력 형식 선택 (PDF에서 변환 시) */}
        {conversionDirection === 'from-pdf' && (
          <div className='mb-8 flex justify-center gap-3 flex-wrap'>
            {(['word', 'excel', 'powerpoint', 'image'] as OutputFormat[]).map(
              format => (
                <button
                  key={format}
                  onClick={() => setOutputFormat(format)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    outputFormat === format
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {format === 'word'
                    ? 'Word'
                    : format === 'excel'
                    ? 'Excel'
                    : format === 'powerpoint'
                    ? 'PowerPoint'
                    : '이미지'}
                </button>
              )
            )}
          </div>
        )}

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
              accept={getAllowedFormats()}
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
                const converted = convertedFiles[index];
                const fileFormat = getFileFormat(file.name, file.type);

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
                            {fileFormat} • {formatFileSize(file.size)}
                          </p>
                          {converted && (
                            <>
                              <ArrowRight className='h-4 w-4 text-gray-400' />
                              <p className='text-sm text-primary font-medium'>
                                {converted.convertedFormat}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {converted && (
                        <button
                          onClick={() => handleDownload(index)}
                          className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2'
                        >
                          <Download className='h-4 w-4' />
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

            {/* 변환 버튼 */}
            <button
              onClick={handleConvert}
              disabled={
                isProcessing || convertedFiles.length === selectedFiles.length
              }
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
                  {conversionDirection === 'to-pdf' ? 'PDF로 변환' : '변환하기'}
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
                <Users className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              전 세계 17억 명 이상의 사용자가 신뢰
            </h3>
            <p className='text-sm text-gray-600'>
              안전하고 신뢰할 수 있는 변환 서비스를 제공합니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-green-100 p-3'>
                <FileCheck className='h-6 w-6 text-green-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Word, Excel, PowerPoint, 이미지 변환 지원
            </h3>
            <p className='text-sm text-gray-600'>
              다양한 파일 형식을 높은 품질로 변환할 수 있습니다
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='rounded-full bg-purple-100 p-3'>
                <Globe className='h-6 w-6 text-purple-600' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Mac, Windows, iOS, Android 모든 기기에서 사용 가능
            </h3>
            <p className='text-sm text-gray-600'>
              어디서나 접근 가능한 클라우드 기반 서비스입니다
            </p>
          </div>
        </div>

        {/* 작동 방식 설명 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            온라인 PDF 변환기는 어떻게 작동하나요?
          </h2>
          <p className='text-center text-gray-700 mb-8 max-w-3xl mx-auto'>
            PDF 변환 과정을 간단하게 만들었습니다. Microsoft Word 문서, Excel,
            PPT, 이미지 파일 등 거의 모든 형식을 끌어다 놓기만 하면 PDF로
            변환됩니다. 반대로 PDF를 Word, Excel, PowerPoint, 이미지 등으로
            변환할 수도 있습니다. 변환이 완료되면 바로 다운로드하세요.
          </p>
        </div>

        {/* 추가 기능 설명 */}
        <div className='mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Shield className='h-5 w-5 text-green-600' />
              <h3 className='font-semibold text-gray-900'>
                보안 및 개인 정보 보호
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              사용자의 보안과 프라이버시는 최우선입니다. 모든 파일 전송은 최신
              TLS 암호화로 보호되며, 업로드한 파일은 1시간 후 자동으로 서버에서
              삭제됩니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-primary' />
              <h3 className='font-semibold text-gray-900'>
                어떤 기기에서도 변환 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              Windows, Linux, Mac, Android 등 모든 운영체제에서 웹 브라우저만
              있으면 사용 가능합니다. 별도의 소프트웨어 설치 없이 온라인으로
              PDF를 변환할 수 있습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Zap className='h-5 w-5 text-yellow-600' />
              <h3 className='font-semibold text-gray-900'>고품질 PDF 변환</h3>
            </div>
            <p className='text-sm text-gray-600'>
              DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG, TIFF 등 다양한 형식의
              파일을 높은 품질로 변환할 수 있습니다. 어떤 형식이든 매끄럽고
              깔끔한 변환 결과를 제공합니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <CheckCircle2 className='h-5 w-5 text-purple-600' />
              <h3 className='font-semibold text-gray-900'>
                빠르고 간편한 변환
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              파일 크기와 상관없이 누구나 쉽게 사용할 수 있습니다. 파일을 끌어다
              놓고 원하는 출력 형식을 선택하면 몇 번의 클릭으로 변환이
              완료됩니다. 워터마크 없이 깔끔한 결과를 제공합니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-3 flex items-center gap-3'>
              <Globe className='h-5 w-5 text-indigo-600' />
              <h3 className='font-semibold text-gray-900'>
                언제 어디서나 접근 가능
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              인터넷만 연결되어 있다면, 언제 어디서나 무료로 파일을 변환할 수
              있습니다. 클라우드 기반 변환기는 다운로드나 가입이 필요 없으며,
              이동 중에도 빠르게 PDF 파일을 변환할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 사용 방법 안내 */}
        <div className='mb-12 rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            무료로 PDF 변환하는 방법
          </h2>
          <div className='grid gap-6 md:grid-cols-5'>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  1
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환할 PDF 파일을 업로드하거나 끌어다 놓습니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  2
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환할 형식을 선택하세요 (PDF, Word, Excel, PowerPoint, 이미지)
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  3
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                필요하면 OCR 적용이나 이미지 추출 기능을 사용하세요 (Pro에서
                가능)
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  4
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                '변환' 버튼을 눌러 파일을 변환합니다
              </p>
            </div>
            <div className='text-center'>
              <div className='mb-4 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold'>
                  5
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                변환된 문서를 다운로드하세요
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
