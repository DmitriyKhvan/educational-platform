import { useState, useEffect } from 'react';
import OnboardingTrial from './OnboardingTrial';
import LessonDetails from './LessonDetails';
import StepIndicator from './StepIndicator';
import Confirmation from './Confirmation';
import { ScheduleProvider } from 'src/pages/Students/ScheduleLesson/ScheduleSelector/ScheduleProvider';
import { ScheduleSelector } from 'src/pages/Students/ScheduleLesson/ScheduleSelector';
import { AvailableTimes } from 'src/pages/Students/ScheduleLesson/ScheduleSelector/AvailableTimes';
import { COMBINED_TIMESHEETS_TRIAL } from 'src/shared/apollo/queries/trial/combinedTimesheetsForTrials';

import { useAuth } from 'src/app/providers/AuthProvider';

const Trial = () => {
  const { user: currentUser } = useAuth();

  const [step, setStep] = useState(-1);
  const [user, setUser] = useState({});
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState('');
  const [selectMentor, setSelectMentor] = useState('');
  useEffect(() => {
    if (currentUser) {
      const { phoneNumber, email, timeZone } = currentUser;

      setUser({
        phoneNumber,
        email,
        timeZone,
      });
    }
  }, [currentUser]);

  return (
    <div className="max-w-[440px] mx-auto">
      {step > -1 && step < 4 && <StepIndicator step={step} />}
      {step === -1 && (
        <OnboardingTrial
          currentUser={currentUser}
          user={user}
          selectedPlan={selectedPlan}
          setUser={setUser}
          setStep={setStep}
          setSelectMentor={setSelectMentor}
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
        selectedMentor={selectMentor}
        setSelectMentor={setSelectMentor}
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
          mentorId={selectMentor.id}
        />
      )}
    </div>
  );
};

export default Trial;
