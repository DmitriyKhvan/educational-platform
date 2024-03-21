import { useState } from 'react';
import OnboardingTrial from './OnboardingTrial';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import LessonDetails from './LessonDetails';
import StepIndicator from './StepIndicator';
import Confirmation from './Confirmation';
import { ScheduleProvider } from 'src/pages/Students/ScheduleLesson/ScheduleSelector/ScheduleProvider';
import { ScheduleSelector } from 'src/pages/Students/ScheduleLesson/ScheduleSelector';
import { AvailableTimes } from 'src/pages/Students/ScheduleLesson/ScheduleSelector/AvailableTimes';
import { COMBINED_TIMESHEETS_TRIAL } from 'src/modules/graphql/queries/trial/combinedTimesheetsForTrials';
import { MarketingChannelForm } from 'src/components/onboarding/MarketingChannel';
import { FaCheckCircle } from 'react-icons/fa';
// import { phoneCodes } from 'src/constants/global';

const Trial = () => {
  localStorage.removeItem('studentId');
  const [step, setStep] = useState(-1);
  const [user, setUser] = useState({});
  // const [country, setCountry] = useState(phoneCodes[4]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState('');
  const [mentorId, setMentorId] = useState('');

  console.log('schedule', schedule);

  console.log('selectedPlan', selectedPlan);

  console.log('mentorId', mentorId);

  console.log('user', user);

  return (
    <OnboardingLayout>
      <main className="px-5 py-6 sm:pt-10">
        <div className="max-w-[440px] mx-auto">
          {step > -1 && step < 4 && <StepIndicator step={step} />}
          {step === -1 && (
            <OnboardingTrial
              // country={country}
              // setCountry={setCountry}
              user={user}
              selectedPlan={selectedPlan}
              setUser={setUser}
              setStep={setStep}
            />
          )}
          {step === 0 && (
            <LessonDetails
              schedule={schedule}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              setStep={setStep}
            />
          )}

          <ScheduleProvider
            query={COMBINED_TIMESHEETS_TRIAL}
            setTabIndex={setStep}
            setSchedule={setSchedule}
            duration={selectedPlan?.packageSubscription?.sessionTime}
            setMentorId={setMentorId}
            timeZone={user?.timeZone}
          >
            {step === 1 && <ScheduleSelector />}

            {step === 2 && <AvailableTimes />}
          </ScheduleProvider>

          {step === 3 && (
            <Confirmation
              setStep={setStep}
              user={user}
              selectedPlan={selectedPlan}
              schedule={schedule}
              mentorId={mentorId}
            />
          )}

          {step === 4 && (
            <>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <FaCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
                <h1 className="font-bold text-2xl sm:text-3xl">
                  Trial booking confirmed
                </h1>
              </div>
              <MarketingChannelForm />
            </>
          )}
        </div>
      </main>
    </OnboardingLayout>
  );
};

export default Trial;
