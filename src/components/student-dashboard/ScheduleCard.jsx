import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RescheduleAndCancelModal from './RescheduleAndCancelModal';
import PlaygroundWarningModal from './PlaygroundWarningModal';
import { useAuth } from 'src/app/providers/AuthProvider';

import {
  LessonsStatusType,
  ModalType,
  Roles,
} from '../../shared/constants/global';
import { addMinutes } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { isBetween } from '../../shared/utils/isBetween';
import { Avatar } from 'src/widgets/Avatar/Avatar';

const ScheduleCard = ({
  index,
  lesson,
  playground,
  date, //utc +0
  student,
  mentor,
  data,
  fetchAppointments,
  // cancelled,
  setCanceledLessons,
  duration,
  subscription,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [t] = useTranslation(['modals', 'common']);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateLesson = new Date(date); //current time zone avtomaticaly

  function onSelect() {
    setIsOpen(true);
    setModalType(ModalType.RESCHEDULE);
  }

  const closeModal = () => {
    setIsOpen(false);
    setIsWarningOpen(false);
    setTabIndex(0);
  };

  const onCancel = () => {
    setIsOpen(true);
    setModalType(ModalType.CANCEL);
  };

  const joinLesson = () => {
    //Time period when you can go to the lesson
    if (
      isBetween({
        dateStart: dateLesson,
        duration: data.duration,
        userTimezone,
      })
    ) {
      window.open(
        user.role === Roles.MENTOR ? playground.startUrl : playground.joinUrl,
        '_blank',
      );
    } else {
      setIsWarningOpen(true);
    }
  };

  const displayDate = () => {
    const eventDate = format(toZonedTime(dateLesson, userTimezone), 'MMM do', {
      timeZone: userTimezone,
    });
    const start = format(toZonedTime(dateLesson, userTimezone), 'hh:mm a', {
      timeZone: userTimezone,
    });

    const end = format(
      addMinutes(
        toZonedTime(dateLesson, userTimezone),
        subscription?.package?.sessionTime || duration,
      ),
      'hh:mm a',
      { timeZone: userTimezone },
    );
    return `${eventDate} at ${start} → ${end}`;
  };

  return (
    <div
      className={`mb-5 rounded-[10px] p-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)] ${
        !LessonsStatusType[data?.status?.toUpperCase()]
          ? 'bg-color-light-grey2 opacity-60'
          : index === 0
            ? 'bg-color-purple'
            : 'border border-color-border-grey bg-white'
      }`}
    >
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-[30px] font-normal ${
                index === 0 && LessonsStatusType[data?.status?.toUpperCase()]
                  ? 'text-white m-0'
                  : 'text-black m-0'
              }`}
            >
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3
              className={`text-base font-semibold tracking-tight ${
                index === 0 && LessonsStatusType[data?.status?.toUpperCase()]
                  ? 'text-color-light-purple'
                  : 'text-color-light-grey'
              }`}
            >
              {displayDate()}
            </h3>

            {user.role === Roles.MENTOR && (
              <p
                className={`text-sm ${
                  index === 0
                    ? 'text-color-light-purple'
                    : 'text-color-light-grey'
                }`}
              >
                {student?.user.email}
              </p>
            )}
          </div>
          <div className="w-[65px] h-[65px] overflow-hidden rounded-full relative">
            <Avatar
              gender={
                user.role === Roles.MENTOR ? student?.gender : mentor?.gender
              }
              avatarUrl={
                user.role === Roles.MENTOR
                  ? student?.avatar?.url
                  : mentor?.avatar?.url
              }
            />
          </div>
        </div>
      </div>
      {LessonsStatusType[data?.status?.toUpperCase()] ? (
        <div className="flex flex-wrap items-center gap-2 xl:gap-3">
          {user.role !== Roles.MENTOR && (
            <a
              className={`cursor-pointer w-full text-center sm:w-auto sm:text-left text-[15px] font-semibold tracking-tighter inline-block py-2.5 px-[15px] bg-white rounded-[5px] ${
                index === 0
                  ? 'text-color-purple'
                  : 'border border-color-border-grey text-black'
              } 
       
              `}
              onClick={onSelect}
            >
              {t('reschedule')}
            </a>
          )}
          <a
            onClick={onCancel}
            className={`cursor-pointer w-full text-center sm:w-auto sm:text-left text-[15px] font-semibold tracking-tighter inline-block py-2.5 px-[15px] bg-white rounded-[5px] ${
              index === 0
                ? 'text-color-purple'
                : 'border border-color-border-grey text-black'
            } `}
          >
            {t('cancel', { ns: 'common' })}
          </a>
          <a
            onClick={
              data.status === LessonsStatusType.APPROVED
                ? joinLesson
                : undefined
            }
            target="_blank"
            rel="noreferrer"
            className={`cursor-pointer w-full text-center sm:w-auto sm:text-left text-[15px] font-semibold tracking-tighter inline-block py-2.5 px-[15px]  rounded-[5px]
          ${
            index === 0
              ? 'text-color-purple'
              : 'border border-color-border-grey text-black'
          } ${
            data.status !== LessonsStatusType.APPROVED
              ? 'text-color-purple bg-[#b099d7]'
              : 'grey-border text-black bg-white'
          }`}
          >
            {t('join_lesson')}
          </a>
        </div>
      ) : (
        <div>
          <h1
            className={`text-[30px] font-normal ${
              index === 0 && LessonsStatusType[data?.status?.toUpperCase()]
                ? 'text-white m-0'
                : 'text-black m-0'
            }`}
          >
            {t(data.cancelReason)}
          </h1>
        </div>
      )}
      <RescheduleAndCancelModal
        data={data}
        isOpen={isOpen}
        closeModal={closeModal}
        setTabIndex={setTabIndex}
        setIsOpen={setIsOpen}
        fetchAppointments={fetchAppointments}
        tabIndex={tabIndex}
        type={modalType}
        // cancelled={cancelled}
        setCanceledLessons={setCanceledLessons}
        duration={subscription?.duration || duration}
      />
      {isWarningOpen && (
        <PlaygroundWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={closeModal}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </div>
  );
};

export default ScheduleCard;
