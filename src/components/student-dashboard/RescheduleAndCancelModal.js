import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CancellationPolicyModal from './CancellationPolicyModal'
import CancelLessonModal from './CancelLessonModal'
import CancelWarningModal from './CancelWarningModal'
import ModalWrapper from '../ModalWrapper'
import ScheduleSelector from '../../pages/Students/ScheduleLesson/ScheduleSelector'
import ReschedulingTimeModal from './ReschedulingTimeModal'
import { getTutorList } from '../../actions/tutor'
import ReschedulingTutorModal from './ReschedulingTutorModal'
import RescheduleConfirmationModal from './RescheduleConfirmationModal'
import { getPlanStatus } from '../../actions/subscription'

const RescheduleAndCancelModal = ({
  data,
  isOpen,
  closeModal,
  setTabIndex,
  setIsOpen,
  fetchAppointments,
  tabIndex,
  type
}) => {
  const dispatch = useDispatch()
  const [schedule, setSchedule] = useState()
  const [selectTutor, setSelectTutor] = useState()
  const tutors = useSelector(state => state.tutor.list)
  const [planStatus] = useSelector(state => state.students.planStatus).filter(
    x => parseInt(x.duration, 10) === parseInt(data.duration, 10)
  )

  useEffect(() => {
    dispatch(getPlanStatus())
    dispatch(getTutorList(schedule))
  }, [dispatch, schedule])
  data.planStatus = planStatus

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      {tabIndex === 0 ? (
        <CancelWarningModal
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          duration={data.duration}
          type={type}
        />
      ) : tabIndex === 1 ? (
        <CancelLessonModal
          setTabIndex={setTabIndex}
          setIsOpen={setIsOpen}
          id={data.id}
          fetchAppointments={fetchAppointments}
        />
      ) : tabIndex === 2 ? (
        <ReschedulingTimeModal
          setSchedule={setSchedule}
          setTabIndex={setTabIndex}
          type={type}
        />
      ) : tabIndex === 3 ? (
        <ReschedulingTutorModal
          tutors={tutors}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
        />
      ) : tabIndex === 4 ? (
        <RescheduleConfirmationModal
          setTabIndex={setTabIndex}
          data={data}
          schedule={schedule}
          tutor={selectTutor}
          closeModal={closeModal}
        />
      ) : (
        tabIndex === 10 && (
          <CancellationPolicyModal
            setTabIndex={setTabIndex}
            setIsOpen={setIsOpen}
          />
        )
      )}
    </ModalWrapper>
  )
}

export default RescheduleAndCancelModal
