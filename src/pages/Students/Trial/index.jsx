import { useState } from 'react';
import OnboardingTrial from './OnboardingTrial';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import LessonDetails from './LessonDetails';
import StepIndicator from './StepIndicator';
import SelectDay from './SelectDay';
import AvailableSpots from './AvailableSpots';
import Confirmation from './Confirmation';

const Trial = () => {
  const [step, setStep] = useState(0);

  return (
    <OnboardingLayout>
      <main className="w-full mx-auto px-5 mt-6 sm:mt-10">
        {step > 0 && <StepIndicator step={step} />}
        {step === 0 && <OnboardingTrial setStep={setStep} />}
        {step === 1 && <LessonDetails setStep={setStep} />}
        {step === 2 && <SelectDay setStep={setStep} />}
        {step === 3 && <AvailableSpots setStep={setStep} />}
        {step === 4 && <Confirmation setStep={setStep} />}
      </main>
    </OnboardingLayout>
  );
};

export default Trial;
