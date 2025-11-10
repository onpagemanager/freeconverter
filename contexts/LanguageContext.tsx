'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

// 지원하는 언어 타입
export type Language = 'ko' | 'en';

// 언어 컨텍스트 타입 정의
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// 언어 컨텍스트 생성
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// 언어별 텍스트 정의
const translations: Record<Language, Record<string, string>> = {
  ko: {
    // 메뉴 항목
    'menu.compress': '압축하기',
    'menu.convert': '변환하기',
    'menu.image-convert': '이미지변환',
    'menu.organize': '정리',
    'menu.view-edit': '보기 및 편집',
    'menu.from-pdf': 'PDF에서 변환',
    'menu.to-pdf': 'PDF로 변환',
    // 정리 서브메뉴
    'menu.merge': 'PDF 합치기',
    'menu.split': 'PDF 분할',
    'menu.rotate': 'PDF 회전',
    'menu.delete-pages': 'PDF 페이지 삭제',
    'menu.extract-pages': 'PDF 페이지 추출',
    // 보기 및 편집 서브메뉴
    'menu.edit': 'PDF 편집',
    'menu.annotate': 'PDF 주석도구',
    // PDF에서 변환 서브메뉴
    'menu.pdf-to-word': 'PDF 워드 변환',
    'menu.pdf-to-excel': 'PDF 엑셀 변환',
    'menu.pdf-to-ppt': 'PDF PPT 변환',
    'menu.pdf-to-jpg': 'PDF JPG 변환',
    // PDF로 변환 서브메뉴
    'menu.word-to-pdf': '워드 PDF 변환',
    'menu.excel-to-pdf': '엑셀 PDF 변환',
    'menu.ppt-to-pdf': 'PPT PDF 변환',
    'menu.jpg-to-pdf': 'JPG PDF 변환',
    'menu.pdf-ocr': 'PDF OCR 변환',
    'menu.blog': '블로그',
    // 언어 선택
    'language.korean': '한국어',
    'language.english': 'English',
    // 홈페이지
    'home.hero.title': '무료 이미지 변환기 | JPG, PNG, PDF 한 번에 변환',
    'home.hero.description':
      '더 생산적이고 스마트한 문서 작업에 필요한 모든 도구를 만나보세요.',
    'home.relatedKeywords.title': '연관검색어',
    'home.relatedKeywords.keyword1': '이미지변환사이트',
    'home.relatedKeywords.keyword2': '핸드폰사진 변환',
    'home.relatedKeywords.keyword3': 'PDF 변환',
    'home.hero.cta.start': '시작하기',
    'home.hero.cta.viewAll': '전체 PDF 도구 살펴보기',
    'home.popular.title': '가장 인기있는 PDF 도구',
    'home.popular.description':
      'PDF를 무료로 변환, 압축, 편집할 수 있는 30가지 도구가 준비되어 있습니다. 지금 사용해 보세요!',
    'home.popular.tool.pdfToWord.name': 'PDF 워드 변환',
    'home.popular.tool.pdfToWord.description':
      'PDF를 편집 가능한 Word 문서로 변환합니다',
    'home.popular.tool.merge.name': 'PDF 합치기',
    'home.popular.tool.merge.description':
      '여러 PDF를 1개의 통합된 문서로 결합합니다',
    'home.popular.tool.jpgToPdf.name': 'JPG PDF 변환',
    'home.popular.tool.jpgToPdf.description':
      'JPG, PNG, BMP, GIF 및 TIFF 이미지를 PDF로 변환합니다',
    'home.popular.tool.sign.name': 'PDF에 서명',
    'home.popular.tool.sign.description':
      '전자 서명을 만들고 문서에 서명해보세요',
    'home.popular.tool.edit.name': 'PDF 편집',
    'home.popular.tool.edit.description':
      'PDF에 텍스트, 모양, 이미지, 자유형 주석을 추가합니다',
    'home.popular.tool.compress.name': 'PDF 압축',
    'home.popular.tool.compress.description':
      '품질을 낮추지 않고 PDF의 크기를 줄입니다',
    'home.popular.tryIt': '사용해보기',
    'home.popular.viewAll': '전체 PDF 도구 보기',
    'home.simple.title': '단순한 작업을 간단하게',
    'home.simple.description':
      'Freeconvert, 모두가 사랑하게 될 세상에 단 하나뿐인 PDF 소프트웨어. 디지털 문서 작업을 시작하고 관리, 마무리하는 데 필요한 모든 도구를 Freeconvert에서 만나보세요.',
    'home.feature.workWithFiles.title': '파일에서 직접 문서 작업',
    'home.feature.workWithFiles.description':
      '단순히 PDF 문서를 확인하는 것보다 더 많은 작업을 해보세요. 문서에 강조 표시를 하고 텍스트, 이미지, 도형, 자유형 주석을 원하는 대로 추가할 수 있습니다. 그 외 30가지 도구에 연결하여 파일을 더욱 개선해보세요.',
    'home.feature.workWithFiles.cta': '지금 PDF 편집하기',
    'home.feature.digitalSignature.title': '간편해진 디지털 서명',
    'home.feature.digitalSignature.description':
      '양식 작성, 계약서 전자 서명, 계약 체결 등의 업무를 몇 가지 간단한 절차만으로 처리해 보세요. 이에 더해 전자 서명을 요청하고 모든 단계에서 사용자의 문서를 추적할 수 있습니다.',
    'home.feature.digitalSignature.cta': '전자 서명하기',
    'home.feature.perfectDocument.title': 'Freeconvert로 만드는 완벽한 문서',
    'home.feature.perfectDocument.description':
      '파일이 너무 큰가요? 파일을 압축해 크기를 줄여보세요. 특정 형식의 파일이 필요하신가요? 변환기를 사용해 파일을 원하는 형식으로 변환해 보세요. 문서 관리가 점점 복잡해지나요? 파일을 병합 및 분할하거나 여분의 페이지를 삭제해 보세요. Freeconvert에서 이 모든 기능을 만나보세요.',
    'home.feature.perfectDocument.cta': '전체 PDF 도구 보기',
    'home.feature.allInOne.title': '모든 문서 관리를 한 곳에서',
    'home.feature.allInOne.description':
      '더는 여러 가지 앱을 넘나들며 작업하실 필요가 없습니다! Freeconvert 웹 플랫폼에서 직접 작업하면 여러 기기에서 파일을 저장, 관리, 공유하는 데 소요되는 시간을 절약하실 수 있습니다.',
    'home.feature.allInOne.cta': '시작하기',
    'home.mobile.title': '모바일에서 이용하기',
    'home.mobile.description':
      '언제 어디서나 Freeconvert 모바일 앱으로 연결된 모든 기기에서 스캔한 문서 PDF 만들기, 문서 정리, 파일 공유 작업을 해 보세요.',
    'home.mobile.googlePlay': 'Get it on Google Play',
    'home.mobile.appStore': 'Download on the App Store',
    'home.whyChoose.title': '왜 Freeconvert를 선택해야 하나요?',
    'home.whyChoose.trustedByUsers.title': '수많은 사용자가 신뢰하는 서비스',
    'home.whyChoose.trustedByUsers.description':
      '10억 명 이상의 사용자가 Freeconvert 서비스를 사용하며 간편해진 디지털 문서 작업을 경험하고 있습니다.',
    'home.whyChoose.trustedByBusiness.title': '기업이 신뢰하는 서비스',
    'home.whyChoose.trustedByBusiness.description':
      'Freeconvert는 Capterra, G2, TrustPilot과 같은 주요 B2B 소프트웨어 순위 플랫폼에서 높은 평점을 달성한 PDF 소프트웨어 중 하나입니다.',
    'home.whyChoose.trustedByPartners.title': '파트너사가 신뢰하는 서비스',
    'home.whyChoose.trustedByPartners.description':
      'Freeconvert Chrome 확장 프로그램, Google Workspace, Dropbox 앱으로 추가 기능을 해제하세요. 모두 무료로 사용하실 수 있습니다.',
    'home.whyChoose.support.title': '24시간 고객 지원 서비스',
    'home.whyChoose.support.description':
      '24시간 고객 지원 서비스로 언제든지 필요한 도움을 제공해 드립니다.',
    'home.whyChoose.encryption.title': '256비트 TLS 암호화',
    'home.whyChoose.encryption.description':
      '모든 정보 전송은 256비트 TLS 암호화를 사용하여 안전하게 보호됩니다.',
    'home.whyChoose.security.title': '보안 표준',
    'home.whyChoose.security.description':
      'Freeconvert는 사용자 안전을 최우선으로 생각합니다. 당사는 ISO/IEC 27001 인증을 받았으며 GDPR, CCPA, nFADP를 준수합니다.',
    'home.trial.title': 'Freeconvert 무료 체험',
    'home.trial.description':
      '변환, 압축, 전자 서명, 등 전체 Freeconvert 도구를 무제한으로 사용해보세요.',
    'home.trial.cta': '시작하기',
    // PDF 편집 페이지
    'edit.title': 'PDF Editor',
    'edit.description':
      'PDF에 텍스트, 이미지, 도형, 하이라이트, 주석을 쉽게 추가할 수 있습니다. Pro 계정으로 기존 텍스트도 편집할 수 있습니다.',
    'edit.selectFile': '파일 선택',
    'edit.dragDrop': '또는 파일을 여기로 끌어 놓으세요',
    'edit.supportedFormats': '지원하는 형식: PDF, DOC, XLS, PPT, PNG, JPG',
    'edit.editTools': '편집 도구',
    'edit.tool.text': '텍스트 추가',
    'edit.tool.image': '이미지 추가',
    'edit.tool.shape': '도형 추가',
    'edit.tool.highlight': '하이라이트',
    'edit.tool.draw': '그리기',
    'edit.preview': '미리보기',
    'edit.processing': '처리 중...',
    'edit.editPdf': '편집하기',
    'edit.download': '다운로드',
    'edit.proFeature.title': 'Pro 기능 안내',
    'edit.proFeature.description':
      '기존 텍스트 편집 기능은 Pro 계정에서만 사용할 수 있습니다. 시작하기하고 모든 기능을 사용해보세요.',
    'edit.proFeature.later': '나중에',
    'edit.proFeature.trial': '7일 무료 체험',
    'edit.section.title': 'PDF 편집 - 간편하게',
    'edit.section.description':
      '문서 작업이 어렵지 않아야 합니다. 그래서 PDF 편집을 간소화하여 전문 문서에서 원하는 모든 작업을 자유롭게 수행할 수 있도록 했습니다.',
    'edit.feature.powerful.title': '강력한 PDF 편집 - 완전히 간단',
    'edit.feature.powerful.description':
      "'편집'이라고 하면 정말 편집을 의미합니다. 새 텍스트 추가, 기존 텍스트 편집, 하이라이트, 그리기, 도형 및 이미지 삽입 - 필요한 모든 것을 제공합니다. 사용하기 매우 간단하며 설정이나 온보딩이 필요 없습니다. 바로 시작하세요.",
    'edit.feature.organize.title': '한눈에 보는 문서 정리',
    'edit.feature.organize.description':
      '정리 모드를 사용하여 재배열, 병합, 추출, 분할 등을 수행하세요. 다양한 파일 형식 내보내기 옵션으로 원하는 형식으로 문서를 저장할 수 있습니다. PDF를 압축하거나 평면화할 수도 있습니다.',
    'edit.feature.share.title': '빠르게 저장, 쉽게 공유',
    'edit.feature.share.description':
      'PDF 편집을 완료했나요? 편집된 파일을 Freeconvert, 기기 또는 Dropbox나 G Suite와 같은 연결된 앱 중 하나에 저장하거나 빠른 다운로드 링크로 공유하세요.',
    'edit.howto.title': 'PDF 파일을 온라인에서 무료로 편집하는 방법',
    'edit.howto.step1': 'PDF 파일을 편집기에 가져오거나 드래그 앤 드롭하세요.',
    'edit.howto.step2':
      '원하는 대로 텍스트, 이미지, 도형, 마크업 및 전자 서명을 추가하세요.',
    'edit.howto.step3': '필요한 경우 문서 페이지를 정리하세요.',
    'edit.howto.step4':
      '파일을 PDF 또는 다른 파일 형식으로 "내보내기"를 클릭하세요.',
    'edit.howto.step5': '준비가 되면 편집된 PDF를 다운로드하세요. 끝!',
    'edit.security.gdpr.title': 'GDPR 준수',
    'edit.security.gdpr.description':
      '일반 데이터 보호 규정(GDPR)을 준수하여 개인 데이터를 올바르게 관리합니다.',
    'edit.security.iso.title': 'ISO/IEC 27001 인증',
    'edit.security.iso.description':
      '매년 ISO/IEC 27001 인증을 받아 정보의 안전성과 보안을 보장합니다.',
    'edit.security.encryption.title': '파일 전송 암호화',
    'edit.security.encryption.description':
      '편집, 압축 또는 변환 중에도 고급 TLS 암호화로 파일을 안전하게 보호합니다.',
    // PDF 주석 페이지
    'annotate.title': 'Annotate PDF',
    'annotate.description':
      '브라우저에서 PDF에 마크업, 하이라이트, 텍스트를 무료로 추가하세요. 더 빠른 피드백과 쉬운 편집을 위해 온라인에서 PDF에 주석을 쉽게 달 수 있습니다. 다운로드나 가입이 필요 없습니다.',
    'annotate.selectFile': '파일 선택',
    'annotate.dragDrop': '또는 파일을 여기로 끌어 놓으세요',
    'annotate.supportedFormats': '지원하는 형식: PDF, DOC, XLS, PPT, PNG, JPG',
    'annotate.tools': '주석 도구',
    'annotate.tool.highlight': '하이라이트',
    'annotate.tool.text': '텍스트 추가',
    'annotate.tool.draw': '그리기',
    'annotate.tool.underline': '밑줄',
    'annotate.tool.strikethrough': '취소선',
    'annotate.tool.shape': '도형',
    'annotate.tool.comment': '주석',
    'annotate.preview': '미리보기',
    'annotate.processing': '처리 중...',
    'annotate.finish': '완료',
    'annotate.download': '다운로드',
    'annotate.section.title': '모든 PDF에 명확성과 컨텍스트 추가',
    'annotate.section.description':
      '계약서 검토, 프레젠테이션 준비, 양식 작성 또는 보고서에 피드백을 제공하는 경우, Freeconvert를 사용하면 PDF에 직접 텍스트, 그림, 이미지, 하이라이트를 쉽게 추가할 수 있습니다.',
    'annotate.feature.clear.title': '명확하고 체계적으로 유지',
    'annotate.feature.clear.description':
      '색상, 도형, 콜아웃을 사용하여 핵심 포인트나 필요한 업데이트를 강조하세요. 주석을 깔끔하고 쉽게 따라갈 수 있게 유지하여 더 빠른 검토와 승인을 받으세요.',
    'annotate.feature.forms.title': '양식을 빠르게 작성',
    'annotate.feature.forms.description':
      '자동 감지된 필드에 직접 정보를 추가하세요. 텍스트 상자를 추가할 필요 없이 바로 입력을 시작할 수 있습니다—빠르고 쉽습니다!',
    'annotate.feature.anywhere.title': '언제 어디서나 작업',
    'annotate.feature.anywhere.description':
      'Mac, Windows, Linux, iOS 또는 Android의 브라우저에서 주석을 추가하세요. 소프트웨어 다운로드나 학습 곡선이 없습니다. 업로드, 마크업, 공유만 하면 됩니다.',
    'annotate.howto.title': '온라인에서 PDF 페이지에 무료로 주석을 다는 방법',
    'annotate.howto.step1': 'PDF를 무료 주석 도구로 드래그 앤 드롭하세요.',
    'annotate.howto.step2':
      '도구 모음을 사용하여 텍스트, 그림 또는 도형을 추가하세요.',
    'annotate.howto.step3':
      '하이라이트, 밑줄, 취소선 등을 사용하여 텍스트에 마크업을 추가하세요.',
    'annotate.howto.step4':
      '완료를 클릭하여 PDF를 다운로드하거나 30개 이상의 도구로 더 편집하세요.',
    'annotate.feature.immediate.title': '즉시 시작—번거로움 없음',
    'annotate.feature.immediate.description':
      '브라우저에서 직접 PDF에 주석을 추가하세요. 다운로드, 가입, 복잡한 설정이 필요 없습니다. 업로드, 주석 추가, 진행만 하면 됩니다.',
    'annotate.feature.keyInfo.title': '핵심 정보 강조',
    'annotate.feature.keyInfo.description':
      '맞춤 하이라이트 색상과 다용도 연필 도구를 사용하여 텍스트, 그림 또는 섹션을 강조하여 검토를 더 빠르고 명확하게 만드세요.',
    'annotate.feature.feedback.title': '중요한 곳에 피드백 제공',
    'annotate.feature.feedback.description':
      '필요한 정확한 위치에 텍스트나 하이라이트를 추가하여 피드백이 항상 명확하고 관련성이 있으며 실행 가능하도록 하세요.',
    'annotate.feature.secure.title': '안전하고 비공개',
    'annotate.feature.secure.description':
      'GDPR을 준수하고 ISO/IEC 27001 인증을 받았으며 TLS 암호화로 파일을 보호합니다. 추가 안심을 위해 파일은 1시간 후 자동으로 삭제됩니다.',
    'annotate.feature.focus.title': '독자가 집중할 곳 표시',
    'annotate.feature.focus.description':
      '그림에 원을 그리거나, 구문에 밑줄을 긋거나, 화살표와 도형을 사용하여 PDF에서 주의를 이끌어 내세요. 사람들이 집중해야 할 곳에 의심의 여지가 없도록 하세요.',
    'annotate.feature.device.title': '모든 장치에서 주석 추가',
    'annotate.feature.device.description':
      '책상에 있든 이동 중이든, 인터넷 연결이 있는 모든 장치에서 PDF에 주석을 추가할 수 있습니다: 데스크톱, 태블릿 또는 모바일.',
  },
  en: {
    // Menu items
    'menu.compress': 'Compress',
    'menu.convert': 'Convert',
    'menu.image-convert': 'Image Convert',
    'menu.organize': 'Organize',
    'menu.view-edit': 'View & Edit',
    'menu.from-pdf': 'From PDF',
    'menu.to-pdf': 'To PDF',
    // Organize submenu
    'menu.merge': 'Merge PDF',
    'menu.split': 'Split PDF',
    'menu.rotate': 'Rotate PDF',
    'menu.delete-pages': 'Delete PDF Pages',
    'menu.extract-pages': 'Extract PDF Pages',
    // View & Edit submenu
    'menu.edit': 'Edit PDF',
    'menu.annotate': 'Annotate PDF',
    // From PDF submenu
    'menu.pdf-to-word': 'PDF to Word',
    'menu.pdf-to-excel': 'PDF to Excel',
    'menu.pdf-to-ppt': 'PDF to PPT',
    'menu.pdf-to-jpg': 'PDF to JPG',
    // To PDF submenu
    'menu.word-to-pdf': 'Word to PDF',
    'menu.excel-to-pdf': 'Excel to PDF',
    'menu.ppt-to-pdf': 'PPT to PDF',
    'menu.jpg-to-pdf': 'JPG to PDF',
    'menu.pdf-ocr': 'PDF OCR',
    'menu.blog': 'Blog',
    // Language selection
    'language.korean': '한국어',
    'language.english': 'English',
    // Homepage
    'home.hero.title':
      'Free Image Converter | Convert JPG, PNG, PDF Files All at Once',
    'home.hero.description':
      'Discover all the tools you need to work more productively and intelligently with documents.',
    'home.relatedKeywords.title': 'Related Keywords',
    'home.relatedKeywords.keyword1': 'Image Conversion Site',
    'home.relatedKeywords.keyword2': 'Mobile Photo Conversion',
    'home.relatedKeywords.keyword3': 'PDF Conversion',
    'home.hero.cta.start': 'Start Free Trial',
    'home.hero.cta.viewAll': 'View All PDF Tools',
    'home.popular.title': 'Most Popular PDF Tools',
    'home.popular.description':
      '30 tools are available to convert, compress, and edit PDFs for free. Try them now!',
    'home.popular.tool.pdfToWord.name': 'PDF to Word',
    'home.popular.tool.pdfToWord.description':
      'Convert PDF to editable Word documents',
    'home.popular.tool.merge.name': 'Merge PDF',
    'home.popular.tool.merge.description':
      'Combine multiple PDFs into one unified document',
    'home.popular.tool.jpgToPdf.name': 'JPG to PDF',
    'home.popular.tool.jpgToPdf.description':
      'Convert JPG, PNG, BMP, GIF, and TIFF images to PDF',
    'home.popular.tool.sign.name': 'Sign PDF',
    'home.popular.tool.sign.description':
      'Create and add electronic signatures to documents',
    'home.popular.tool.edit.name': 'Edit PDF',
    'home.popular.tool.edit.description':
      'Add text, shapes, images, and freehand annotations to PDFs',
    'home.popular.tool.compress.name': 'Compress PDF',
    'home.popular.tool.compress.description':
      'Reduce PDF size without lowering quality',
    'home.popular.tryIt': 'Try it',
    'home.popular.viewAll': 'View All PDF Tools',
    'home.simple.title': 'Simplify Simple Tasks',
    'home.simple.description':
      "Freeconvert, the world's only PDF software that everyone will love. Discover all the tools you need to start, manage, and finish your digital document work with Freeconvert.",
    'home.feature.workWithFiles.title':
      'Work with Documents Directly from Files',
    'home.feature.workWithFiles.description':
      'Do more than just view PDF documents. Highlight documents and add text, images, shapes, and freehand annotations as you wish. Connect to 30 other tools to further improve your files.',
    'home.feature.workWithFiles.cta': 'Edit PDF Now',
    'home.feature.digitalSignature.title': 'Simplified Digital Signatures',
    'home.feature.digitalSignature.description':
      'Handle tasks such as filling out forms, signing contracts electronically, and closing deals with just a few simple steps. In addition, you can request electronic signatures and track your documents at every step.',
    'home.feature.digitalSignature.cta': 'Sign Electronically',
    'home.feature.perfectDocument.title':
      'Perfect Documents Made with Freeconvert',
    'home.feature.perfectDocument.description':
      'Is your file too large? Compress it to reduce its size. Need a file in a specific format? Use the converter to convert files to your desired format. Is document management getting complicated? Try merging and splitting files or deleting extra pages. Discover all these features with Freeconvert.',
    'home.feature.perfectDocument.cta': 'View All PDF Tools',
    'home.feature.allInOne.title': 'All Document Management in One Place',
    'home.feature.allInOne.description':
      'You no longer need to work across multiple apps! Working directly on the Freeconvert web platform saves time spent storing, managing, and sharing files across multiple devices.',
    'home.feature.allInOne.cta': 'Start Free Trial',
    'home.mobile.title': 'Use on Mobile',
    'home.mobile.description':
      'Create PDFs from scanned documents, organize documents, and share files on any device connected to the Freeconvert mobile app, anytime, anywhere.',
    'home.mobile.googlePlay': 'Get it on Google Play',
    'home.mobile.appStore': 'Download on the App Store',
    'home.whyChoose.title': 'Why Choose Freeconvert?',
    'home.whyChoose.trustedByUsers.title': 'Trusted by Millions of Users',
    'home.whyChoose.trustedByUsers.description':
      'Over 1 billion users use Freeconvert services and experience simplified digital document work.',
    'home.whyChoose.trustedByBusiness.title': 'Trusted by Businesses',
    'home.whyChoose.trustedByBusiness.description':
      'Freeconvert is one of the PDF software solutions that has achieved high ratings on major B2B software ranking platforms such as Capterra, G2, and TrustPilot.',
    'home.whyChoose.trustedByPartners.title': 'Trusted by Partners',
    'home.whyChoose.trustedByPartners.description':
      'Unlock additional features with the Freeconvert Chrome extension, Google Workspace, and Dropbox apps. All are available for free.',
    'home.whyChoose.support.title': '24/7 Customer Support',
    'home.whyChoose.support.description':
      'We provide help whenever you need it with 24/7 customer support.',
    'home.whyChoose.encryption.title': '256-bit TLS Encryption',
    'home.whyChoose.encryption.description':
      'All information transmission is securely protected using 256-bit TLS encryption.',
    'home.whyChoose.security.title': 'Security Standards',
    'home.whyChoose.security.description':
      'Freeconvert prioritizes user safety. We are ISO/IEC 27001 certified and comply with GDPR, CCPA, and nFADP.',
    'home.trial.title': 'Freeconvert Free Trial',
    'home.trial.description':
      'Start a 7-day free trial and use all Freeconvert tools including conversion, compression, and electronic signatures without limits.',
    'home.trial.cta': 'Start Free Trial',
    // PDF Edit Page
    'edit.title': 'PDF Editor',
    'edit.description':
      'Easily add text, images, shapes, highlights, and annotations to your PDFs. With a Pro account, you can also edit existing text.',
    'edit.selectFile': 'Choose Files',
    'edit.dragDrop': 'or drop files here',
    'edit.supportedFormats': 'Supported formats: PDF, DOC, XLS, PPT, PNG, JPG',
    'edit.editTools': 'Edit Tools',
    'edit.tool.text': 'Add Text',
    'edit.tool.image': 'Add Image',
    'edit.tool.shape': 'Add Shape',
    'edit.tool.highlight': 'Highlight',
    'edit.tool.draw': 'Draw',
    'edit.preview': 'Preview',
    'edit.processing': 'Processing...',
    'edit.editPdf': 'Edit PDF',
    'edit.download': 'Download',
    'edit.proFeature.title': 'Pro Feature',
    'edit.proFeature.description':
      'Direct text editing is available with a Pro account. Start a 7-day free trial and experience all features.',
    'edit.proFeature.later': 'Later',
    'edit.proFeature.trial': 'Try 7 Days Free',
    'edit.section.title': 'Edit Your PDFs—The Easy Way',
    'edit.section.description':
      "Document work shouldn't be hard. That's why we've simplified PDF editing, so you can have the freedom and flexibility to do anything you want with your professional documents.",
    'edit.feature.powerful.title': 'Powerful PDF Editing—Totally Simple',
    'edit.feature.powerful.description':
      "When we say 'edit,' we really mean 'edit.' Add new text, edit existing text, highlight, draw, insert shapes and images—whatever you need, we've got it. So simple to use, no setup or onboarding needed. Get started right away.",
    'edit.feature.organize.title': 'Document Organization at a Glance',
    'edit.feature.organize.description':
      'Use the Organize mode to rearrange, merge, extract, split, and more. With a host of file-type export options, save your document in any format you like. You can even compress or flatten your PDF—your document, your way.',
    'edit.feature.share.title': 'Quick to Save, Easy to Share',
    'edit.feature.share.description':
      'Done making magic and editing your PDF? Simply save your edited file to Freeconvert, your device, or any of our connected apps, such as Dropbox or G Suite, or share it with a quick download link.',
    'edit.howto.title': 'How To Edit a PDF File Online for Free',
    'edit.howto.step1': 'Import or drag & drop your PDF file to our editor.',
    'edit.howto.step2':
      'Add text, images, shapes, markups, and e-signatures as desired.',
    'edit.howto.step3': 'Organize document pages if needed.',
    'edit.howto.step4':
      'Click to "Export" your file as a PDF or other file type.',
    'edit.howto.step5': "Download your edited PDF when ready—that's it!",
    'edit.security.gdpr.title': 'GDPR Compliance',
    'edit.security.gdpr.description':
      'We comply with the General Data Protection Regulation (GDPR), ensuring we manage your personal data correctly.',
    'edit.security.iso.title': 'ISO/IEC 27001 Certification',
    'edit.security.iso.description':
      'We are audited annually for our ISO/IEC 27001 certification, a mark that assures the safety and security of your information.',
    'edit.security.encryption.title': 'File Transfer Encryption',
    'edit.security.encryption.description':
      "We even keep your files secure while you're editing, compressing, or converting them, with high-tech TLS encryption.",
    // PDF Annotate Page
    'annotate.title': 'Annotate PDF',
    'annotate.description':
      'Mark up, highlight, and add text on your PDFs right in your browser for free. Easily annotate PDFs online for faster feedback and easier edits. No downloads or signups needed.',
    'annotate.selectFile': 'Choose Files',
    'annotate.dragDrop': 'or drop files here',
    'annotate.supportedFormats':
      'Supported formats: PDF, DOC, XLS, PPT, PNG, JPG',
    'annotate.tools': 'Annotation Tools',
    'annotate.tool.highlight': 'Highlight',
    'annotate.tool.text': 'Add Text',
    'annotate.tool.draw': 'Draw',
    'annotate.tool.underline': 'Underline',
    'annotate.tool.strikethrough': 'Strikethrough',
    'annotate.tool.shape': 'Shape',
    'annotate.tool.comment': 'Comment',
    'annotate.preview': 'Preview',
    'annotate.processing': 'Processing...',
    'annotate.finish': 'Finish',
    'annotate.download': 'Download',
    'annotate.section.title': 'Add Clarity and Context to Any PDF',
    'annotate.section.description':
      "Whether you're reviewing a contract, preparing a presentation, filling out a form, or giving feedback on a report, Freeconvert makes it easy to add text, drawings, images, and highlights directly on your PDFs.",
    'annotate.feature.clear.title': 'Stay Clear & Organized',
    'annotate.feature.clear.description':
      'Use colors, shapes, and callouts to emphasize key points or needed updates. Keep your annotations neat and easy to follow for faster reviews and approvals.',
    'annotate.feature.forms.title': 'Fill Out Forms Quickly',
    'annotate.feature.forms.description':
      'Add your information directly to the auto-detected fields. You can just start typing without needing to add any textboxes—quick and easy!',
    'annotate.feature.anywhere.title': 'Work Anywhere, Anytime',
    'annotate.feature.anywhere.description':
      'Annotate from your browser on Mac, Windows, Linux, iOS, or Android. No software downloads, no learning curve. Just upload, mark up, and share.',
    'annotate.howto.title': 'How To Annotate PDF Pages Online for Free',
    'annotate.howto.step1': 'Drag & drop your PDF into our free Annotate tool.',
    'annotate.howto.step2': 'Use the toolbar to add text, drawings, or shapes.',
    'annotate.howto.step3':
      'Markup the text with highlights, underlines, strikethroughs, and more.',
    'annotate.howto.step4':
      "Click 'Finish' to download your PDF, or edit further with 30+ tools.",
    'annotate.feature.immediate.title': 'Start Immediately—No Fuss',
    'annotate.feature.immediate.description':
      'Annotate PDFs directly in your browser. No downloads, signups, or complicated setup. Just upload, annotate, and be on your way.',
    'annotate.feature.keyInfo.title': 'Highlight Key Information',
    'annotate.feature.keyInfo.description':
      'Emphasize text, figures, or sections with custom highlight colors and a versatile pencil tool to make reviews faster and clearer.',
    'annotate.feature.feedback.title': 'Feedback Where It Counts',
    'annotate.feature.feedback.description':
      'Add text or highlights exactly where you need them, so your feedback is always clear, relevant, and actionable.',
    'annotate.feature.secure.title': 'Secure & Private',
    'annotate.feature.secure.description':
      "We're GDPR compliant, ISO/IEC 27001 certified, and we protect your files with TLS encryption. Files are auto-deleted after one hour for extra peace of mind.",
    'annotate.feature.focus.title': 'Show Readers Where to Focus',
    'annotate.feature.focus.description':
      'Circle figures, underline phrases, or use arrows and shapes to guide attention in your PDF. Leave no doubt where people need to focus.',
    'annotate.feature.device.title': 'Annotate on Any Device',
    'annotate.feature.device.description':
      "Whether you're at your desk or on the go, annotate PDFs from any device with internet access: desktop, tablet, or mobile.",
  },
};

// 언어 컨텍스트 프로바이더 컴포넌트
export function LanguageProvider({ children }: { children: ReactNode }) {
  // 초기 상태를 클라이언트에서만 localStorage에서 읽어오도록 설정
  // SSR과 하이드레이션 불일치를 방지하기 위해 초기값은 'ko'로 설정
  const [language, setLanguageState] = useState<Language>('ko');
  const [isInitialized, setIsInitialized] = useState(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 언어 설정 불러오기
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage === 'ko' || savedLanguage === 'en') {
        setLanguageState(savedLanguage);
      }
      setIsInitialized(true);
      // 초기 HTML lang 속성 설정
      document.documentElement.lang = savedLanguage || 'ko';
    }
  }, []);

  // 언어 변경 함수 (로컬 스토리지에 저장)
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // 클라이언트에서만 localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      // HTML lang 속성 업데이트
      document.documentElement.lang = lang;
    }
  }, []);

  // 번역 함수 - language와 isInitialized가 변경될 때만 새로 생성
  const t = useCallback(
    (key: string): string => {
      // 초기화되지 않았거나 언어가 설정되지 않은 경우 기본값 반환
      if (!isInitialized || !language) {
        return translations['ko'][key] || key;
      }
      return translations[language][key] || key;
    },
    [language, isInitialized]
  );

  // 언어 변경 시 HTML lang 속성 업데이트
  useEffect(() => {
    if (typeof document !== 'undefined' && isInitialized) {
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  // Context value를 메모이제이션하여 불필요한 리렌더링 방지
  // 하지만 language가 변경되면 새로운 value 객체가 생성되어 구독자들이 리렌더링됨
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t] // language나 t가 변경되면 새로운 value 생성
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// 언어 컨텍스트 사용 훅
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
