'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  FileText,
  Upload,
  Loader2,
  Shield,
  Globe,
  CheckCircle2,
  Download,
  X,
  Users,
  Zap,
  ArrowRight,
  Share2,
  Cloud,
  Edit,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Highlighter,
  FileCheck,
  PenTool,
  Lock,
  Star,
  Smartphone,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type EditTool = 'text' | 'image' | 'shape' | 'highlight' | 'draw';
type Annotation = {
  id: string;
  type: 'highlight' | 'text' | 'draw' | 'shape';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  text?: string;
  points?: { x: number; y: number }[];
};

export default function EditPdfPage() {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedFile, setEditedFile] = useState<Blob | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditTool | null>(null);
  const [isProFeature, setIsProFeature] = useState(false);
  const [pdfPages, setPdfPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentColor, setCurrentColor] = useState('#FFEB3B'); // 하이라이트 기본 색상
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  // 주석 그리기 함수
  const drawAnnotations = useCallback(() => {
    if (!annotationCanvasRef.current) return;

    const canvas = annotationCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 현재 페이지의 주석만 그리기
    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color;
      ctx.lineWidth = 2;

      if (annotation.type === 'highlight') {
        // 하이라이트 (반투명 사각형)
        ctx.globalAlpha = 0.3;
        ctx.fillRect(
          annotation.x,
          annotation.y,
          annotation.width || 0,
          annotation.height || 0
        );
        ctx.globalAlpha = 1.0;
      } else if (
        annotation.type === 'draw' &&
        annotation.points &&
        annotation.points.length > 1
      ) {
        // 그리기 (연속된 점들을 선으로 연결)
        ctx.beginPath();
        ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
        for (let i = 1; i < annotation.points.length; i++) {
          ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
        }
        ctx.stroke();
      } else if (annotation.type === 'shape') {
        // 도형 (사각형)
        ctx.strokeRect(
          annotation.x,
          annotation.y,
          annotation.width || 0,
          annotation.height || 0
        );
      } else if (annotation.type === 'text' && annotation.text) {
        // 텍스트
        ctx.font = '16px Arial';
        ctx.fillStyle = annotation.color;
        ctx.fillText(annotation.text, annotation.x, annotation.y);
      }
    });
  }, [annotations]);

  // 주석 그리기 함수가 변경될 때마다 다시 그리기
  useEffect(() => {
    if (pdfPreview === 'rendered') {
      drawAnnotations();
    }
  }, [annotations, drawAnnotations, pdfPreview]);

  // PDF 렌더링 함수
  const renderPdfPage = useCallback(
    async (pdf: any, pageNum: number) => {
      if (!pdfCanvasRef.current || !annotationCanvasRef.current) return;

      try {
        // PDF.js worker 설정
        const pdfjs = await import('pdfjs-dist');
        // @ts-ignore
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          // @ts-ignore
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }

        const page = await pdf.getPage(pageNum + 1);
        const viewport = page.getViewport({ scale });

        const pdfCanvas = pdfCanvasRef.current;
        const annotationCanvas = annotationCanvasRef.current;

        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        annotationCanvas.width = viewport.width;
        annotationCanvas.height = viewport.height;

        const pdfContext = pdfCanvas.getContext('2d');
        if (!pdfContext) return;

        const renderContext = {
          canvasContext: pdfContext,
          viewport: viewport,
          canvas: pdfCanvas, // PDF.js 최신 버전에서 canvas 속성 필요
        };

        await page.render(renderContext).promise;

        // 주석 다시 그리기
        setTimeout(() => drawAnnotations(), 100);
      } catch (error) {
        console.error('PDF 렌더링 오류:', error);
      }
    },
    [scale, drawAnnotations]
  );

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
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
        setEditedFile(null);
        setAnnotations([]);
        setIsProcessing(true);

        // PDF 미리보기 생성
        if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
          try {
            const pdfjs = await import('pdfjs-dist');

            // PDF.js worker 설정
            // @ts-ignore
            if (!pdfjs.GlobalWorkerOptions.workerSrc) {
              // @ts-ignore
              pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
            }

            const fileBuffer = await file.arrayBuffer();

            // @ts-ignore
            const loadingTask = pdfjs.getDocument({
              data: new Uint8Array(fileBuffer),
            });
            const pdf = await loadingTask.promise;

            pdfDocRef.current = pdf;
            setPdfPages(Array.from({ length: pdf.numPages }, (_, i) => i));

            // 첫 번째 페이지 렌더링
            await renderPdfPage(pdf, 0);
            setPdfPreview('rendered');
          } catch (error) {
            console.error('PDF 로드 오류:', error);
            setPdfPreview(file.name);
          } finally {
            setIsProcessing(false);
          }
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
    },
    [renderPdfPage]
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

  // 파일 제거
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setEditedFile(null);
    setPdfPreview(null);
    setActiveTool(null);
  }, []);

  // Hex 색상을 RGB로 변환
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }, []);

  // PDF 편집 처리 - 주석을 PDF에 적용
  const handleEditPdf = useCallback(async () => {
    if (!selectedFile || !pdfDocRef.current) return;

    // 브라우저 환경에서만 실행 (Blob은 브라우저 전용 API)
    if (typeof window === 'undefined') return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 각 페이지에 주석 적용
      for (let pageIndex = 0; pageIndex < pdfPages.length; pageIndex++) {
        const page = pdfDoc.getPage(pageIndex);
        const { width, height } = page.getSize();

        // 현재 페이지의 주석들 가져오기
        const pageAnnotations = annotations; // 간단히 모든 주석 적용

        pageAnnotations.forEach(annotation => {
          if (annotation.type === 'highlight') {
            // 하이라이트를 PDF에 추가
            const color = hexToRgb(annotation.color);
            if (color) {
              page.drawRectangle({
                x: annotation.x,
                y: height - annotation.y - (annotation.height || 0), // Y 좌표 변환
                width: annotation.width || 0,
                height: annotation.height || 0,
                color: rgb(color.r / 255, color.g / 255, color.b / 255),
                opacity: 0.3,
              });
            }
          } else if (annotation.type === 'text' && annotation.text) {
            // 텍스트 추가
            page.drawText(annotation.text, {
              x: annotation.x,
              y: height - annotation.y,
              size: 12,
              color: rgb(0, 0, 0),
            });
          } else if (
            annotation.type === 'draw' &&
            annotation.points &&
            annotation.points.length > 1
          ) {
            // 그리기 - 선으로 변환
            const color = hexToRgb(annotation.color);
            if (color) {
              for (let i = 0; i < annotation.points.length - 1; i++) {
                const p1 = annotation.points[i];
                const p2 = annotation.points[i + 1];
                page.drawLine({
                  start: { x: p1.x, y: height - p1.y },
                  end: { x: p2.x, y: height - p2.y },
                  thickness: 2,
                  color: rgb(color.r / 255, color.g / 255, color.b / 255),
                });
              }
            }
          } else if (annotation.type === 'shape') {
            // 도형 (사각형)
            const color = hexToRgb(annotation.color);
            if (color) {
              page.drawRectangle({
                x: annotation.x,
                y: height - annotation.y - (annotation.height || 0),
                width: annotation.width || 0,
                height: annotation.height || 0,
                borderColor: rgb(color.r / 255, color.g / 255, color.b / 255),
                borderWidth: 2,
              });
            }
          }
        });
      }

      const pdfBytes = await pdfDoc.save();
      // Blob 생성은 브라우저 환경에서만 가능 (동적 참조로 빌드 시 오류 방지)
      const BlobConstructor = (window as any).Blob;
      if (!BlobConstructor) {
        throw new Error('Blob API를 사용할 수 없습니다.');
      }
      const blob = new BlobConstructor([pdfBytes], { type: 'application/pdf' });
      setEditedFile(blob);
    } catch (error) {
      console.error('PDF 편집 오류:', error);
      alert('PDF 편집 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, pdfPages, annotations, hexToRgb]);

  // 파일 다운로드
  const handleDownload = useCallback(() => {
    if (!editedFile && !selectedFile) return;

    const fileToDownload = editedFile || selectedFile;
    if (!fileToDownload) return;

    const url = URL.createObjectURL(fileToDownload);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      editedFile && selectedFile
        ? `edited_${selectedFile.name}`
        : selectedFile?.name || 'edited.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [editedFile, selectedFile]);

  // 편집 도구 설정
  const handleToolSelect = useCallback(
    (tool: EditTool) => {
      if (tool === 'text' && !isProFeature) {
        // Pro 기능 안내
        setIsProFeature(true);
        return;
      }
      setActiveTool(tool);
    },
    [isProFeature]
  );

  // Canvas 마우스 이벤트 핸들러
  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!annotationCanvasRef.current) return null;
      const canvas = annotationCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  // 마우스 다운 (그리기 시작)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!activeTool || !annotationCanvasRef.current) return;

      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      if (activeTool === 'draw') {
        setIsDrawing(true);
        const newAnnotation: Annotation = {
          id: Math.random().toString(36).substring(7),
          type: 'draw',
          x: coords.x,
          y: coords.y,
          color: currentColor,
          points: [{ x: coords.x, y: coords.y }],
        };
        setAnnotations(prev => [...prev, newAnnotation]);
        setDrawStart(coords);
      } else if (activeTool === 'highlight' || activeTool === 'shape') {
        setDrawStart(coords);
        setIsDrawing(true);
      }
    },
    [activeTool, currentColor, getCanvasCoordinates]
  );

  // 마우스 이동 (그리기 중)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!activeTool || !isDrawing || !annotationCanvasRef.current) return;

      const coords = getCanvasCoordinates(e);
      if (!coords || !drawStart) return;

      if (activeTool === 'draw') {
        // 그리기 - 마지막 주석에 점 추가
        setAnnotations(prev => {
          const newAnnotations = [...prev];
          const lastAnnotation = newAnnotations[newAnnotations.length - 1];
          if (
            lastAnnotation &&
            lastAnnotation.type === 'draw' &&
            lastAnnotation.points
          ) {
            lastAnnotation.points.push({ x: coords.x, y: coords.y });
          }
          return newAnnotations;
        });
        // 실시간으로 그리기
        const canvas = annotationCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx && drawStart) {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(drawStart.x, drawStart.y);
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();
          setDrawStart(coords);
        }
      } else if (activeTool === 'highlight' || activeTool === 'shape') {
        // 하이라이트/도형 - 실시간 미리보기
        const canvas = annotationCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 임시로 그리기
          drawAnnotations();
          ctx.strokeStyle = currentColor;
          ctx.fillStyle = currentColor;
          ctx.lineWidth = 2;
          const width = coords.x - drawStart.x;
          const height = coords.y - drawStart.y;

          if (activeTool === 'highlight') {
            ctx.globalAlpha = 0.3;
            ctx.fillRect(drawStart.x, drawStart.y, width, height);
            ctx.globalAlpha = 1.0;
          } else {
            ctx.strokeRect(drawStart.x, drawStart.y, width, height);
          }
        }
      }
    },
    [
      activeTool,
      isDrawing,
      drawStart,
      currentColor,
      getCanvasCoordinates,
      drawAnnotations,
    ]
  );

  // 마우스 업 (그리기 종료)
  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!activeTool || !isDrawing || !drawStart) return;

      const coords = getCanvasCoordinates(e);
      if (!coords) {
        setIsDrawing(false);
        setDrawStart(null);
        return;
      }

      if (activeTool === 'highlight' || activeTool === 'shape') {
        const width = coords.x - drawStart.x;
        const height = coords.y - drawStart.y;

        if (Math.abs(width) > 5 && Math.abs(height) > 5) {
          const newAnnotation: Annotation = {
            id: Math.random().toString(36).substring(7),
            type: activeTool === 'highlight' ? 'highlight' : 'shape',
            x: drawStart.x,
            y: drawStart.y,
            width: Math.abs(width),
            height: Math.abs(height),
            color: currentColor,
          };
          setAnnotations(prev => [...prev, newAnnotation]);
        }
      }

      setIsDrawing(false);
      setDrawStart(null);
    },
    [activeTool, isDrawing, drawStart, currentColor, getCanvasCoordinates]
  );

  // 텍스트 추가
  const handleTextAdd = useCallback(() => {
    if (activeTool !== 'text') return;

    const text = prompt('추가할 텍스트를 입력하세요:');
    if (text && annotationCanvasRef.current) {
      const canvas = annotationCanvasRef.current;
      const newAnnotation: Annotation = {
        id: Math.random().toString(36).substring(7),
        type: 'text',
        x: canvas.width / 2 - 50,
        y: canvas.height / 2,
        color: '#000000',
        text: text,
      };
      setAnnotations(prev => [...prev, newAnnotation]);
    }
  }, [activeTool]);

  // 페이지 변경
  const handlePageChange = useCallback(
    async (newPage: number) => {
      if (newPage >= 0 && newPage < pdfPages.length && pdfDocRef.current) {
        setCurrentPage(newPage);
        await renderPdfPage(pdfDocRef.current, newPage);
      }
    },
    [pdfPages, renderPdfPage]
  );

  // 주석 삭제
  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  }, []);

  // 주석 색상 변경
  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
  }, []);

  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* 헤더 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 sm:text-5xl'>
            {t('edit.title')}
          </h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            {t('edit.description')}
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
              {t('edit.selectFile')}
            </h3>
            <p className='mb-6 text-gray-600'>{t('edit.dragDrop')}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className='rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700'
            >
              {t('edit.selectFile')}
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
              onChange={e => handleFileSelect(e.target.files)}
              className='hidden'
            />
            <p className='mt-4 text-sm text-gray-500'>
              {t('edit.supportedFormats')}
            </p>
          </div>
        </div>

        {/* 선택된 파일 및 편집 도구 */}
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

            {/* 편집 도구 */}
            <div className='mb-6 border-t border-gray-200 pt-6'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900'>
                {t('edit.editTools')}
              </h4>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5'>
                <button
                  onClick={() => handleToolSelect('text')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'text'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Type className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('edit.tool.text')}
                  </span>
                </button>
                <button
                  onClick={() => handleToolSelect('image')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'image'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageIcon className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('edit.tool.image')}
                  </span>
                </button>
                <button
                  onClick={() => handleToolSelect('shape')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'shape'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Square className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('edit.tool.shape')}
                  </span>
                </button>
                <button
                  onClick={() => handleToolSelect('highlight')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'highlight'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Highlighter className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('edit.tool.highlight')}
                  </span>
                </button>
                <button
                  onClick={() => handleToolSelect('draw')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                    activeTool === 'draw'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <PenTool className='h-6 w-6 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    {t('edit.tool.draw')}
                  </span>
                </button>
              </div>
            </div>

            {/* PDF 미리보기 및 편집 영역 */}
            {pdfPreview && (
              <div className='mb-6 border-t border-gray-200 pt-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h4 className='text-lg font-semibold text-gray-900'>
                    {t('edit.preview')}
                  </h4>

                  {/* 색상 선택기 */}
                  {activeTool && (
                    <div className='flex items-center gap-2'>
                      <label className='text-sm text-gray-600'>색상:</label>
                      <input
                        type='color'
                        value={currentColor}
                        onChange={e => handleColorChange(e.target.value)}
                        className='h-8 w-16 cursor-pointer rounded border border-gray-300'
                      />
                    </div>
                  )}
                </div>

                {selectedFile.type === 'application/pdf' ||
                selectedFile.name.endsWith('.pdf') ? (
                  pdfPreview === 'rendered' ? (
                    <div className='relative rounded-lg border border-gray-200 bg-gray-50 p-4'>
                      {/* 페이지 네비게이션 */}
                      {pdfPages.length > 1 && (
                        <div className='mb-4 flex items-center justify-center gap-4'>
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50'
                          >
                            이전
                          </button>
                          <span className='text-sm text-gray-600'>
                            {currentPage + 1} / {pdfPages.length}
                          </span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pdfPages.length - 1}
                            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50'
                          >
                            다음
                          </button>
                        </div>
                      )}

                      {/* PDF 캔버스 컨테이너 */}
                      <div className='relative mx-auto max-w-full overflow-auto'>
                        <div className='relative inline-block'>
                          {/* PDF 렌더링 캔버스 */}
                          <canvas
                            ref={pdfCanvasRef}
                            className='absolute left-0 top-0'
                            style={{ display: 'block' }}
                          />
                          {/* 주석 캔버스 */}
                          <canvas
                            ref={annotationCanvasRef}
                            className='relative cursor-crosshair'
                            style={{ display: 'block' }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={() => {
                              setIsDrawing(false);
                              setDrawStart(null);
                            }}
                          />
                        </div>
                      </div>

                      {/* 주석 목록 */}
                      {annotations.length > 0 && (
                        <div className='mt-4 rounded-lg border border-gray-200 bg-white p-4'>
                          <h5 className='mb-2 text-sm font-semibold text-gray-900'>
                            주석 목록 ({annotations.length})
                          </h5>
                          <div className='space-y-2'>
                            {annotations.map(ann => (
                              <div
                                key={ann.id}
                                className='flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2'
                              >
                                <span className='text-sm text-gray-700'>
                                  {ann.type === 'highlight'
                                    ? '하이라이트'
                                    : ann.type === 'text'
                                    ? `텍스트: ${ann.text}`
                                    : ann.type === 'draw'
                                    ? '그리기'
                                    : '도형'}
                                </span>
                                <button
                                  onClick={() => handleDeleteAnnotation(ann.id)}
                                  className='rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-600'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 텍스트 추가 버튼 */}
                      {activeTool === 'text' && (
                        <div className='mt-4 text-center'>
                          <button
                            onClick={handleTextAdd}
                            className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
                          >
                            텍스트 추가
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
                      <FileText className='h-16 w-16 text-gray-400' />
                      <p className='text-gray-600'>{pdfPreview}</p>
                    </div>
                  )
                ) : (
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
                    <img
                      src={pdfPreview}
                      alt='미리보기'
                      className='mx-auto max-h-96 rounded-lg'
                    />
                  </div>
                )}
              </div>
            )}

            {/* 액션 버튼 */}
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                onClick={handleEditPdf}
                disabled={isProcessing}
                className='flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
              >
                {isProcessing ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    {t('edit.processing')}
                  </>
                ) : (
                  <>
                    <Edit className='h-5 w-5' />
                    {t('edit.editPdf')}
                  </>
                )}
              </button>
              {(editedFile || selectedFile) && (
                <button
                  onClick={handleDownload}
                  className='flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50'
                >
                  <Download className='h-5 w-5' />
                  {t('edit.download')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pro 기능 안내 모달 */}
        {isProFeature && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='mx-4 max-w-md rounded-2xl bg-white p-6 shadow-xl'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-xl font-bold text-gray-900'>
                  {t('edit.proFeature.title')}
                </h3>
                <button
                  onClick={() => setIsProFeature(false)}
                  className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
              <p className='mb-6 text-gray-600'>
                {t('edit.proFeature.description')}
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => setIsProFeature(false)}
                  className='flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50'
                >
                  {t('edit.proFeature.later')}
                </button>
                <button
                  onClick={() => {
                    setIsProFeature(false);
                    // Pro 체험판 페이지로 이동
                    window.location.href = '/convert';
                  }}
                  className='flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
                >
                  {t('edit.proFeature.trial')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 기능 소개 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            {t('edit.section.title')}
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            {t('edit.section.description')}
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {/* 강력한 PDF 편집 - 완전히 간단 */}
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <Edit className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                {t('edit.feature.powerful.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('edit.feature.powerful.description')}
            </p>
          </div>

          {/* 한눈에 보는 문서 정리 */}
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <FileCheck className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                {t('edit.feature.organize.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('edit.feature.organize.description')}
            </p>
          </div>

          {/* 빠르게 저장, 쉽게 공유 */}
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <Share2 className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>
                {t('edit.feature.share.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('edit.feature.share.description')}
            </p>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-gray-200 bg-white p-8'>
          <h2 className='mb-6 text-center text-3xl font-bold text-gray-900'>
            {t('edit.howto.title')}
          </h2>
          <div className='space-y-6'>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                1
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('edit.howto.step1')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                2
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('edit.howto.step2')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                3
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('edit.howto.step3')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                4
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('edit.howto.step4')}
                </h3>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
                5
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  {t('edit.howto.step5')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 보안 및 기능 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Lock className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('edit.security.gdpr.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('edit.security.gdpr.description')}
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Shield className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('edit.security.iso.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('edit.security.iso.description')}
            </p>
          </div>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <Lock className='h-5 w-5 text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t('edit.security.encryption.title')}
              </h3>
            </div>
            <p className='text-sm text-gray-600'>
              {t('edit.security.encryption.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
