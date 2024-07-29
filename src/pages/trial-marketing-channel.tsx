import { MarketingChannelForm } from '@/components/onboarding/marketing-channel';
import { useTranslation } from 'react-i18next';
import { FaRegCheckCircle } from 'react-icons/fa';

export default function TrialMarketingChannel() {
  const [t] = useTranslation('trial');
  return (
    <div className="max-w-[440px] mx-auto">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <FaRegCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
        <h1 className="font-bold text-2xl sm:text-3xl">{t('trial_booking_confirmed')}</h1>
      </div>
      <MarketingChannelForm />
    </div>
  );
}
