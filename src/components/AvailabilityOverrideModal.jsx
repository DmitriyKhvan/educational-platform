import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailProv } from '../pages/Tutors/Availiability/AvailabilityProvider';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import '../assets/styles/date.css';
import { getTutorInfo, updateExceptionDates } from '../actions/tutor';
import { AvailabilityProvider } from '../pages/Tutors/Availiability/AvailabilityProvider';
import AvailabilityDayRowOver from '../components/AvailabilityDayRowOver';
import AvailabilityPickerOver from '../pages/Tutors/Availiability/AvailabilityPicker';
import CloseIcon from '../assets/images/Close icon.svg';
import { useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import moment from 'moment';
import { uniqpBy } from '../utils/common';
import { v4 as uuid } from 'uuid';
import NotificationManager from '../../src/components/NotificationManager';
const AvailabilityOverrideModal = ({
  showModal,
  toggleModal,
  user_id,
  isAdmin,
  disablePlusBtn,
  setDisablePlusBtn,
  isteachAddHours,
  setIsTeachAddHours,
  setCurrentToTime,
  currentToTime,
  gatherAvailabilities,
  setGatherAvailabilities,
  type,
  id,
}) => {
  const [t] = useTranslation();
  const avail = useContext(AvailProv);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [hasValidTimes, setHasValidTimes] = useState(false);
  const [canAddSchedule, toggleAddSchedule] = useState(true);

  const dispatch = useDispatch();
  const tutorInfo = useSelector((state) => state.tutor.info);
  const user = useSelector((state) =>
    isAdmin ? state.admin.user : state.users.user,
  );
  const [loadings, setLoadings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDatas, setCurrentDatas] = useState([]);

  useEffect(() => {
    if (user && user.tutor_profile)
      dispatch(getTutorInfo(user.tutor_profile.id));
  }, [user]);

  useEffect(() => {
    setCurrentDatas(tutorInfo?.exceptiondates);
  }, [tutorInfo]);

  useEffect(() => {
    DateOverrides(startDate);
  }, [startDate]);

  useEffect(() => {
    DateOverrides();
  }, []);

  const DateOverrides = (startDates) => {
    const availableDate = tutorInfo?.exceptiondates
      ?.map((el) => el.date)
      .filter(
        (elm) =>
          elm.substr(0, 7) ===
          moment(startDates || new Date())
            .format('yyyy-MM-DD')
            .substr(0, 7),
      );
    const uniqAvailableDate = uniqpBy(availableDate);

    if (
      uniqAvailableDate.indexOf(
        moment(startDates || new Date()).format('yyyy-MM-DD'),
      ) !== -1
    ) {
      toggleAddSchedule(true);
      setDisablePlusBtn(false);
    } else {
      toggleAddSchedule(uniqAvailableDate.length < 2);
      setDisablePlusBtn(uniqAvailableDate.length < 2 ? false : true);
    }
  };
  const onSubmits = async () => {
    setTimeout(() => {
      setLoading(true);
      gatherAvailabilities.map((date, index) => {
        date.date = moment(startDate).format('yyyy-MM-DD');
      });

      var gather_ = currentDatas.filter((el, i) => {
        if (el.date !== gatherAvailabilities[0].date) {
          return el;
        }
      });
      var updatedData = [...gatherAvailabilities];
      gather_.map((data) => {
        var temp = {};
        var time = [];
        time.push(data);
        temp.slots = time;
        temp.date = moment(data.date).format('yyyy-MM-DD'); //2022-07-28 //2022-01-30
        updatedData.push(temp);
      });
      dispatch(updateExceptionDates(updatedData, user_id));
      setLoadings(toggleModal);
      setLoading(false);
    }, 1000);
    setTimeout(() => {
      dispatch(getTutorInfo(user.tutor_profile.id));
    }, 2000);
  };

  const handleMonthChange = (selectmonth) => {
    DateOverrides(selectmonth);
    setStartDate(selectmonth);
  };

  const updateGatherAvail = (data, from) => {
    setGatherAvailabilities(data, '');
  };
  const validateTimesSelected = (availability, day) => {
    /* flat map the time slots array **/
    const timeSlots = availability.flatMap((v) => {
      if (v.day === day) {
        return v.slots;
      }
    });
    for (let i = 0; i < timeSlots.length; i++) {
      if (timeSlots[i]?.from > timeSlots[i]?.to) {
        setHasValidTimes(true);
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.',
          ),
          t,
        );
        return;
      } else if (timeSlots[i + 1]?.from < timeSlots[i]?.to) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.',
          ),
          t,
        );
        setHasValidTimes(true);
        return;
      } else if (
        timeSlots[i] != undefined &&
        timeSlots[i]?.from === timeSlots[i]?.to
      ) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.',
          ),
          t,
        );
        setHasValidTimes(true);
        return;
      } else {
        setHasValidTimes(false);
      }
    }
  };
  const AvailabilitySlots = (fromTime, toTime, id, day) => {
    const from = fromTime;
    const to = toTime;
    const avail = { id, day, slots: [{ from, to }] };
    const data = gatherAvailabilities.filter((el) => el.id === id)[0]
      ? gatherAvailabilities.map((el) => {
          if (el.id === id) {
            return avail;
          }
          return el;
        })
      : [...gatherAvailabilities, ...[avail]];
    setGatherAvailabilities(data, 'exceptiondates');
    for (const availability of data) {
      const availId = availability.id;
      if (availId === id) {
        if (to >= '23:30') {
          setDisablePlusBtn(true);
        } else {
          setDisablePlusBtn(false);
        }
        availability.slots[0] = { from, to };
        validateTimesSelected(data, day);
        setGatherAvailabilities(data, 'exceptiondates');
      }
    }
  };
  return (
    <>
      {
        <div className="modal fade" id="overrideModal ">
          <div className="modal-dialog modalSize">
            <div className="modal-content p-0">
              <div className="modal-header  border-availabilities ps-3 pt-3">
                <div className="d-flex">
                  <h2
                    className="modal-title modal_title mb-0 ps-3"
                    id="overrideModalLabel"
                  >
                    {t('override_dates')}
                  </h2>
                  <img
                    className="Close_Icon"
                    src={CloseIcon}
                    alt=""
                    onClick={toggleModal}
                  />
                </div>

                <p className="date_override_text_color mt-0 pt-0 ps-3 pe-3 ">
                  {t('override_date_info')}
                </p>
              </div>
              <div className="modal-body pb-0 m-0">
                <div className="container custom-height">
                  <div className="row custom-height">
                    <div className="col-5 border-availabilities-right">
                      <DatePicker
                        dateFormat="d MMM yyyy"
                        formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        startDate={startDate}
                        minDate={new Date()}
                        endDate={endDate}
                        onMonthChange={handleMonthChange}
                        inline
                      />
                    </div>
                    <div className="col align-override-ui">
                      <div className="ms-3 check">
                        <div>
                          <div className="ps-3 pb-2 selected-date">
                            {' '}
                            {moment(startDate).format('DD MMM yyyy')}
                          </div>
                          <div className="ms-3 selct-time ">
                            {t('select_the_time')}
                          </div>
                          <AvailabilityProvider
                            date={startDate}
                            setGatherAvailabilities={setGatherAvailabilities}
                            gatherAvailabilities={gatherAvailabilities}
                            setDisablePlusBtn={setDisablePlusBtn}
                            isteachAddHours={isteachAddHours}
                            setIsTeachAddHours={setIsTeachAddHours}
                            AvailabilitySlots={AvailabilitySlots}
                            type={type}
                            validateTimesSelected={validateTimesSelected}
                          >
                            <AvailabilityDayRowOver
                              startDate={startDate}
                              date={startDate}
                              setGatherAvailabilities={setGatherAvailabilities}
                              gatherAvailabilities={gatherAvailabilities}
                              hasValidTimes={hasValidTimes}
                              setHasValidTimes={setHasValidTimes}
                              setDisablePlusBtn={setDisablePlusBtn}
                              disablePlusBtn={disablePlusBtn}
                              canAddSchedule={canAddSchedule}
                              AvailabilitySlots={AvailabilitySlots}
                              setCurrentToTime={setCurrentToTime}
                              currentToTime={currentToTime}
                              type={type}
                              id={id}
                            />
                          </AvailabilityProvider>
                          {avail.availabilityRow.exceptiondates.map((k) => {
                            return (
                              <>
                                <AvailabilityPickerOver
                                  key={k.id}
                                  i={avail.availabilityRow.length + 1}
                                  id={k.id}
                                  date={startDate}
                                  day={k.day}
                                />
                              </>
                            );
                          })}
                        </div>
                        {!canAddSchedule && (
                          <div className="ms-3">
                            <p className="already-choose text-danger">
                              {t('add_date_override_alert')}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="footer-columnwise">
                        <button
                          type="button"
                          className="btn btn-secondary modal_close_button"
                          data-bs-dismiss="modal"
                          onClick={toggleModal}
                        >
                          <strong>Cancel</strong>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary modal_save_button"
                          data-bs-dismiss="modal"
                          onClick={() => onSubmits(setLoading(!loading))}
                          disabled={hasValidTimes || !canAddSchedule}
                        >
                          {loading ? (
                            <ClipLoader
                              loading={loading}
                              size={20}
                              color="white"
                            />
                          ) : (
                            <strong>Save</strong>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};
export default AvailabilityOverrideModal;
