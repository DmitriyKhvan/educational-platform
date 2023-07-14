import React, { useState } from 'react';
import '../../../assets/styles/dashboard.scss';
import { useTranslation } from 'react-i18next';
import ImgArrowBack from '../../../assets/images/arrow_back.svg';
import { Checkbox } from '../../../components/Checkbox';
import { Avatar } from '../../../components/Avatar';
import Stars from '../../../components/Stars';
import { format } from 'date-fns';
import { getAbbrName, getAvatarName } from '../../../constants/global';
import ModalConfirmLesson from './ModalConfirmLesson';
import ActionTypes from '../../../constants/actionTypes';
import NotificationManager from '../../../components/NotificationManager';
import FavouriteIcon from '../../../components/FavouriteIcon';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_APPOINTMENT } from '../../../modules/auth/graphql';
import { useAuth } from '../../../modules/auth';

const LessonConfirmation = ({ tutor, time, lesson, onBack }) => {
  const [t] = useTranslation('translation');
  const [checkStates, setCheckStates] = useState([false, false, false]);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const {user} = useAuth();

  const [createAppointment] = useMutation(CREATE_APPOINTMENT);

  const history = useHistory();

  const onChangeChecked = (index) => {
    let checked = [...checkStates];
    checked[index] = !checked[index];
    if (checked[index]) checked[1 - index] = false;
    setCheckStates(checked);
  };

  const CancelReasonBox = ({ label, index, checked, onChange }) => {
    return (
      <div className={`cancel-reason ${checked ? 'active' : ''}`}>
        <div>
          <Checkbox
            checked={checked}
            onChange={() => onChange(index)}
            label={label}
          />
        </div>
      </div>
    );
  };

  const onClickConfirm = async () => {
    const studentId =
      history.location.state && history.location.state.studentId;

    let data = {
      lesson_id: lesson.lesson_id,
      tutor_id: tutor.id,
      duration: lesson.duration,
      start_at: format(time, "yyyy-MM-dd'T'HH:mm:ss"),
      cancel_action: 'assign_new_tutor', // assign_new_tutor | refund, default is assign_new_tutor
    };

    if (studentId) data = { ...data, studentId };
    const res = await createAppointment({
      variables: {
        mentorId: tutor.id,
        studentId: user.students[0].id,
        packageId: lesson.package_id,
        courseId: lesson.course_id,
        startAt: data.start_at,
        duration: data.duration,
      },
    });
    if (res.type === ActionTypes.CREATE_APPOINTMENT_INFO.SUCCESS) {
      setIsConfirmModal(true);
    } else {
      if (res.payload.error.messages && res.payload.error.messages.length) {
        NotificationManager.error(
          res.payload.error.messages.map((msg) => msg.title).join('\n'),
          t,
        );
      } else if (res.payload.error.message) {
        NotificationManager.error(res.payload.error.message, t);
      } else {
        NotificationManager.error('Server Error', t);
      }
    }
  };

  return (
    <div className="overview-confirmation">
      <h4 className="main-title">{t('overview_confirmation')}</h4>
      <div className="btn-step-back" onClick={onBack}>
        <img src={ImgArrowBack} alt="" />
        <span>{t('step_back')}</span>
      </div>
      <div className="divider" />
      <div className="lesson-detail">
        <div>
          <p>{t('selected_tutor')}</p>
          <span />
          <p>{t('lesson_time_detail')}</p>
        </div>
        <div>
          <div className="info">
            <Avatar
              avatar={tutor.avatar}
              name={getAvatarName(tutor.first_name, tutor.last_name)}
            />
            <div className="detail">
              <p>
                {getAbbrName(tutor.first_name, tutor.last_name)}
                <FavouriteIcon
                  isFavourite={tutor.favorite}
                  tutor_id={tutor.id}
                />
              </p>
              <Stars points={tutor.points} />
              <p className="university">{tutor.university}</p>
              <p className="location">{tutor.location}</p>
              <p className="major">{tutor.major}</p>
            </div>
          </div>
          <div className="divider" />
          <div className="lesson-time-detail">
            <p className="date-time">
              {format(time, 'MMM dd')}, <strong>{format(time, 'hh:mm')}</strong>{' '}
              {format(time, 'aa')}
            </p>
            <p className="day">{format(time, 'EEEE')}</p>
            <div className="lesson-info">
              <div className="duration-label">{lesson.duration}m</div>
              <p>{lesson.course}</p>
              <div className="duration-graph">
                <p>Time Duration</p>
                <div className="graph">
                  <span className="start-at" />
                  <span className="gray" />
                  <span className="end-at" />
                </div>
                <div className="hours">
                  <p>{format(time, 'hh:mm')}</p>
                  <p>{format(time, 'hh:mm')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="cancel-reason-label">{t('know_tutor_lesson_cancel')}</p>
      <div className="cancel-reasons-wrapper">
        <CancelReasonBox
          label={t('assign_another_tutor')}
          index={0}
          onChange={onChangeChecked}
          checked={checkStates[0]}
        />
        {/* <CancelReasonBox label={t('know_another_time_tutor')} index={1} onChange={onChangeChecked} checked={checkStates[1]} /> */}
        <CancelReasonBox
          label={t('refund_coupon')}
          index={2}
          onChange={onChangeChecked}
          checked={checkStates[2]}
        />
      </div>
      <div className="btn-confirm" onClick={onClickConfirm}>
        {t('confirm_lesson')}
      </div>
      <ModalConfirmLesson
        visible={isConfirmModal}
        start_at={time}
        onDismiss={() => setIsConfirmModal(false)}
      />
    </div>
  );
};

export default LessonConfirmation;
