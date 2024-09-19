import React from 'react';
import { useAuth } from 'src/app/providers/AuthProvider';
import {
  LessonsStatusType,
  Roles,
  localeDic,
} from '../../shared/constants/global';
import { addMinutes } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import StatusIndicator from './StatusIndicator';
import LessonControls from './LessonControls';
import { useTranslation } from 'react-i18next';
import { MdEventRepeat } from 'react-icons/md';
import Indicator from '../Indicator';
import { PiStarFourFill } from 'react-icons/pi';
import { cn } from 'src/shared/utils/functions';
import LabelBox from './LabelBox';
import { getTranslatedTitle } from 'src/shared/utils/getTranslatedTitle';

const ScheduleCard = ({
  // lesson,
  date, //utc +0
  student,
  mentor,
  data,
  fetchAppointments,
  duration,
  subscription,
  repeat = null,
}) => {
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const { user } = useAuth();
  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const userToDisplay =
    user.role === Roles.MENTOR
      ? (student ?? data?.student)
      : (mentor ?? data?.mentor);

  const dateLesson = new Date(date); //current time zone avtomaticaly

  const displayDate = () => {
    const eventDate = format(toZonedTime(dateLesson, userTimezone), 'MMM, do', {
      timeZone: userTimezone,
      locale: localeDic[i18n.language],
    });
    const start = format(toZonedTime(dateLesson, userTimezone), 'hh:mm a', {
      timeZone: userTimezone,
      locale: localeDic[i18n.language],
    });

    const end = format(
      addMinutes(
        toZonedTime(dateLesson, userTimezone),
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

            <div className="flex justify-between w-full gap-3">
              <LabelBox
                label={t('lesson_package')}
                content={getTranslatedTitle(
                  data?.packageSubscription?.package?.course,
                  i18n.language,
                )}
              />

              {mentor ? (
                <LabelBox
                  preElement={
                    <Avatar
                      avatarUrl={userToDisplay?.avatar?.url}
                      fallback={user.role === Roles.MENTOR ? 'duck' : 'user'}
                      className={cn(
                        'w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9',
                        user.role === Roles.MENTOR && 'bg-color-purple',
                      )}
                    />
                  }
                  label={
                    user.role === Roles.MENTOR ? t('student') : t('mentor')
                  }
                  content={
                    <>
                      {userToDisplay?.firstName}{' '}
                      {userToDisplay?.lastName[0]
                        ? `${userToDisplay?.lastName[0]}.`
                        : ''}
                    </>
                  }
                />
              ) : (
                <LabelBox
                  label={t('duration')}
                  content={`${duration} ${t('minutes', { ns: 'common' })}`}
                />
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
        pattern="info"
      />
    </div>
  );
};

export default ScheduleCard;
