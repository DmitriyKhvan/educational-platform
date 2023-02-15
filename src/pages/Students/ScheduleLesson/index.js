import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import LessonConfirmation from './LessonConfirmation'
import ScheduleSelector from './ScheduleSelector'
import SelectLesson from './SelectLesson'
import SelectTutorCards from './SelectTutorCards'
import { getPlanStatus } from '../../../actions/subscription'

import '../../../assets/styles/tutor.scss'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const ScheduleLesson = () => {
  const dispatch = useDispatch()
  const [clicked, setClicked] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState({})
  const [schedule, setSchedule] = useState()
  const [tabIndex, setTabIndex] = useState(0)
  const [selectTutor, setSelectTutor] = useState()
  const { loading, error, data } = useQuery(GET_TUTORS)

  const tutors = data?.tutors?.map(tutor => {
    return {
      id: tutor?.id,
      avatar: tutor?.avatar?.url ?? "",
      first_name: tutor?.user?.firstName,
      last_name: tutor?.user?.lastName,
      univer: 'Stanford University',
      lang: 'SMTH',
      isFavourite: false
    }
  })

  useEffect(() => {
    dispatch(getPlanStatus())
  }, [dispatch, schedule])

  return (
    <React.Fragment>
      {tabIndex === 0 ? (
        <SelectLesson
          setSelectedPlan={setSelectedPlan}
          setTabIndex={setTabIndex}
          clicked={clicked}
          setClicked={setClicked}
        />
      ) : tabIndex === 1 ? (
        <ScheduleSelector
          setTabIndex={setTabIndex}
          duration={selectedPlan.duration}
          setSchedule={setSchedule}
          schedule={schedule}
          tabIndex={tabIndex}
        />
      ) : tabIndex === 2 ? (
        <SelectTutorCards
          // tutors={tutors}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
          schedule={schedule}
        />
      ) : (
        tabIndex === 3 && (
          <LessonConfirmation
            plan={selectedPlan}
            time={schedule}
            tutor={selectTutor}
            setTabIndex={setTabIndex}
            lessonId={null}
          />
        )
      )}
    </React.Fragment>
  )
}

export default ScheduleLesson
