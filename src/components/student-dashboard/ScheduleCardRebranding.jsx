import React from 'react';
// import { useTranslation } from 'react-i18next';
// import RescheduleAndCancelModal from './RescheduleAndCancelModal';
// import ZoomWarningModal from './ZoomWarningModal';
import { useAuth } from '../../modules/auth';
import { LessonsStatusType, Roles } from '../../constants/global';
import { addMinutes } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
// import { isBetween } from '../../utils/isBetween';
import { Avatar } from 'src/widgets/Avatar/Avatar';
// import { FaPlay } from 'react-icons/fa6';
// import Button from '../Form/Button';
// import { ZoomRecordingModal } from '../ZoomRecordingModal';
// import { AdaptiveDialog } from '../AdaptiveDialog';
import StatusIndicator from './StatusIndicator';
import LessonControls from './LessonControls';

const ScheduleCard = ({
  // index,
  lesson,
  zoom,
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
  // const [isOpen, setIsOpen] = useState(false);
  // const [t] = useTranslation(['modals', 'common']);
  // const [isWarningOpen, setIsWarningOpen] = useState(false);
  // const [modalType, setModalType] = useState('');
  // const [tabIndex, setTabIndex] = useState(0);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateLesson = new Date(date); //current time zone avtomaticaly

  // function onSelect() {
  //   setIsOpen(true);

  //   setModalType(ModalType.RESCHEDULE);
  // }

  // const closeModal = () => {
  //   setIsOpen(false);
  //   setIsWarningOpen(false);
  //   setTabIndex(0);
  // };

  // const onCancel = () => {
  //   setIsOpen(true);
  //   setModalType(ModalType.CANCEL);
  // };

  // const joinLesson = () => {
  //   //Time period when you can go to the lesson
  //   if (isBetween(dateLesson, data.duration, userTimezone)) {
  //     window.open(
  //       user.role === Roles.MENTOR ? zoom.startUrl : zoom.joinUrl,
  //       '_blank',
  //     );
  //   } else {
  //     setIsWarningOpen(true);
  //   }
  // };

  const displayDate = () => {
    const eventDate = format(
      utcToZonedTime(dateLesson, userTimezone),
      'MMM, do',
      { timeZone: userTimezone },
    );
    const start = format(utcToZonedTime(dateLesson, userTimezone), 'hh:mm a', {
      timeZone: userTimezone,
    });

    const end = format(
      addMinutes(
        utcToZonedTime(dateLesson, userTimezone),
        subscription?.package?.sessionTime || duration,
      ),
      'hh:mm a',
      { timeZone: userTimezone },
    );
    return (
      <div className="text-[30px] font-normal text-black m-0 flex flex-col items-start">
        <p className="font-semibold text-lg">{eventDate}</p>
        <p className="text-sm">
          {start} - {end}
        </p>
      </div>
    );
  };

  return (
    <div
      className={`mb-5 rounded-[10px] p-5 shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)] ${
        !LessonsStatusType[data?.status?.toUpperCase()]
          ? 'bg-color-light-grey2 opacity-60'
          : 'border border-color-border-grey bg-white'
      }`}
    >
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              {displayDate()}
              {/* {statusIndicator} */}
              <StatusIndicator status={data.status} />
            </div>
            {/* TODO: add this to translation.json */}

            <div className="flex justify-between w-full gap-3">
              <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
                <label className="text-xs font-medium text-gray-300 block">
                  Package
                </label>
                {lesson}
              </div>

              {mentor ? (
                <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate flex">
                  <Avatar
                    gender={
                      user.role === Roles.MENTOR
                        ? student?.gender
                        : mentor?.gender
                    }
                    avatarUrl={
                      user.role === Roles.MENTOR
                        ? student?.avatar?.url
                        : mentor?.avatar?.url
                    }
                    className="w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9"
                  />
                  <div className=" overflow-hidden truncate">
                    <label className="text-xs font-medium text-gray-300 block">
                      Mentor
                    </label>
                    {mentor.firstName}{' '}
                    {mentor?.lastName[0] ? `${mentor?.lastName[0]}.` : ''}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
                  <label className="text-xs font-medium text-gray-300 block">
                    Duration
                  </label>
                  {duration} min.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LessonControls
        date={date}
        data={data}
        zoom={zoom}
        refetch={fetchAppointments}
        duration={subscription?.duration || duration}
        setCanceledLessons={setCanceledLessons}
      />
      {/* <div
        className={`grid gap-2 xl:gap-3 h-[52px] ${
          data.status === LessonsStatusType.SCHEDULED ||
          data.status === LessonsStatusType.APPROVED
            ? 'grid-cols-3'
            : 'grid-cols-3 sm:grid-cols-2'
        }`}
      >
        {data.status === LessonsStatusType.APPROVED && (
          <Button onClick={joinLesson}>{t('join_lesson')}</Button>
        )}

        {data.status === LessonsStatusType.COMPLETED && (
          <AdaptiveDialog
            button={
              <Button
                // TODO: implement onClick
                disabled={!zoom.recordingUrl}
                className={`grow gap-1 sm:gap-2 col-span-2`}
              >
                <FaPlay />
                {t('watch_recording')}
              </Button>
            }
          >
            <ZoomRecordingModal
              urlRecording={zoom.recordingUrl}
              width="sm:70vw"
            />
          </AdaptiveDialog>
        )}

        {data.status !== LessonsStatusType.APPROVED && (
          <Button
            // TODO: implement onClick
            disabled
            theme="dark_purple"
          >
            Info
          </Button>
        )}

        {(data.status === LessonsStatusType.SCHEDULED ||
          data.status === LessonsStatusType.APPROVED) && (
          <Button theme="dark_purple" onClick={onSelect}>
            {t('reschedule')}
          </Button>
        )}

        {data.status !== LessonsStatusType.COMPLETED && (
          <Button theme="red" onClick={onCancel}>
            {t('cancel', { ns: 'common' })}
          </Button>
        )}
      </div> */}
      {/* 
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
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={closeModal}
          setIsWarningOpen={setIsWarningOpen}
        />
      )} */}
    </div>
  );
};

export default ScheduleCard;
