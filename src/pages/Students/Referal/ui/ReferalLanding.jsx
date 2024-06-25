import { useRef } from 'react';
import FormCard from './FormCard';
import ReferalIntro from './ReferalIntro';
import Reviews from './Reviews';
import WhyNaoNow from './WhyNaoNow';
import { useTranslation } from 'react-i18next';
import ReferalHeader from './ReferalHeader';
import ReferalFooter from './ReferalFooter';

const ReferalLanding = ({ student }) => {
  const inputRef = useRef();
  const formRef = useRef();

  const [t] = useTranslation(['refer', 'common']);

  const onBannerClick = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  };

  return (
      <section className="break-keep">
        <ReferalHeader />

        <div
          onClick={onBannerClick}
          className="mb-10 flex gap-3 items-center bg-[#00D986] hover:bg-opacity-80 hover:cursor-pointer transition-colors min-h-16 p-3 rounded-none mx-0 xl:mb-16"
        >
          <div className="flex items-center w-full justify-between sm:justify-center sm:gap-3">
            <span className="block text-xl">🎁</span>
            <div className="sm:flex sm:gap-2">
              <p className="font-semibold text-sm">{t('claim_your_offer')}</p>
              <p className="text-sm">{t('get_trial_and_discount')}</p>
            </div>
            <span className="block text-xl">🎁</span>
          </div>
        </div>

        <main className="max-w-[1280px] mx-auto space-y-28 mb-16">
          <div className="w-full flex flex-col items-center xl:flex-row justify-between xl:items-start">
            <ReferalIntro student={student} />

            <FormCard inputRef={inputRef} formRef={formRef} />
          </div>

          <WhyNaoNow />

          <Reviews />
        </main>

        <ReferalFooter />
      </section>
  );
};

export default ReferalLanding;
