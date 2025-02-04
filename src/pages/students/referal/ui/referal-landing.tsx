import FormCard from '@/pages/students/referal/ui/form-card';
import ReferalFooter from '@/pages/students/referal/ui/referal-footer';
import ReferalHeader from '@/pages/students/referal/ui/referal-header';
import ReferalIntro from '@/pages/students/referal/ui/referal-intro';
import Reviews from '@/pages/students/referal/ui/reviews';
import WhyNaoNow from '@/pages/students/referal/ui/why-naonow';
import { buttonizeA11Y } from '@/shared/utils/buttonizeA11Y';
import type { Student } from '@/types/types.generated';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import { APP_CONFIG } from "src/shared/apollo/queries/appConfig";
// import { useQuery } from "@apollo/client";
// import ReactLoader from "src/components/common/Loader";
// import notify from "src/shared/utils/notify";

const ReferalLanding = ({ student }: { student: Student }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [t] = useTranslation(['refer', 'common']);

  const onBannerClick = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  };

  // const { loading, error, data } = useQuery(APP_CONFIG, {
  // 	fetchPolicy: "no-cache",
  // });

  // const discount = useMemo(() => {
  // 	if (data) {
  // 		return data?.appConfigs.find(
  // 			(config) => config.configName === "referralLinkDiscountPercentage",
  // 		)?.configValue;
  // 	}
  // }, [data]);

  // console.log("discount", discount);

  // if (error) {
  // 	notify(error.message, "error");
  // 	return <div className="w-full h-full" />;
  // }

  // if (loading) {
  // 	return (
  // 		<div className="w-full h-full">
  // 			<ReactLoader />
  // 		</div>
  // 	);
  // }

  return (
    <section className="break-keep">
      <ReferalHeader />

      <div
        {...buttonizeA11Y(onBannerClick)}
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
