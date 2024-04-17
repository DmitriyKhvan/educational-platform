import React from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import { MarketingChannelForm } from 'src/components/onboarding/MarketingChannel';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

export default function TrialMarketingChannel() {
  return (
    <OnboardingLayout>
      <main className="px-5 py-6 sm:pt-10">
        <div className="max-w-[440px] mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <FaRegCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
            <h1 className="font-bold text-2xl sm:text-3xl">
              Trial booking confirmed
            </h1>
          </div>
          <MarketingChannelForm />
        </div>
      </main>
    </OnboardingLayout>
  );
}
