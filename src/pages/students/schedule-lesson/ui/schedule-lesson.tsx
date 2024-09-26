import LessonConfirmation from '@/pages/students/schedule-lesson/lesson-confirmation';
import { ScheduleSelector } from '@/pages/students/schedule-lesson/schedule-selector';

import SelectMentorCards from '@/pages/students/schedule-lesson/select-mentor-cards';
import { LESSON_QUERY } from '@/shared/apollo/graphql';
import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import '@/app/styles/tutor.scss';
import { AvailableTimes } from '@/pages/students/schedule-lesson/schedule-selector/available-times';
import { ScheduleProvider } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';

import { useAuth } from '@/app/providers/auth-provider';
import ScheduleSuccess from '@/pages/students/schedule-lesson/schedule-success';
import { COMBINED_TIMESHEETS } from '@/shared/apollo/queries/combined-timesheets';
import { COMBINED_TIMESHEETS_TRIAL } from '@/shared/apollo/queries/trial/combined-time-sheets-for-trials';
import type {
  AvailabilitySlot,
  Lesson,
  Mentor,
  PackageSubscription,
  Query,
} from '@/types/types.generated';
import SelectLesson from '@/pages/students/schedule-lesson/ui/select-lesson';
import Mentors from '@/pages/students/mentors-list';
import { ScheduleDateTime } from './schedule-date-time/schedule-date-time';
import { useMediaQuery } from 'react-responsive';

const ScheduleLesson = () => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const { currentStudent } = useAuth();
  const { id = null } = useParams();
  const location = useLocation();

  const { data, loading } = useQuery<Query>(LESSON_QUERY, {
    variables: { id },
    skip: !id,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const repeatLessons = urlParams.get('repeatLessons');

  const [repeat, setRepeat] = useState<number | null>(() => {
    if (repeatLessons && !Number.isNaN(Number(repeatLessons))) {
      return Number(repeatLessons);
    }
    return null;
  });

  const [selectedPlan, setSelectedPlan] = useState<PackageSubscription>();
  const [schedule, setSchedule] = useState<AvailabilitySlot>();
  const [tabIndex, setTabIndex] = useState<number>(id ? 1 : 0);
  const [selectMentor, setSelectMentor] = useState<Mentor>();
  const [createdLessons, setCreatedLessons] = useState<Lesson[]>();

  const scheduledLesson = data?.lesson || null;

  console.log('selectedPlan', selectedPlan);
  console.log('tabIndex', tabIndex);
  console.log('location', location);

  useEffect(() => {
    if (location?.state?.mentor) {
      setTabIndex(1);
    }
  }, [location]);

  useEffect(() => {
    if (data?.lesson?.packageSubscription) {
      setSelectedPlan(data?.lesson?.packageSubscription);
    }
  }, [data?.lesson]);

  if (loading) return null;

  return (
    <>
      {tabIndex === 0 && <Mentors />}

      {tabIndex === 1 && (
        <SelectLesson setSelectedPlan={setSelectedPlan} setTabIndex={setTabIndex} />
      )}

      {tabIndex === 2 && isMobile && (
        <ScheduleDateTime
          mentor={location?.state?.mentor}
          setTabIndex={setTabIndex}
          setSchedule={setSchedule}
        />
      )}
      {tabIndex === 2 && !isMobile && <h2>Календарь</h2>}

      {/* {(tabIndex === 1 || tabIndex === 2) && (
        <ScheduleProvider
          query={currentStudent?.isTrial ? COMBINED_TIMESHEETS_TRIAL : COMBINED_TIMESHEETS}
          setTabIndex={setTabIndex}
          setSchedule={setSchedule}
          selectedMentor={location?.state?.mentor}
          setSelectMentor={currentStudent?.isTrial ? setSelectMentor : undefined}
          duration={selectedPlan?.package?.sessionTime ?? undefined}
        >
          {tabIndex === 1 && scheduledLesson && <ScheduleSelector lesson={scheduledLesson} />}

          {tabIndex === 2 && <AvailableTimes />}
        </ScheduleProvider>
      )}

      {tabIndex === 3 && !location?.state?.mentor && !currentStudent?.isTrial && (
        <SelectMentorCards
          setTabIndex={setTabIndex}
          setSelectMentor={setSelectMentor}
          schedule={schedule}
          step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
        />
      )} */}

      {(tabIndex === 4 ||
        (tabIndex === 3 && location?.state?.mentor) ||
        (tabIndex === 3 && currentStudent?.isTrial)) && (
        <LessonConfirmation
          plan={selectedPlan}
          slot={schedule}
          mentor={selectMentor || location?.state?.mentor}
          isMentorScheduled={!!location?.state?.mentor}
          setTabIndex={setTabIndex}
          lessonId={id}
          setCreatedLessons={setCreatedLessons}
          setRepeat={setRepeat}
          repeat={Number(repeat)}
        />
      )}

      {tabIndex === 5 && createdLessons && <ScheduleSuccess lessons={createdLessons} />}
    </>
  );
};

export default ScheduleLesson;
