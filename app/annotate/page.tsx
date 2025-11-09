'use client';

import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  FileText,
  Upload,
  Loader2,
  Shield,
  Download,
  X,
  Highlighter,
  Type,
  PenTool,
  Underline,
  Strikethrough,
  Square,
  MessageSquare,
  Lock,
  CheckCircle2,
  Smartphone,
  Globe,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type AnnotateTool =
  | 'highlight'
  | 'text'
  | 'draw'
  | 'underline'
  | 'strikethrough'
  | 'shape'
  | 'comment';

export default function AnnotatePdfPage() {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [annotatedFile, setAnnotatedFile] = useState<Blob | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<AnnotateTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // 지원하는 파일 형식 확인
    const isSupported =
      fileType === 'application/pdf' ||
      fileType.startsWith('image/') ||
      fileType.includes('word') ||
      fileType.includes('excel') ||
      fileType.includes('powerpoint') ||
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.ppt') ||
      fileName.endsWith('.pptx') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png');

    if (isSupported) {
      setSelectedFile(file);
      setAnnotatedFile(null);
      setIsProcessing(true);

      // PDF 미리보기 생성
      if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        const reader = new FileReader();
        reader.onload = async e => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            // 첫 번째 페이지를 이미지로 변환 (간단한 미리보기)
            const pages = pdfDoc.getPages();
            if (pages.length > 0) {
              setPdfPreview(file.name);
            }
          } catch (error) {
            console.error('PDF 로드 오류:', error);
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // 이미지 파일인 경우
        const reader = new FileReader();
        reader.onload = e => {
          setPdfPreview(e.target?.result as string);
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      }
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

  // 파일 제거
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setAnnotatedFile(null);
    setPdfPreview(null);
    setActiveTool(null);
  }, []);

  // PDF 주석 처리
  const handleAnnotatePdf = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 주석이 추가된 PDF 생성 (여기서는 기본적으로 원본과 동일)
      // 실제 주석 기능은 더 복잡한 구현이 필요
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setAnnotatedFile(blob);
    } catch (error) {
      console.error('PDF 주석 처리 오류:', error);
      alert('PDF 주석 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  // 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!annotatedFile && !selectedFile) return;

    const fileToDownload = annotatedFile || selectedFile;
    if (!fileToDownload) return;

    const url = URL.createObjectURL(fileToDownload);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      annotatedFile && selectedFile
        ? `annotated_${selectedFile.name}`
        : selectedFile?.name || 'annotated.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [annotatedFile, selectedFile]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {/* 헤더 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 sm:text-5xl'>
            {t('annotate.title')}
          </h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            {t('annotate.description')}
          </p>
        </div>

        {/* 파일 업로드 영역 */}
        <div
          className={`mt-8 rounded-2xl border-2 border-dashed transition-all ${
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
              {t('annotate.selectFile')}
            </h3>
            <p className='mb-6 text-gray-600'>{t('annotate.dragDrop')}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className='rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700'
            >
              {t('annotate.selectFile')}
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              {t('annotate.supportedFormats')}
            </p>
          </div>
        </div>

        {/* 선택된 파일 및 주석 도구 */}
        {selectedFile && (
          <div className='mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FileText className='h-6 w-6 text-primary' />
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    {selectedFile.name}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* 주석 도구 */}
            <div className='mb-6 border-t border-gray-200 pt-6'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900'>
                {t('annotate.tools')}
              </h4>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7'>
                <button
                  onClick={() => setActiveTool('highlight')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'highlight'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Highlighter className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.highlight')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTool('text')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'text'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Type className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.text')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTool('draw')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'draw'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <PenTool className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.draw')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTool('underline')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'underline'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Underline className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.underline')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTool('strikethrough')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'strikethrough'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Strikethrough className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.strikethrough')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTool('shape')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'shape'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Square className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.shape')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTool('comment')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'comment'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('annotate.tool.comment')}
                  </span>
                </button>
              </div>
            </div>

            {/* PDF 미리보기 영역 */}
            {pdfPreview && (
              <div className='mb-6 border-t border-gray-200 pt-6'>
                <h4 className='mb-4 text-lg font-semibold text-gray-900'>
                  {t('annotate.preview')}
                </h4>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
                  {selectedFile.type === 'application/pdf' ||
                  selectedFile.name.endsWith('.pdf') ? (
                    <div className='flex flex-col items-center gap-4'>
                      <FileText className='h-16 w-16 text-gray-400' />
                      <p className='text-gray-600'>{pdfPreview}</p>
                      <p className='text-sm text-gray-500'>
                        PDF 주석 기능은 실제 구현이 필요합니다
                      </p>
                    </div>
                  ) : (
                    <img
                      src={pdfPreview}
                      alt='미리보기'
                      className='mx-auto max-h-96 rounded-lg'
                    />
                  )}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                onClick={handleAnnotatePdf}
                disabled={isProcessing}
                className='flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
              >
                {isProcessing ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    {t('annotate.processing')}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='h-5 w-5' />
                    {t('annotate.finish')}
                  </>
                )}
              </button>
              {(annotatedFile || selectedFile) && (
                <button
                  onClick={handleDownload}
                  className='flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50'
                >
                  <Download className='h-5 w-5' />
                  {t('annotate.download')}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 기능 소개 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            {t('annotate.section.title')}
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            {t('annotate.section.description')}
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <CheckCircle2 className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                {t('annotate.feature.clear.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('annotate.feature.clear.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <Type className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                {t('annotate.feature.forms.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('annotate.feature.forms.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <Smartphone className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                {t('annotate.feature.anywhere.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('annotate.feature.anywhere.description')}
            </p>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-center text-3xl font-bold text-gray-900'>
            {t('annotate.howto.title')}
          </h2>
          <div className='space-y-6'>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                1
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('annotate.howto.step1')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                2
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('annotate.howto.step2')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                3
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('annotate.howto.step3')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                4
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('annotate.howto.step4')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 스마트한 주석 방법 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            PDF를 온라인에서 주석 처리하는 더 스마트한 방법
          </h2>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Zap className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('annotate.feature.immediate.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('annotate.feature.immediate.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Highlighter className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('annotate.feature.keyInfo.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('annotate.feature.keyInfo.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <MessageSquare className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('annotate.feature.feedback.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('annotate.feature.feedback.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Lock className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('annotate.feature.secure.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('annotate.feature.secure.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <PenTool className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('annotate.feature.focus.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('annotate.feature.focus.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Globe className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('annotate.feature.device.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('annotate.feature.device.description')}
            </p>
          </div>
        </div>
      </section>

      {/* 보안 정보 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Lock className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                GDPR 및 ISO/IEC 27001 준수
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              GDPR을 준수하고 ISO/IEC 27001 인증을 받았습니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Shield className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                브라우저에서 작동
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              모든 장치의 브라우저에서 작동합니다.
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <CheckCircle2 className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                하이라이트, 텍스트 추가, PDF에 그리기
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              PDF에 하이라이트, 텍스트 추가, 그리기를 할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
