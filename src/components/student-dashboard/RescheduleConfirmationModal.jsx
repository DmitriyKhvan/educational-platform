import React, { useState } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import LessonCard from '../../pages/Students/ScheduleLesson/LessonCard';
import ScheduleCard from '../../pages/Students/ScheduleLesson/ScheduleCard';
import TutorImageRow from '../../pages/Students/ScheduleLesson/TutorImageRow';
import NotificationManager from '../NotificationManager';
import Loader from '../common/Loader';
import { useAuth } from '../../modules/auth';
import { useLazyQuery } from '@apollo/client';
import {
  APPOINTMENTS_QUERY,
  UPDATE_APPOINTMENT,
} from '../../modules/auth/graphql';

const RescheduleConfirmationModal = ({
  setTabIndex,
  data,
  schedule,
  tutor,
  closeModal,
}) => {
  const [t] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const [getAppointments] = useLazyQuery(APPOINTMENTS_QUERY);
  const [updateAppointment] = useLazyQuery(UPDATE_APPOINTMENT);

  const userTimezone = user?.timeZone?.split(' ')[0];
  const { duration, id, lesson } = data;
  const start_at = moment.utc(schedule).format('YYYY-MM-DDTHH:mm:ss');
  const scheduleDate = moment(schedule).tz(userTimezone).format('dddd, MMM DD');
  const scheduleStartTime = moment(schedule).tz(userTimezone).format('hh:mm A');
  const scheduleEndTime = moment(schedule)
    .tz(userTimezone)
    .add(data.duration, 'minutes')
    .format('hh:mm A');

  const fetchAppointments = () => {
    let studentId;
    if (user?.students?.length > 0) {
      studentId = user?.students?.[0]?.id;
    }
    getAppointments({
      variables: {
        status: 'scheduled,paid,completed,in_progress',
        studentId: studentId,
      },
    });
  };

  const confirmReschedule = async () => {
    setIsLoading(true);
    const res = await updateAppointment({
      variables: {
        id: id,
        startAt: start_at,
        mentorId: tutor.id,
      },
    });

    if (res) {
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
