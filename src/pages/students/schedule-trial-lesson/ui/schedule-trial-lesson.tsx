import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { LESSON_QUERY } from '@/shared/apollo/graphql';

import ScheduleSuccess from '@/pages/students/schedule-lesson/schedule-success';

import { ScheduleSelector } from '@/pages/students/schedule-lesson/schedule-selector';
import { ScheduleProvider } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';
import { AvailableTimes } from '@/pages/students/schedule-lesson/schedule-selector/available-times';
import { COMBINED_TIMESHEETS_TRIAL } from '@/shared/apollo/queries/trial/combined-time-sheets-for-trials';
import type { Lesson, Mentor, PackageSubscription } from '@/types/types.generated';
import TrialLessonConfirmation from './trial-lesson-confirmation';
import SelectTrialLesson from './select-trial-lesson';

const ScheduleTrialLesson = () => {
  const { id = null } = useParams();
  const location = useLocation();

  const { data, loading } = useQuery(LESSON_QUERY, {
    variables: { id },
    skip: !id,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const repeatLessons = urlParams.get('repeatLessons');

  const [repeat, setRepeat] = useState<number | boolean | null>(
    repeatLessons ? JSON.parse(repeatLessons) : null,
  );

  const [selectedPlan, setSelectedPlan] = useState<PackageSubscription>();
  const [schedule, setSchedule] = useState<string>('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectMentor, setSelectMentor] = useState<Mentor>();
  const [createdLessons, setCreatedLessons] = useState<Lesson[]>();

  const scheduledLesson = data?.lesson || null;

  useEffect(() => {
    if (data?.lesson) {
      setSelectedPlan(data?.lesson?.packageSubscription);
    }
  }, [data?.lesson]);

  if (loading) return null;

  return (
    <>
      {tabIndex === 0 && (
        <SelectTrialLesson setSelectedPlan={setSelectedPlan} setTabIndex={setTabIndex} />
      )}

      {(tabIndex === 1 || tabIndex === 2) && (
        <ScheduleProvider
          query={COMBINED_TIMESHEETS_TRIAL}
          setTabIndex={setTabIndex}
          setSchedule={setSchedule}
          duration={selectedPlan?.package?.sessionTime ?? 0}
          selectedMentor={location?.state?.mentor}
          setSelectMentor={setSelectMentor}
        >
          {tabIndex === 1 && <ScheduleSelector lesson={scheduledLesson} />}

          {tabIndex === 2 && <AvailableTimes />}
        </ScheduleProvider>
      )}

      {tabIndex === 3 && (
        <TrialLessonConfirmation
          plan={selectedPlan}
          time={schedule}
          mentor={selectMentor || location?.state?.mentor}
          isMentorScheduled={!!location?.state?.mentor}
          setTabIndex={setTabIndex}
          lessonId={id}
          setCreatedLessons={setCreatedLessons}
          setRepeat={setRepeat}
          repeat={repeat}
        />
      )}

      {tabIndex === 4 && createdLessons && <ScheduleSuccess lessons={createdLessons} />}
    </>
  );
};

export default ScheduleTrialLesson;
