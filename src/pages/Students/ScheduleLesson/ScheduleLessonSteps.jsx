import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../../components/Layout'
// import "../../assets/styles/tutor.scss";
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Modal from '../../../components/Modal'
import TimeSelect from '../../../components/TimeSelect'
import NotificationManager from '../../../components/NotificationManager'
import { createAppointment } from '../../../actions/appointment'
import { useTranslation } from 'react-i18next'
import SelectLessonType from './SelectLessonType'
import SelectTimeOfLesson from './SelectTimeOfLesson'
import SelectTutor from './SelectTutor'
import LessonConfirmation from './LessonConfirmationDeprecated'
import { useHistory } from 'react-router'
import ModalConfirmLesson from './ModalConfirmLesson'

/**
 * Constants
 */

const tabs = [
  'select_lesson_type',
  'select_lesson_time',
  'select_tutor',
  'overview_confirmation'
]

const ScheduleLessonSteps = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')

  const [tabs, setTabs] = useState([])

  const [tabIndex, setTabIndex] = useState(1)
  const [isTimeFirst, setIsTimeFirst] = useState(false)

  const [selectedTutor, setSelectedTutor] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)

  useState(() => {
    const isTimeFirst =
      (history.location.state && history.location.state.timeFirst) || false
    setIsTimeFirst(isTimeFirst)

    if (isTimeFirst) {
      setTabs([
        'select_lesson_type',
        'select_lesson_time',
        'select_tutor',
        'overview_confirmation'
      ])
    } else {
      setTabs([
        'select_lesson_type',
        'select_tutor',
        'select_lesson_time',
        'overview_confirmation'
      ])
    }
  }, [history])

  const onContinue = data => {
    if (tabIndex === 1) {
      setSelectedLesson(data)
      setTabIndex(tabIndex + 1)
    } else if (tabIndex === 2) {
      if (isTimeFirst) setSelectedTime(data)
      else setSelectedTutor(data)
      setTabIndex(tabIndex + 1)
    } else if (tabIndex === 3) {
      if (isTimeFirst) setSelectedTutor(data)
      else setSelectedTime(data)
      setTabIndex(tabIndex + 1)
    } else if (tabIndex === 4) {
      setVisibleConfirm(true)
    }
  }

  const onBack = () => {
    setTabIndex(tabIndex - 1)
  }

  return (
    <Layout>
      <div className='make-appointment-layout'>
        <div className='tab-bar'>
          {tabs.map((tab, index) => (
            <div
              key={`tab-${index}`}
              className={tabIndex > index ? 'active' : ''}
            >
              <div>
                <span>{index + 1}</span>
                <span>{t(tab)}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Time First */}
        {tabIndex === 1 && (
          <SelectLessonType
            onContinue={onContinue}
            onBack={onBack}
            selectedTime={setSelectedTime}
          />
        )}
        {tabIndex === 2 && isTimeFirst && (
          <SelectTimeOfLesson
            isTimeFirst={isTimeFirst}
            onContinue={onContinue}
            onBack={onBack}
          />
        )}
        {tabIndex === 3 && isTimeFirst && (
          <SelectTutor
            isTimeFirst={isTimeFirst}
            onContinue={onContinue}
            onBack={onBack}
            selectedTime={selectedTime}
          />
        )}
        {/* Tutor First */}
        {tabIndex === 2 && !isTimeFirst && (
          <SelectTutor
            isTimeFirst={isTimeFirst}
            onContinue={onContinue}
            onBack={onBack}
          />
        )}
        {tabIndex === 3 && !isTimeFirst && (
          <SelectTimeOfLesson
            isTimeFirst={isTimeFirst}
            onContinue={onContinue}
            onBack={onBack}
            selectedTutor={selectedTutor}
          />
        )}
        {/* Overview & Confirmation */}
        {tabIndex === 4 && (
          <LessonConfirmation
            onContinue={onContinue}
            onBack={onBack}
            tutor={selectedTutor}
            time={selectedTime}
            lesson={selectedLesson}
          />
        )}
      </div>
      <ModalConfirmLesson
        visible={visibleConfirm}
        onDismiss={() => setVisibleConfirm(false)}
      />
    </Layout>
  )
}

export default ScheduleLessonSteps
