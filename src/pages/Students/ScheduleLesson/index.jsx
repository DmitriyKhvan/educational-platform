import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import LessonConfirmation from './LessonConfirmation';
import ScheduleSelector from './ScheduleSelector';
import SelectLesson from './SelectLesson';
import SelectTutorCards from './SelectTutorCards';
import { useQuery, gql } from '@apollo/client';

import '../../../assets/styles/tutor.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const GET_LESSON_INFO = gql`
  query GET_LESSON($id: ID!) {
    lesson(id: $id) {
      id
      startAt
      duration
      status
      cancelAction
      zoomlinkId
      mentor {
        id
        major
        language
        university
        graduatingYear
        degree
        introduction
        about
        experience
        relevantExperience
        isActive
        hourlyRate
        facts
        uniqueFacts
        avatarId
        avatar {
          id
          name
          mimetype
          url
          path
          width
          height
          createdAt
          updatedAt
        }
      }
      student {
        id
        parentName
        level
        langLevel
        birthday
        about
        pronouns
        isActive
        avatarId
        avatar {
          id
          name
          mimetype
          url
          path
          width
          height
          createdAt
          updatedAt
        }
      }
      course {
        id
        title
        description
      }
    }
  }
`;

const ScheduleLesson = () => {
  const { id = null } = useParams();
  const location = useLocation();
  const { data, loading } = useQuery(GET_LESSON_INFO, {
    variables: { id },
    skip: !id,
  });

  const [clicked, setClicked] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [schedule, setSchedule] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectTutor, setSelectTutor] = useState();

  const scheduledLesson = data?.group || null;

  if (loading) return null;

  // console.log('selectedPlan', selectedPlan);

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
          duration={selectedPlan?.package?.sessionTime}
          step={selectedPlan?.package?.sessionTime === 25 ? 30 : 60}
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
