import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import LessonConfirmation from './LessonConfirmation';
import { ScheduleSelector } from './ScheduleSelector';
import SelectLesson from './SelectLesson';
import SelectMentorCards from './SelectMentorCards';
import { useQuery } from '@apollo/client';
import { LESSON_QUERY } from '../../../modules/auth/graphql';

import '../../../assets/styles/tutor.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { ScheduleProvider } from 'src/pages/Students/ScheduleLesson/ScheduleSelector/ScheduleProvider';
import { AvailableTimes } from './ScheduleSelector/AvailableTimes';
import Layout from 'src/layouts/DashboardLayout';
import ScheduleSuccess from './ScheduleSuccess';
import { COMBINED_TIMESHEETS_TRIAL } from 'src/modules/graphql/queries/trial/combinedTimesheetsForTrials';
import { useAuth } from 'src/modules/auth';
import { COMBINED_TIMESHEETS } from 'src/modules/graphql/queries/combinedTimesheets';

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
  const [successfulLesson, setSuccessfulLesson] = useState(null);

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
          selectedMentor={location?.state?.tutor}
          setSelectMentor={currentStudent?.isTrial && setSelectMentor}
          duration={selectedPlan?.package?.sessionTime}
        >
          {tabIndex === 1 && (
            <Layout>
              <ScheduleSelector lesson={scheduledLesson} />
            </Layout>
          )}

          {tabIndex === 2 && (
            <Layout>
              <AvailableTimes />
            </Layout>
          )}
        </ScheduleProvider>
      )}

      {tabIndex === 3 &&
        !location?.state?.tutor &&
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
        (tabIndex === 3 && location?.state?.tutor) ||
        (tabIndex === 3 && currentStudent?.isTrial)) && (
        <LessonConfirmation
          plan={selectedPlan}
          time={schedule}
          mentor={selectMentor || location?.state?.tutor}
          isMentorScheduled={!!location?.state?.tutor}
          setTabIndex={setTabIndex}
          lesson={scheduledLesson}
          lessonId={id}
          setSuccessfulLesson={setSuccessfulLesson}
          setRepeat={setRepeat}
          repeat={repeat}
        />
      )}

      {tabIndex === 5 && (
        <ScheduleSuccess
          repeat={repeat}
          setTabIndex={setTabIndex}
          lesson={successfulLesson}
        />
      )}
    </React.Fragment>
  );
};

export default ScheduleLesson;
