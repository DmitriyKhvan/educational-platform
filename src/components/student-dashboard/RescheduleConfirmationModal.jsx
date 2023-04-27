import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import LessonCard from '../../pages/Students/ScheduleLesson/LessonCard';
import ScheduleCard from '../../pages/Students/ScheduleLesson/ScheduleCard';
import TutorImageRow from '../../pages/Students/ScheduleLesson/TutorImageRow';
import { updateAppointment, getAppointments } from '../../actions/appointment';
import ActionTypes from '../../constants/actionTypes';
import NotificationManager from '../NotificationManager';
import Loader from '../common/Loader';

const RescheduleConfirmationModal = ({
  setTabIndex,
  data,
  schedule,
  tutor,
  closeModal,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.users.user);

  const userTimezone = user?.time_zone?.split(' ')[0];
  const { duration, id, lesson } = data;
  const start_at = moment.utc(schedule).format('YYYY-MM-DDTHH:mm:ss');
  const scheduleDate = moment(schedule).tz(userTimezone).format('dddd, MMM DD');
  const scheduleStartTime = moment(schedule).tz(userTimezone).format('hh:mm A');
  const scheduleEndTime = moment(schedule)
    .tz(userTimezone)
    .add(data.duration, 'minutes')
    .format('hh:mm A');

  const fetchAppointments = () => {
    let queryObj = {};
    if (user.student_profile) {
      queryObj.student_id = user.student_profile.id;
    } else {
      return;
    }
    queryObj.from = new Date();
    dispatch(getAppointments(queryObj));
  };

  const confirmReschedule = async () => {
    setIsLoading(true);
    const rescheduleData = {
      tutor_id: tutor.id,
      start_at: start_at,
      duration: data.duration,
    };
    const res = await dispatch(updateAppointment(id, rescheduleData));

    if (res.type === ActionTypes.UPDATE_APPOINTMENT_INFO.SUCCESS) {
      fetchAppointments();
      closeModal();
    } else if (res.payload.error.message) {
      setIsLoading(false);
      NotificationManager.error(res.payload.error.message, t);
    } else {
      setIsLoading(false);
      NotificationManager.error('Server Error', t);
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <div style={{ width: '50vw', height: 'auto' }}>
        <h2 className="mt-0">
          {t('lesson')} {t('confirmation')}
        </h2>
        <p className="welcome-subtitle">{t('confirmation_subtitle')}</p>

        <div className="row px-4 mb-2">
          <button
            className="enter-btn btn-dash-return col"
            onClick={() => setTabIndex(2)}
          >
            {t('edit_schedule')}
          </button>
          <button
            className="enter-btn btn-dash-return col"
            onClick={() => setTabIndex(3)}
          >
            {t('edit_tutor')}
          </button>
        </div>

        <div className="modal-scroll px-4">
          <div className="row">
            <p className="welcome-subtitle mb-2 mt-2">{t('lesson_topic')}</p>
            <div className="row">
              <LessonCard lesson={lesson.title} duration={duration} />
            </div>
            <p className="welcome-subtitle mb-2 mt-4">{t('date_and_time')}</p>
            <div className="row">
              <ScheduleCard
                startTime={scheduleStartTime}
                endTime={scheduleEndTime}
                date={scheduleDate}
              />
            </div>
            <p className="welcome-subtitle mb-2 mt-4">{t('tutor')}</p>
            <div className="row">
              <TutorImageRow tutor={tutor} />
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <button className="btn btn-primary" onClick={confirmReschedule}>
            {t('confirm_lesson')}
          </button>
        </div>
      </div>
      {isLoading && <Loader />}
    </React.Fragment>
  );
};

export default RescheduleConfirmationModal;
