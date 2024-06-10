import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import LessonConfirmation from './LessonConfirmation';
import { ScheduleSelector } from './ScheduleSelector';
import SelectLesson from './SelectLesson';
import SelectMentorCards from './SelectMentorCards';
import { useQuery } from '@apollo/client';
import { LESSON_QUERY } from '../../../shared/apollo/graphql';

import 'src/app/styles/tutor.scss';
import { ScheduleProvider } from 'src/pages/Students/ScheduleLesson/ScheduleSelector/ScheduleProvider';
import { AvailableTimes } from './ScheduleSelector/AvailableTimes';

import ScheduleSuccess from './ScheduleSuccess';
import { COMBINED_TIMESHEETS_TRIAL } from 'src/shared/apollo/queries/trial/combinedTimesheetsForTrials';
import { useAuth } from 'src/app/providers/AuthProvider';
import { COMBINED_TIMESHEETS } from 'src/shared/apollo/queries/combinedTimesheets';

const ScheduleLesson = () => {
  const { currentStudent } = useAuth();
  const { id = null } = useParams();
  const location = useLocation();

  const { data, loading } = useQuery(LESSON_QUERY, {
    variables: { id },
    skip: !id,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const [repeat, setRepeat] = useState(
    JSON.parse(urlParams.get('repeatLessons') || null),
  );

  const [clicked, setClicked] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState();
  const [tabIndex, setTabIndex] = useState(id ? 1 : 0);
  const [selectMentor, setSelectMentor] = useState();
  const [createdLessons, setCreatedLessons] = useState(null);

  const scheduledLesson = data?.lesson || null;

  useEffect(() => {
    if (data?.lesson) {
      setSelectedPlan(data?.lesson?.packageSubscription);
    }
  }, [data?.lesson]);

  if (loading) return null;

  return (
    <React.Fragment>
      {tabIndex === 0 && (
        <SelectLesson
          setSelectedPlan={setSelectedPlan}
          selectedPlan={selectedPlan}
          setTabIndex={setTabIndex}
          clicked={clicked}
          setClicked={setClicked}
        />
      )}

      {(tabIndex === 1 || tabIndex === 2) && (
        <ScheduleProvider
          query={
            currentStudent?.isTrial
              ? COMBINED_TIMESHEETS_TRIAL
              : COMBINED_TIMESHEETS
          }
          setTabIndex={setTabIndex}
          setSchedule={setSchedule}
          selectedMentor={location?.state?.mentor}
          setSelectMentor={currentStudent?.isTrial && setSelectMentor}
          duration={selectedPlan?.package?.sessionTime}
        >
          {tabIndex === 1 && <ScheduleSelector lesson={scheduledLesson} />}

          {tabIndex === 2 && <AvailableTimes />}
        </ScheduleProvider>
      )}

      {tabIndex === 3 &&
        !location?.state?.mentor &&
        !currentStudent?.isTrial && (
          <SelectMentorCards
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            setSelectMentor={setSelectMentor}
            lesson={scheduledLesson}
            schedule={schedule}
            step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
          />
        )}

      {(tabIndex === 4 ||
        (tabIndex === 3 && location?.state?.mentor) ||
        (tabIndex === 3 && currentStudent?.isTrial)) && (
        <LessonConfirmation
          plan={selectedPlan}
          time={schedule}
          mentor={selectMentor || location?.state?.mentor}
          isMentorScheduled={!!location?.state?.mentor}
          setTabIndex={setTabIndex}
          lesson={scheduledLesson}
          lessonId={id}
          setCreatedLessons={setCreatedLessons}
          setRepeat={setRepeat}
          repeat={repeat}
        />
      )}

      {tabIndex === 5 && (
        <ScheduleSuccess
          repeat={repeat}
          setTabIndex={setTabIndex}
          lessons={createdLessons}
        />
      )}
    </React.Fragment>
  );
};

export default ScheduleLesson;
