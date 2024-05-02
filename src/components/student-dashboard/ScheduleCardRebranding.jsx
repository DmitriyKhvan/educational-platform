import React from 'react';
import { useAuth } from '../../modules/auth';
import { LessonsStatusType, Roles, localeDic } from '../../constants/global';
import { addMinutes } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import StatusIndicator from './StatusIndicator';
import LessonControls from './LessonControls';
import { useCourseDetails } from 'src/utils/useCourseDetails';
import { useTranslation } from 'react-i18next';
import { MdEventRepeat } from 'react-icons/md';
import Indicator from '../Indicator';
import { PiStarFourFill } from 'react-icons/pi';

const ScheduleCard = ({
  // lesson,
  date, //utc +0
  student,
  mentor,
  data,
  fetchAppointments,
  setCanceledLessons,
  duration,
  subscription,
  repeat = null,
}) => {
  const { getTitleByCourseId } = useCourseDetails();
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateLesson = new Date(date); //current time zone avtomaticaly

  const displayDate = () => {
    const eventDate = format(
      utcToZonedTime(dateLesson, userTimezone),
      'MMM, do',
      { timeZone: userTimezone, locale: localeDic[i18n.language] },
    );
    const start = format(utcToZonedTime(dateLesson, userTimezone), 'hh:mm a', {
      timeZone: userTimezone,
      locale: localeDic[i18n.language],
    });

    const end = format(
      addMinutes(
        utcToZonedTime(dateLesson, userTimezone),
        subscription?.package?.sessionTime || duration,
      ),
      'hh:mm a',
      { timeZone: userTimezone, locale: localeDic[i18n.language] },
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
              {repeat ? (
                <div className="text-color-purple flex items-center text-sm gap-2">
                  <MdEventRepeat className="text-[20px]" /> For {repeat}{' '}
                  month(s)
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {data.isTrial && (
                    <Indicator className="bg-green-300 text-green-500">
                      <PiStarFourFill /> {t('trial', { ns: 'common' })}
                    </Indicator>
                  )}

                  <StatusIndicator status={data.status} />
                </div>
              )}
            </div>
            {/* TODO: add this to translation.json */}

            <div className="flex justify-between w-full gap-3">
              <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
                <label className="text-xs font-medium text-gray-300 block">
                  {t('lesson_package')}
                </label>
                {getTitleByCourseId(data.packageSubscription.package.course.id)}
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
                      {t('mentor')}
                    </label>
                    {mentor.firstName}{' '}
                    {mentor?.lastName[0] ? `${mentor?.lastName[0]}.` : ''}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
                  <label className="text-xs font-medium text-gray-300 block">
                    {t('duration')}
                  </label>
                  {duration} {t('minutes', { ns: 'common' })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LessonControls
        date={date}
        data={data}
        refetch={fetchAppointments}
        duration={subscription?.duration || duration}
        setCanceledLessons={setCanceledLessons}
        pattern="info"
      />
    </div>
  );
};

export default ScheduleCard;
