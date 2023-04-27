import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import LessonConfirmation from './LessonConfirmation';
import ScheduleSelector from './ScheduleSelector';
import SelectLesson from './SelectLesson';
import SelectTutorCards from './SelectTutorCards';
import { getPlanStatus } from '../../../actions/subscription';
import { useQuery, gql } from '@apollo/client';

import '../../../assets/styles/tutor.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const GET_GROUP_INFO = gql`
  query groups(
    $where: GroupWhereInput!
    $orderBy: [GroupOrderByInput!]!
    $take: Int
    $skip: Int
  ) {
    groups(where: $where) {
      id
      tutorId
      lessonId
      lessonType
      lessonTitle
      lessonDesc
      seatCount
      startAt
      duration
      status
      completed
      cancelAction
      lessonTopic
      lastPartLesson
      zoomlinkId
      createdAt
      updatedAt
    }
  }
`;

const ScheduleLesson = () => {
  const { id = null } = useParams();
  const { data, loading } = useQuery(GET_GROUP_INFO, { errorPolicy: 'ignore' });
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectTutor, setSelectTutor] = useState();

  useEffect(() => {
    dispatch(getPlanStatus());
  }, [dispatch, schedule]);

  const scheduledLesson = data?.group || null;

  console.log(data);

  useEffect(() => {
    if (scheduledLesson) {
    }
  }, [scheduledLesson]);

  if (loading) return null;

  return (
    <React.Fragment>
      {tabIndex === 0 ? (
        <SelectLesson
          setSelectedPlan={setSelectedPlan}
          setTabIndex={setTabIndex}
          clicked={clicked}
          setClicked={setClicked}
          lesson={scheduledLesson}
        />
      ) : tabIndex === 1 ? (
        <ScheduleSelector
          setTabIndex={setTabIndex}
          duration={selectedPlan?.duration}
          setSchedule={setSchedule}
          schedule={schedule}
          tabIndex={tabIndex}
          lesson={scheduledLesson}
          lessonId={id}
        />
      ) : tabIndex === 2 ? (
        <SelectTutorCards
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
          lesson={scheduledLesson}
          schedule={schedule}
        />
      ) : (
        tabIndex === 3 && (
          <LessonConfirmation
            plan={selectedPlan}
            time={schedule}
            tutor={selectTutor}
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
