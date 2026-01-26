'use client';

import Link from 'next/link';
import {
  FileText,
  Image as ImageIcon,
  PenTool,
  FileCheck,
  Archive,
  Merge,
  Edit,
  Signature,
  ArrowRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  Globe,
  Smartphone,
  Star,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();

  // 가장 인기있는 PDF 도구들
  const popularTools = [
    {
      name: t('home.popular.tool.pdfToWord.name'),
      description: t('home.popular.tool.pdfToWord.description'),
      href: '/pdf-to-word',
      icon: FileText,
    },
    {
      name: t('home.popular.tool.merge.name'),
      description: t('home.popular.tool.merge.description'),
      href: '/merge',
      icon: Merge,
    },
    {
      name: t('home.popular.tool.jpgToPdf.name'),
      description: t('home.popular.tool.jpgToPdf.description'),
      href: '/jpg-to-pdf',
      icon: ImageIcon,
    },
    {
      name: t('home.popular.tool.sign.name'),
      description: t('home.popular.tool.sign.description'),
      href: '/sign',
      icon: Signature,
    },
    {
      name: t('home.popular.tool.edit.name'),
      description: t('home.popular.tool.edit.description'),
      href: '/edit',
      icon: Edit,
    },
    {
      name: t('home.popular.tool.compress.name'),
      description: t('home.popular.tool.compress.description'),
      href: '/compress',
      icon: Archive,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {/* Hero Section */}
      <section className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='max-w-3xl mx-auto mb-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl leading-tight'>
            {t('home.hero.title')}
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-600'>
            {t('home.hero.description')}
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              href='/convert'
              className='rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700'
            >
              {t('home.hero.cta.start')}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Keywords Section */}
      <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='mb-6 text-3xl font-bold text-gray-900 sr-only'>
            {t('home.relatedKeywords.title')}
          </h2>
          <div className='flex flex-wrap justify-center gap-4'>
            {[
              t('home.relatedKeywords.keyword1'),
              t('home.relatedKeywords.keyword2'),
              t('home.relatedKeywords.keyword3'),
            ].map((keyword: string, index: number) => (
              <span
                key={index}
                className='rounded-full bg-blue-100 px-6 py-2 text-lg font-medium text-gray-900 transition-colors hover:bg-blue-200'
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            {t('home.popular.title')}
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            {t('home.popular.description')}
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {popularTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                href={tool.href}
                className='group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
              >
                <div className='mb-4 flex items-center gap-4'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {tool.name}
                  </h3>
                </div>
                <p className='mb-4 text-gray-600'>{tool.description}</p>
                <div className='flex items-center text-primary group-hover:text-blue-700'>
                  <span className='text-sm font-medium'>
                    {t('home.popular.tryIt')}
                  </span>
                  <ArrowRight className='ml-2 h-4 w-4' />
                </div>
              </Link>
            );
          })}
        </div>

        <div className='mt-8 text-center'>
          <Link
            href='/convert'
            className='inline-flex items-center gap-2 text-primary hover:text-blue-700'
          >
            <span className='font-medium'>{t('home.popular.viewAll')}</span>
            <ArrowRight className='h-5 w-5' />
          </Link>
        </div>
      </section>

      {/* Simple Tasks Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='rounded-2xl bg-primary p-12 text-center text-white'>
          <h2 className='mb-4 text-3xl font-bold'>{t('home.simple.title')}</h2>
          <p className='mx-auto max-w-3xl text-lg text-blue-50'>
            {t('home.simple.description')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid gap-8 md:grid-cols-2'>
          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <PenTool className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>
                {t('home.feature.workWithFiles.title')}
              </h3>
            </div>
            <p className='mb-6 text-gray-600'>
              {t('home.feature.workWithFiles.description')}
            </p>
            <Link
              href='/edit'
              className='inline-flex items-center gap-2 text-primary hover:text-blue-700'
            >
              <span className='font-medium'>
                {t('home.feature.workWithFiles.cta')}
              </span>
              <ArrowRight className='h-5 w-5' />
            </Link>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <Signature className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>
                {t('home.feature.digitalSignature.title')}
              </h3>
            </div>
            <p className='mb-6 text-gray-600'>
              {t('home.feature.digitalSignature.description')}
            </p>
            <Link
              href='/sign'
              className='inline-flex items-center gap-2 text-primary hover:text-blue-700'
            >
              <span className='font-medium'>
                {t('home.feature.digitalSignature.cta')}
              </span>
              <ArrowRight className='h-5 w-5' />
            </Link>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <FileCheck className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>
                {t('home.feature.perfectDocument.title')}
              </h3>
            </div>
            <p className='mb-6 text-gray-600'>
              {t('home.feature.perfectDocument.description')}
            </p>
            <Link
              href='/convert'
              className='inline-flex items-center gap-2 text-primary hover:text-blue-700'
            >
              <span className='font-medium'>
                {t('home.feature.perfectDocument.cta')}
              </span>
              <ArrowRight className='h-5 w-5' />
            </Link>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-3'>
                <Globe className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>
                {t('home.feature.allInOne.title')}
              </h3>
            </div>
            <p className='mb-6 text-gray-600'>
              {t('home.feature.allInOne.description')}
            </p>
            <Link
              href='/convert'
              className='inline-flex items-center gap-2 text-primary hover:text-blue-700'
            >
              <span className='font-medium'>
                {t('home.feature.allInOne.cta')}
              </span>
              <ArrowRight className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-gray-200 bg-white p-12 text-center'>
          <Smartphone className='mx-auto mb-6 h-16 w-16 text-primary' />
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            {t('home.mobile.title')}
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
            {t('home.mobile.description')}
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <button className='rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50'>
              {t('home.mobile.googlePlay')}
            </button>
            <button className='rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50'>
              {t('home.mobile.appStore')}
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            {t('home.whyChoose.title')}
          </h2>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Users className='h-6 w-6 text-primary' />
              <h3 className='text-xl font-bold text-gray-900'>
                {t('home.whyChoose.trustedByUsers.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('home.whyChoose.trustedByUsers.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Star className='h-6 w-6 text-primary' />
              <h3 className='text-xl font-bold text-gray-900'>
                {t('home.whyChoose.trustedByBusiness.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('home.whyChoose.trustedByBusiness.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <CheckCircle2 className='h-6 w-6 text-primary' />
              <h3 className='text-xl font-bold text-gray-900'>
                {t('home.whyChoose.trustedByPartners.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('home.whyChoose.trustedByPartners.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Zap className='h-6 w-6 text-primary' />
              <h3 className='text-xl font-bold text-gray-900'>
                {t('home.whyChoose.support.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('home.whyChoose.support.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Lock className='h-6 w-6 text-primary' />
              <h3 className='text-xl font-bold text-gray-900'>
                {t('home.whyChoose.encryption.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('home.whyChoose.encryption.description')}
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Shield className='h-6 w-6 text-primary' />
              <h3 className='text-xl font-bold text-gray-900'>
                {t('home.whyChoose.security.title')}
              </h3>
            </div>
            <p className='text-gray-600'>
              {t('home.whyChoose.security.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Trial Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='rounded-2xl bg-primary p-12 text-center text-white'>
          <h2 className='mb-4 text-3xl font-bold'>{t('home.trial.title')}</h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-blue-50'>
            {t('home.trial.description')}
          </p>
          <Link
            href='/convert'
            className='inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-blue-50'
          >
            {t('home.trial.cta')}
          </Link>
        </div>
      </section>

      {/* 사용 가이드 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            파일 변환 사용 가이드
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            freeconvert를 처음 사용하시나요? 간단한 단계별 가이드를 통해
            빠르게 시작할 수 있습니다.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-primary'>
              1
            </div>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              파일 선택
            </h3>
            <p className='text-gray-600'>
              변환하고 싶은 파일을 업로드하거나 드래그 앤 드롭으로 추가합니다.
              PDF, Word, Excel, PowerPoint, 이미지 등 다양한 형식을 지원합니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-primary'>
              2
            </div>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              형식 선택
            </h3>
            <p className='text-gray-600'>
              원하는 출력 형식을 선택합니다. PDF로 변환하거나, PDF를 다른
              형식으로 변환할 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-primary'>
              3
            </div>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              변환 및 다운로드
            </h3>
            <p className='text-gray-600'>
              변환 버튼을 클릭하면 몇 초 내에 변환이 완료됩니다. 완료된 파일을
              바로 다운로드할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-gray-50'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            자주 묻는 질문
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            파일 변환에 대한 궁금한 점들을 확인해보세요.
          </p>
        </div>

        <div className='mx-auto max-w-4xl space-y-6'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              서비스는 정말 무료인가요?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              네, freeconvert의 모든 기본 기능은 완전히 무료로 제공됩니다.
              회원가입이나 신용카드 정보 입력 없이 바로 사용할 수 있습니다.
              파일 크기 제한도 없어 대용량 파일도 변환할 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              업로드한 파일은 어떻게 되나요?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              업로드된 모든 파일은 변환 완료 후 즉시 서버에서 자동으로
              삭제됩니다. 개인정보와 파일 보안을 최우선으로 생각하며, 어떤
              파일도 저장하거나 제3자에게 공유하지 않습니다. 모든 파일 전송은
              최신 TLS 암호화로 보호됩니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              어떤 파일 형식을 지원하나요?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              PDF, Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX),
              이미지 (JPG, PNG, GIF, BMP, TIFF, WEBP) 등 다양한 형식을
              지원합니다. PDF로 변환하거나 PDF를 다른 형식으로 변환할 수 있으며,
              이미지 형식 간 변환도 가능합니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              변환 품질은 어떤가요?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              고품질 변환 엔진을 사용하여 원본 파일의 레이아웃, 폰트, 이미지
              등을 최대한 보존합니다. 특히 PDF에서 Word나 Excel로 변환할 때
              표와 이미지가 정확하게 유지되며, 편집 가능한 형태로 변환됩니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              모바일에서도 사용할 수 있나요?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              네, freeconvert는 반응형 웹 디자인으로 제작되어 스마트폰, 태블릿,
              데스크톱 등 모든 기기에서 사용할 수 있습니다. 별도의 앱 설치 없이
              브라우저만 있으면 언제 어디서나 파일을 변환할 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-xl font-bold text-gray-900'>
              변환에 시간이 얼마나 걸리나요?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              파일 크기와 형식에 따라 다르지만, 일반적으로 작은 파일은 몇 초
              내에, 큰 파일도 1-2분 이내에 변환이 완료됩니다. 클라우드 기반
              고성능 서버를 사용하여 빠른 변환 속도를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 서비스 특징 상세 설명 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            왜 freeconvert를 선택해야 할까요?
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            수백만 명의 사용자가 신뢰하는 이유를 확인해보세요.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <h3 className='mb-4 text-2xl font-bold text-gray-900'>
              완전 무료 서비스
            </h3>
            <p className='mb-4 text-gray-600 leading-relaxed'>
              freeconvert는 모든 사용자에게 무료로 제공되는 서비스입니다.
              숨겨진 비용이나 구독료가 없으며, 워터마크나 광고도 추가하지
              않습니다. 필요한 모든 기능을 제한 없이 사용할 수 있습니다.
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-600'>
              <li>회원가입 불필요</li>
              <li>파일 크기 제한 없음</li>
              <li>일일 변환 횟수 제한 없음</li>
              <li>워터마크 없는 깔끔한 결과물</li>
            </ul>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <h3 className='mb-4 text-2xl font-bold text-gray-900'>
              최고 수준의 보안
            </h3>
            <p className='mb-4 text-gray-600 leading-relaxed'>
              사용자의 개인정보와 파일 보안을 최우선으로 생각합니다. 모든 파일
              전송은 256비트 SSL 암호화로 보호되며, 변환 완료 후 즉시 삭제됩니다.
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-600'>
              <li>TLS/SSL 암호화 통신</li>
              <li>자동 파일 삭제 시스템</li>
              <li>개인정보 보호 정책 준수</li>
              <li>정기적인 보안 감사</li>
            </ul>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <h3 className='mb-4 text-2xl font-bold text-gray-900'>
              다양한 파일 형식 지원
            </h3>
            <p className='mb-4 text-gray-600 leading-relaxed'>
              업무에서 자주 사용하는 거의 모든 파일 형식을 지원합니다. 문서,
              스프레드시트, 프레젠테이션, 이미지 등 다양한 형식 간 변환이
              가능합니다.
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-600'>
              <li>PDF, Word, Excel, PowerPoint</li>
              <li>JPG, PNG, GIF, BMP, TIFF, WEBP</li>
              <li>양방향 변환 지원</li>
              <li>배치 변환 가능</li>
            </ul>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-8'>
            <h3 className='mb-4 text-2xl font-bold text-gray-900'>
              빠르고 안정적인 서비스
            </h3>
            <p className='mb-4 text-gray-600 leading-relaxed'>
              클라우드 기반 고성능 서버를 사용하여 빠른 변환 속도를 제공합니다.
              서버 다운타임 없이 24시간 안정적으로 서비스를 이용할 수 있습니다.
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-600'>
              <li>초고속 변환 엔진</li>
              <li>99.9% 서비스 가동률</li>
              <li>대용량 파일 처리 가능</li>
              <li>실시간 변환 진행 상황 표시</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 사용 사례 섹션 */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            다양한 사용 사례
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600'>
            freeconvert는 다양한 상황에서 유용하게 사용됩니다.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-lg font-bold text-gray-900'>
              업무 문서 변환
            </h3>
            <p className='text-gray-600'>
              회사에서 사용하는 다양한 문서 형식을 PDF로 통일하거나, PDF 문서를
              편집 가능한 형식으로 변환하여 업무 효율을 높일 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-lg font-bold text-gray-900'>
              학술 자료 정리
            </h3>
            <p className='text-gray-600'>
              논문이나 연구 자료를 PDF로 변환하여 보관하거나, 스캔된 PDF를
              텍스트로 변환하여 편집할 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-lg font-bold text-gray-900'>
              이미지 포트폴리오
            </h3>
            <p className='text-gray-600'>
              여러 이미지를 하나의 PDF 파일로 합치거나, PDF에서 이미지를
              추출하여 포트폴리오를 만들 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-lg font-bold text-gray-900'>
              이메일 첨부 파일
            </h3>
            <p className='text-gray-600'>
              이메일로 전송하기 전에 파일을 PDF로 변환하여 호환성 문제를 해결하고,
              파일 크기를 줄일 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-lg font-bold text-gray-900'>
              모바일 호환성
            </h3>
            <p className='text-gray-600'>
              스마트폰에서 촬영한 이미지를 PDF로 변환하거나, 모바일에서 읽기
              쉬운 형식으로 변환할 수 있습니다.
            </p>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-3 text-lg font-bold text-gray-900'>
              아카이브 및 보관
            </h3>
            <p className='text-gray-600'>
              오래된 문서를 디지털화하거나, 다양한 형식의 파일을 PDF로 통일하여
              장기 보관할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
