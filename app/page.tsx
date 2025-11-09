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
          <h1 className='mb-6 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl'>
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
            <Link
              href='/convert'
              className='rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50'
            >
              {t('home.hero.cta.viewAll')}
            </Link>
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
        <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center text-white'>
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
        <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center text-white'>
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
    </div>
  );
}
