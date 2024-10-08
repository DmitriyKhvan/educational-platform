import { useTranslation } from 'react-i18next';
import { BiSolidUserVoice } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa6';
import { IoGameController } from 'react-icons/io5';
import { MdInsertChart } from 'react-icons/md';

function WhyNaoNow() {
  const [t] = useTranslation('refer');

  return (
    <section className="text-center">
      <h2 className="font-bold text-[36px] md:text-[64px] mb-16">{t('why_nao_now')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex gap-10 px-5">
        <div className="flex flex-col items-center max-w-[360px] mx-auto">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <FaStar className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">{t('reason_title_1')}</p>
          <span>{t('reason_text_1')}</span>
        </div>
        <div className="flex flex-col items-center max-w-[360px] mx-auto">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <BiSolidUserVoice className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">{t('reason_title_2')}</p>
          <span>{t('reason_text_2')}</span>
        </div>
        <div className="flex flex-col items-center max-w-[360px] mx-auto">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <IoGameController className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">{t('reason_title_3')}</p>
          <span>{t('reason_text_3')}</span>
        </div>
        <div className="flex flex-col items-center max-w-[360px] mx-auto">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <MdInsertChart className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">{t('reason_title_4')}</p>
          <span>{t('reason_text_4')}</span>
        </div>
      </div>
    </section>
  );
}

export default WhyNaoNow;
