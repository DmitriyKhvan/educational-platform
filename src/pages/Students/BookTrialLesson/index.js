import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
// import "../../assets/styles/tutor.scss";
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Modal from '../../../components/Modal'
import TimeSelect from '../../../components/TimeSelect'
import NotificationManager from '../../../components/NotificationManager.js'
import { createAppointment } from '../../../actions/appointment'
import { useTranslation } from 'react-i18next'
import BookTimeTrial from './BoolTimeTrial'
import SelectTutor from './SelectTutor'
import LessonConfirmation from './LessonConfirmation'
import ModalConfirmLesson from './ModalConfirmLesson'

const BookTrialLesson = () => {
  const [t, i18n] = useTranslation('translation')

  const [tabs, setTabs] = useState([
    'select_time_of_trial',
    'deposit_payment',
    'overview_confirmation'
  ])
  const [visibleTimeSelect, setVisibleTimeSelect] = useState(false)
  const [startAt, setStartAt] = useState(new Date())
  const [creating, setCreating] = useState(false)

  const [tabIndex, setTabIndex] = useState(1)

  const [selectedTutor, setSelectedTutor] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)

  const setTimeSelectData = (start_at, duration) => {
    setStartAt(start_at)
    // setDuration(duration);
  }

  const onContinue = data => {
    if (tabIndex === 1) {
      setSelectedTime(data)
      setTabIndex(tabIndex + 1)
    } else if (tabIndex === 2) {
      setSelectedTutor(data)
      setTabIndex(tabIndex + 1)
    } else if (tabIndex === 3) {
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

        {tabIndex === 1 && (
          <BookTimeTrial
            onContinue={onContinue}
            onBack={onBack}
            selectedTime={setSelectedTime}
          />
        )}
        {tabIndex === 2 && (
          <SelectTutor
            onContinue={onContinue}
            onBack={onBack}
            selectedTutor={setSelectedTutor}
          />
        )}
        {tabIndex === 3 && (
          <LessonConfirmation
            onContinue={onContinue}
            onBack={onBack}
            tutor={selectedTutor}
            time={selectedTime}
            onContinue={onContinue}
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

export default BookTrialLesson
