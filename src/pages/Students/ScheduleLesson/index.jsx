import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import LessonConfirmation from './LessonConfirmation';
import ScheduleSelector from './SheduleSelector/ScheduleSelector';
import SelectLesson from './SelectLesson';
import SelectTutorCards from './SelectTutorCards';
import { useQuery } from '@apollo/client';
import { LESSON_QUERY } from '../../../modules/auth/graphql';

import '../../../assets/styles/tutor.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

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
      {tabIndex === 0 ? (
        <SelectLesson
          setSelectedPlan={setSelectedPlan}
          selectedPlan={selectedPlan}
          setTabIndex={setTabIndex}
          clicked={clicked}
          setClicked={setClicked}
          lesson={scheduledLesson}
        />
      ) : tabIndex === 1 ? (
        <ScheduleSelector
          setTabIndex={setTabIndex}
          duration={selectedPlan?.package?.sessionTime}
          step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
          // step={30}
          setSchedule={setSchedule}
          schedule={schedule}
          tabIndex={tabIndex}
          lesson={scheduledLesson}
          lessonId={id}
          selectedTutor={location?.state?.tutor}
        />
      ) : tabIndex === 2 && !location?.state?.tutor ? (
        <SelectTutorCards
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
          lesson={scheduledLesson}
          schedule={schedule}
          step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
        />
      ) : (
        (tabIndex === 3 || location?.state?.tutor) && (
          <LessonConfirmation
            plan={selectedPlan}
            time={schedule}
            tutor={selectTutor || location?.state?.tutor}
            isMentorScheduled={!!location?.state?.tutor}
            setTabIndex={setTabIndex}
            lesson={scheduledLesson}
            lessonId={id}
          />
        )
      )}
    </React.Fragment>
  );
};

export default ScheduleLesson;
