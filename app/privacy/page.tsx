import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '개인정보처리방침 | 무료 이미지 변환기',
  description: '무료 이미지 변환기 서비스 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
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
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>
            개인정보처리방침
          </h1>
          <p className='text-sm text-gray-500'>
            최종 수정일: {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* 개인정보처리방침 내용 */}
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          <div className='prose prose-sm max-w-none'>
            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                1. 개인정보의 처리 목적
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                무료 이미지 변환기 서비스(이하 "서비스")는 다음의 목적을 위하여
                개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
                이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
                개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한
                조치를 이행할 예정입니다.
              </p>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  <strong>서비스 제공:</strong> 파일 변환, 편집, 압축 등 서비스
                  기능 제공
                </li>
                <li>
                  <strong>서비스 개선:</strong> 서비스 이용 통계 분석 및
                  품질 개선
                </li>
                <li>
                  <strong>고객 지원:</strong> 문의사항 처리 및 고객 지원 서비스
                  제공
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                2. 개인정보의 처리 및 보유기간
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                  개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                  개인정보를 처리·보유합니다.
                </li>
                <li>
                  업로드된 파일은 처리 완료 후 즉시 삭제되며, 개인정보는 서비스
                  이용 목적 달성 후 지체 없이 파기합니다.
                </li>
                <li>
                  다만, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안
                  보관합니다:
                  <ul className='ml-6 mt-2 list-disc list-inside space-y-1'>
                    <li>
                      전자상거래 등에서의 소비자 보호에 관한 법률: 계약 또는
                      청약철회 등에 관한 기록 (5년)
                    </li>
                    <li>
                      통신비밀보호법: 로그 기록 (3개월)
                    </li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                3. 처리하는 개인정보의 항목
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 다음의 개인정보 항목을 처리하고 있습니다:
              </p>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  <strong>자동 수집 정보:</strong> IP 주소, 쿠키, 접속 로그,
                  기기 정보, 브라우저 정보
                </li>
                <li>
                  <strong>서비스 이용 정보:</strong> 업로드한 파일 정보 (파일명,
                  크기, 형식 등)
                </li>
                <li>
                  <strong>기타:</strong> 서비스 이용 과정에서 자동으로 생성되어
                  수집되는 정보
                </li>
              </ul>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                <strong>※</strong> 서비스는 회원가입을 요구하지 않으며, 최소한의
                정보만 수집합니다.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                4. 개인정보의 제3자 제공
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>정보주체가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                5. 개인정보처리의 위탁
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
                처리업무를 위탁하고 있습니다:
              </p>
              <div className='mb-4 overflow-x-auto'>
                <table className='min-w-full border border-gray-300'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='border border-gray-300 px-4 py-2 text-left text-sm font-semibold'>
                        위탁업체
                      </th>
                      <th className='border border-gray-300 px-4 py-2 text-left text-sm font-semibold'>
                        위탁업무 내용
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border border-gray-300 px-4 py-2 text-sm text-gray-700'>
                        클라우드 서비스 제공업체
                      </td>
                      <td className='border border-gray-300 px-4 py-2 text-sm text-gray-700'>
                        서비스 인프라 제공 및 데이터 저장
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                6. 정보주체의 권리·의무 및 그 행사방법
              </h2>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  정보주체는 서비스에 대해 언제든지 다음 각 호의 개인정보 보호
                  관련 권리를 행사할 수 있습니다:
                  <ul className='ml-6 mt-2 list-disc list-inside space-y-1'>
                    <li>개인정보 처리정지 요구권</li>
                    <li>개인정보 열람요구권</li>
                    <li>개인정보 정정·삭제요구권</li>
                    <li>개인정보 처리정지 요구권</li>
                  </ul>
                </li>
                <li>
                  제1항에 따른 권리 행사는 서비스에 대해 서면, 전자우편 등을
                  통하여 하실 수 있으며, 서비스는 이에 대해 지체 없이
                  조치하겠습니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                7. 개인정보의 파기
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  <strong>파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후
                  별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타
                  관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                </li>
                <li>
                  <strong>파기방법:</strong>
                  <ul className='ml-6 mt-2 list-disc list-inside space-y-1'>
                    <li>전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
                    <li>업로드된 파일: 처리 완료 후 즉시 서버에서 삭제</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                8. 개인정보 보호책임자
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을
                위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className='mb-4 rounded-lg bg-gray-50 p-4'>
                <p className='mb-2 text-gray-700'>
                  <strong>개인정보 보호책임자</strong>
                </p>
                <p className='text-sm text-gray-600'>
                  이메일: privacy@yourdomain.com
                </p>
                <p className='text-sm text-gray-600'>
                  ※ 개인정보 보호 담당부서로 연결됩니다.
                </p>
              </div>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                9. 개인정보의 안전성 확보 조치
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를
                취하고 있습니다:
              </p>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  <strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적
                  직원 교육 등
                </li>
                <li>
                  <strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한
                  관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치
                </li>
                <li>
                  <strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                10. 쿠키의 운영 및 거부
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                서비스는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키를
                사용할 수 있습니다. 쿠키는 웹사이트를 운영하는데 이용되는
                서버가 이용자의 컴퓨터 브라우저에 보내는 소량의 정보이며
                이용자의 PC 하드디스크에 저장되기도 합니다.
              </p>
              <ul className='mb-4 list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
                <li>
                  쿠키의 사용 목적: 이용자의 접속 빈도나 방문 시간 등을 분석하여
                  서비스 개선에 활용
                </li>
                <li>
                  쿠키의 설치·운영 및 거부: 이용자는 쿠키 설치에 대한 선택권을
                  가지고 있으며, 브라우저 설정을 통해 쿠키 허용, 쿠키 차단 등의
                  설정을 할 수 있습니다.
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                11. 개인정보 처리방침 변경
              </h2>
              <p className='mb-4 text-gray-700 leading-relaxed'>
                이 개인정보처리방침은 {new Date().toLocaleDateString('ko-KR')}부터
                적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이
                있는 경우에는 변경사항의 시행 7일 전부터 서비스 화면을 통하여
                공지할 것입니다.
              </p>
            </section>
          </div>
        </div>

        {/* 관련 링크 */}
        <div className='mt-8 flex justify-center gap-4'>
          <Link
            href='/terms'
            className='text-sm text-primary hover:underline'
          >
            이용약관
          </Link>
          <span className='text-gray-300'>|</span>
          <Link href='/' className='text-sm text-gray-600 hover:underline'>
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

