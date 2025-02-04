import LessonConfirmation from '@/pages/students/schedule-lesson/lesson-confirmation';
import { LESSON_QUERY } from '@/shared/apollo/graphql';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// import '@/app/styles/tutor.scss';

import Mentors from '@/pages/students/mentors-list';
import ScheduleSuccess from '@/pages/students/schedule-lesson/schedule-success';
import SelectLesson from '@/pages/students/schedule-lesson/ui/select-lesson';
import type {
  AvailabilitySlot,
  Lesson,
  Mentor,
  PackageSubscription,
  Query,
} from '@/types/types.generated';
import { useMediaQuery } from 'react-responsive';
import { ScheduleCalendar } from './schedule-calendar/schedule-calendar';
import { ScheduleDateTime } from './schedule-date-time/schedule-date-time';

const ScheduleLesson = () => {
  const isTablet = useMediaQuery({ maxWidth: 840 });
  const { id = null } = useParams();
  const location = useLocation();

  const { data, loading } = useQuery<Query>(LESSON_QUERY, {
    variables: { id },
    skip: !id,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const repeatLessons = urlParams.get('repeatLessons');

  const [repeat, setRepeat] = useState<number | boolean | null>(
    repeatLessons ? JSON.parse(repeatLessons) : null,
  );

  const [selectedPlan, setSelectedPlan] = useState<PackageSubscription>();
  const [schedule, setSchedule] = useState<AvailabilitySlot>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectMentor /*setSelectMentor*/] = useState<Mentor>();
  const [createdLessons, setCreatedLessons] = useState<Lesson[]>();

  // const scheduledLesson = data?.lesson || null;

  useEffect(() => {
    if (location?.state?.mentor && !id) {
      setTabIndex(1);
    } else if (location?.state?.mentor && id) {
      setTabIndex(2);
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

      {tabIndex === 2 && isTablet && (
        <ScheduleDateTime
          mentor={location?.state?.mentor}
          setTabIndex={setTabIndex}
          setSchedule={setSchedule}
          schedule={schedule}
          repeat={repeat}
          setRepeat={setRepeat}
          plan={selectedPlan}
          lessonId={id}
        />
      )}

      {tabIndex === 2 && !isTablet && (
        <ScheduleCalendar
          repeat={repeat}
          mentor={location?.state?.mentor}
          setTabIndex={setTabIndex}
          setSchedule={setSchedule}
          schedule={schedule}
          setRepeat={setRepeat}
          lessonId={id}
          plan={selectedPlan}
        />
      )}

      {tabIndex === 3 && (
        <LessonConfirmation
          plan={selectedPlan}
          slot={schedule}
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

export default ScheduleLesson;
