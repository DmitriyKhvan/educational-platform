import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LessonConfirmation from './LessonConfirmation';
import ScheduleSelector from './ScheduleSelector';
import SelectLesson from './SelectLesson';
import SelectTutorCards from './SelectTutorCards';
import { getPlanStatus } from '../../../actions/subscription';
import { useQuery, gql } from '@apollo/client';

import '../../../assets/styles/tutor.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { useAuth } from '../../../modules/auth';
import { getAppointments } from '../../../actions/appointment';

const GET_GROUP_INFO = gql`
  query ($id: ID) {
    group(where: { id: $id }) {
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
`


const ScheduleLesson = () => {
  const { id = null } = useParams();
  const { data, loading } = useQuery(GET_GROUP_INFO, {
    variables: { id },
    skip: !id,
  })

  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectTutor, setSelectTutor] = useState();
  const [plan, setPlan] = React.useState([])
  const {user} = useAuth();

  const calendarAppointments = useSelector(
    (state) => state.appointment.calendarEvents,
  );
  const planStatus = useSelector((state) => state.students.planStatus);

  useEffect(() => {
    dispatch(getPlanStatus());

    if (user && user?.student) {
      dispatch(
        getAppointments({
          student_id: user.student?.id,
          status: 'scheduled',
        }),
      );
    }
  }, [dispatch, schedule]);

  const scheduledLesson = data?.group || null;

  // useEffect(() => {
  //   if (id) {
  //     if(calendarAppointments) {
  //       const rescheduleLessonPlan = calendarAppointments?.find(i => i.eventDate?.id === parseInt(id));
  //       setPlan(rescheduleLessonPlan)
  //     }
  //   } 
  // }, [calendarAppointments, id]);

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
          step={selectedPlan?.duration === 25 ? 30 : 60}
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
          step={selectedPlan?.duration === 25 ? 30 : 60}
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
