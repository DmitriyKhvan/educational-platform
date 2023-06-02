import React from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { approveAppointment, cancelAppointment } from '../actions/appointment';

const BookingRequest = ({ lessonApprovals, fetchAppointments, user }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const userTimezone =
    user?.time_zone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const displayBookingRequestDate = (event) => {
    const date = moment(event.start_at)
      .tz(userTimezone)
      .format('MMMM DD, YYYY');
    const start = moment(event.start_at).tz(userTimezone).format('hh:mm A');
    const end = moment(event.start_at)
      .tz(userTimezone)
      .add(event.duration, 'minutes')
      .format('hh:mm A');
    return `${date} at ${start} → ${end}`;
  };

  const onClickApproval = async ({ target }) => {
    dispatch(approveAppointment(target.id));
    await fetchAppointments();
  };

  const onClickDecline = async ({ target }) => {
    dispatch(cancelAppointment(target.id));
    await fetchAppointments();
  };

  return (
    <React.Fragment>
      <h4 className="weekly-schedule">{t('booking_request')}</h4>
      {lessonApprovals.map((event) => {
        return (
          <div
            className="page-card grey-border bg-white small-card mt-4 p-3 pt-0 ps-4"
            key={event.id}
          >
            <h1 className="text-black">{event.lesson.description}</h1>
            <p className="text-light-grey mt-0">
              {displayBookingRequestDate(event)}
            </p>
            <div className="row ps-3">
              <div
                className="col-auto bg-grey-100"
                style={{ borderRadius: '4px' }}
              >
                <p className="m-1 mx-2 text-grey-700">
                  {t('student_level', { t: event.students[0].level || 0 })}
                </p>
              </div>
              <div
                className="col-auto ms-2 bg-light-purple"
                style={{ borderRadius: '4px' }}
              >
                <p className="m-1 mx-2 text-primary">
                  {event.type === '1-on-1' ? t('private') : t('group')}
                </p>
              </div>
              <div
                className="col-auto ms-2 bg-light-purple"
                style={{ borderRadius: '4px' }}
              >
                <p className="m-1 mx-2 text-primary">{event.duration + 'm'}</p>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-6">
                <button
                  className="enter-btn grey-border w-85"
                  onClick={onClickApproval}
                  id={event.id}
                >
                  {t('accept')}
                </button>
              </div>
              <div className="col-6">
                <button
                  className="enter-btn grey-border w-85 ms-0"
                  onClick={onClickDecline}
                  id={event.id}
                >
                  {t('decline')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default BookingRequest;
