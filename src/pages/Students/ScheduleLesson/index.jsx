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

const ScheduleLesson = () => {
  const { id = null } = useParams();
  const location = useLocation();
  const { data, loading } = useQuery(LESSON_QUERY, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const [clicked, setClicked] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState();
  const [tabIndex, setTabIndex] = useState(id ? 1 : 0);
  const [selectTutor, setSelectTutor] = useState();

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
          lesson={scheduledLesson}
        />
      )}

      <ScheduleProvider
        setTabIndex={setTabIndex}
        setSchedule={setSchedule}
        selectedMentor={location?.state?.tutor}
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

      {tabIndex === 3 && !location?.state?.tutor && (
        <SelectMentorCards
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
          lesson={scheduledLesson}
          schedule={schedule}
          step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
        />
      )}

      {(tabIndex === 4 || (tabIndex === 3 && location?.state?.tutor)) && (
        <LessonConfirmation
          plan={selectedPlan}
          time={schedule}
          tutor={selectTutor || location?.state?.tutor}
          isMentorScheduled={!!location?.state?.tutor}
          setTabIndex={setTabIndex}
          lesson={scheduledLesson}
          lessonId={id}
        />
      )}
    </React.Fragment>
  );
};

export default ScheduleLesson;
