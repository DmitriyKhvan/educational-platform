import { useState } from 'react';
import OnboardingTrial from './OnboardingTrial';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import LessonDetails from './LessonDetails';
import StepIndicator from './StepIndicator';
import SelectDay from './SelectDay';
import AvailableSpots from './AvailableSpots';
import Confirmation from './Confirmation';
import { ScheduleProvider } from '../ScheduleLesson/ScheduleSelector/ScheduleProvider';
// import { ScheduleSelector } from '../ScheduleLesson/ScheduleSelector';
// import { AvailableTimes } from '../ScheduleLesson/ScheduleSelector/AvailableTimes';

const Trial = () => {
  const [step, setStep] = useState(0);
  // const [selectedPlan, setSelectedPlan] = useState({});
  // const [schedule, setSchedule] = useState();

  return (
    <OnboardingLayout>
      <main className="w-full mx-auto px-5 mt-6 sm:mt-10">
        {step > 0 && <StepIndicator step={step} />}
        {step === 0 && <OnboardingTrial setStep={setStep} />}
        {step === 1 && <LessonDetails setStep={setStep} />}

        <ScheduleProvider
          setTabIndex={setStep}
          setSchedule={() => {}}
          // selectedMentor={location?.state?.tutor}
          duration={25}
        >
          {step === 2 && <SelectDay setStep={setStep} />}

          {step === 3 && <AvailableSpots setStep={setStep} />}
        </ScheduleProvider>
        {/* {step === 2 && <SelectDay setStep={setStep} />}
        {step === 3 && <AvailableSpots setStep={setStep} />} */}
        {step === 4 && <Confirmation setStep={setStep} />}
      </main>
    </OnboardingLayout>
  );
};

export default Trial;
