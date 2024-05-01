import React from 'react';
import LessonControls from './LessonControls';
import { addMinutes, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import StatusIndicator from './StatusIndicator';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { PlaygroundRecordingModal } from '../PlaygroundRecordingModal';
import { useAuth } from 'src/modules/auth';
import { useCourseDetails } from 'src/utils/useCourseDetails';
import { useTranslation } from 'react-i18next';
import { Roles, localeDic } from 'src/constants/global';
import Indicator from '../Indicator';
import { PiStarFourFill } from 'react-icons/pi';

const LessonInfoModal = ({
  date,
  data,
  playground,
  refetch,
  duration,
  setCanceledLessons,
  userTimezone,
}) => {
  const { getTitleByCourseId } = useCourseDetails();
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const { user, currentStudent } = useAuth();

  const userToDisplay =
    user.role === Roles.MENTOR ? data?.student : data?.mentor;

  return (
    <div className="sm:min-w-[400px] max-w-[520px] w-full bg-white">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-color-dark-purple">
            {format(
              utcToZonedTime(new Date(date), userTimezone),
              'eee, MMM do',
              { timeZone: userTimezone, locale: localeDic[i18n.language] },
            )}
          </h2>
          <p>
            {format(utcToZonedTime(new Date(date), userTimezone), 'hh:mm a', {
              timeZone: userTimezone,
              locale: localeDic[i18n.language],
            })}
            {' - '}
            {format(
              addMinutes(
                utcToZonedTime(new Date(date), userTimezone),
                duration,
              ),
              'hh:mm a',
              { timeZone: userTimezone, locale: localeDic[i18n.language] },
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {data.isTrial && (
            <Indicator className="bg-green-300 text-green-500">
              <PiStarFourFill /> {t('trial', { ns: 'common' })}
            </Indicator>
          )}

          <StatusIndicator status={data.status} />
        </div>
      </header>

      {playground ? (
        <PlaygroundRecordingModal urlRecording={playground?.recordingUrl} />
      ) : (
        <LessonControls
          date={date}
          data={data}
          refetch={refetch}
          duration={duration}
          setCanceledLessons={setCanceledLessons}
        />
      )}

      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t">
        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
          <label className="text-xs font-medium text-gray-300 block">
            {t('lesson_package')}
          </label>
          {getTitleByCourseId(data?.packageSubscription?.package?.course?.id)}
        </div>

        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate flex">
          <Avatar
            avatarUrl={userToDisplay?.avatar?.url}
            className="w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9"
          />
          <div className=" overflow-hidden truncate">
            <label className="text-xs font-medium text-gray-300 block">
              {user.role === Roles.MENTOR ? t('student') : t('mentor')}
            </label>
            {userToDisplay?.firstName}{' '}
            {userToDisplay?.lastName[0] ? `${userToDisplay?.lastName[0]}.` : ''}
          </div>
        </div>

        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
          <label className="text-xs font-medium text-gray-300 block">
            {t('level')}
          </label>
          {data?.student?.languageLevel?.title ??
            data?.student?.langLevel ??
            currentStudent?.languageLevel?.title}
        </div>

        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
          <label className="text-xs font-medium text-gray-300 block">
            {t('duration')}
          </label>
          {duration} {t('minutes', { ns: 'common' })}
        </div>
      </div>
    </div>
  );
};

export default LessonInfoModal;
