import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '이용약관 | 무료 이미지 변환기',
  description: '무료 이미지 변환기 서비스 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* 뒤로가기 버튼 */}
        <Link
          href='/'
          className='mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>홈으로 돌아가기</span>
        </Link>

        {/* 제목 */}
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>이용약관</h1>
          <p className='text-sm text-gray-500'>
            최종 수정일: {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* 약관 내용 */}
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          <div className='prose prose-sm max-w-none'>
            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제1조 (목적)
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                본 약관은 무료 이미지 변환기 서비스(이하 "서비스")의 이용과
                관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을
                규정함을 목적으로 합니다.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제2조 (정의)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  "서비스"란 이미지 및 문서 파일의 변환, 편집, 압축 등의 기능을
                  제공하는 온라인 플랫폼을 의미합니다.
                </li>
                <li>
                  "이용자"란 본 약관에 동의하고 서비스를 이용하는 모든
                  개인 또는 법인을 의미합니다.
                </li>
                <li>
                  "콘텐츠"란 이용자가 서비스를 통해 업로드, 변환, 생성한 모든
                  파일 및 데이터를 의미합니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제3조 (약관의 효력 및 변경)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
                  공지함으로써 효력을 발생합니다.
                </li>
                <li>
                  서비스 제공자는 필요한 경우 관련 법령을 위배하지 않는 범위
                  내에서 본 약관을 변경할 수 있습니다.
                </li>
                <li>
                  약관이 변경되는 경우 변경 사항의 시행일 7일 전부터 서비스
                  화면에 공지하거나 이메일 등으로 이용자에게 통지합니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제4조 (서비스의 제공 및 변경)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  서비스 제공자는 다음과 같은 서비스를 제공합니다:
                  <ul className='ml-6 mt-2 list-disc list-inside space-y-1'>
                    <li>이미지 파일 변환 (JPG, PNG, PDF 등)</li>
                    <li>문서 파일 변환 (Word, Excel, PPT, PDF 등)</li>
                    <li>PDF 편집 및 압축</li>
                    <li>기타 파일 처리 관련 기능</li>
                  </ul>
                </li>
                <li>
                  서비스 제공자는 운영상, 기술상의 필요에 따라 제공하는
                  서비스의 내용을 변경할 수 있습니다.
                </li>
                <li>
                  서비스 제공자는 서비스의 제공을 위해 필요한 경우 정기 점검을
                  실시할 수 있으며, 이 경우 사전에 공지합니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제5조 (이용자의 의무)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  이용자는 다음 행위를 하여서는 안 됩니다:
                  <ul className='ml-6 mt-2 list-disc list-inside space-y-1'>
                    <li>법령 또는 본 약관에 위반되는 행위</li>
                    <li>서비스의 안정적 운영을 방해하는 행위</li>
                    <li>타인의 지적재산권을 침해하는 행위</li>
                    <li>악성 코드를 업로드하거나 서비스를 악용하는 행위</li>
                    <li>서비스를 상업적 목적으로 무단 사용하는 행위</li>
                  </ul>
                </li>
                <li>
                  이용자는 자신의 책임 하에 서비스를 이용해야 하며, 이용자의
                  귀책사유로 인한 손해에 대해 서비스 제공자는 책임을 지지
                  않습니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제6조 (개인정보 보호)
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스 제공자는 이용자의 개인정보를 보호하기 위해 개인정보
                처리방침을 수립하고 이를 준수합니다. 개인정보 처리방침은
                서비스 화면에 게시되며, 이용자는 언제든지 확인할 수 있습니다.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제7조 (서비스 이용의 제한)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  서비스 제공자는 이용자가 본 약관을 위반하거나 서비스의 정상적
                  운영을 방해하는 경우, 사전 통지 없이 서비스 이용을 제한하거나
                  중지할 수 있습니다.
                </li>
                <li>
                  서비스 제공자는 다음 각 호에 해당하는 경우 서비스 제공을
                  중단할 수 있습니다:
                  <ul className='ml-6 mt-2 list-disc list-inside space-y-1'>
                    <li>천재지변, 전쟁, 폭동 등 불가항력적 사유</li>
                    <li>서비스 설비의 보수점검, 교체 등 기술상 필요</li>
                    <li>기타 서비스 제공자가 필요하다고 인정하는 사유</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제8조 (면책조항)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  서비스 제공자는 천재지변 또는 이에 준하는 불가항력으로 인하여
                  서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
                  면제됩니다.
                </li>
                <li>
                  서비스 제공자는 이용자의 귀책사유로 인한 서비스 이용의 장애에
                  대하여는 책임을 지지 않습니다.
                </li>
                <li>
                  서비스 제공자는 이용자가 서비스를 이용하여 기대하는 수익을
                  상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를
                  통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                제9조 (분쟁의 해결)
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  서비스 제공자와 이용자 간에 발생한 분쟁에 관한 소송은
                  서비스 제공자의 본사 소재지를 관할하는 법원에 제기합니다.
                </li>
                <li>
                  서비스 제공자와 이용자 간에 제기된 소송에는 대한민국 법을
                  적용합니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                부칙
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                본 약관은 {new Date().toLocaleDateString('ko-KR')}부터
                시행됩니다.
              </p>
            </section>
          </div>
        </div>

        {/* 문의 링크 */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-600'>
            약관에 대한 문의사항이 있으시면{' '}
            <Link href='/privacy' className='text-primary hover:underline'>
              개인정보처리방침
            </Link>
            을 참고하시거나 고객센터로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

