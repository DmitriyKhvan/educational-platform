import LessonControls from './LessonControls';
import { addMinutes, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import StatusIndicator from './StatusIndicator';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { PlaygroundRecordingModal } from '../PlaygroundRecordingModal';
import { useAuth } from 'src/app/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Roles, localeDic } from 'src/shared/constants/global';
import Indicator from '../Indicator';
import { PiStarFourFill } from 'react-icons/pi';
import { cn } from 'src/shared/utils/functions';
import LabelBox from './LabelBox';
import { getTranslatedTitle } from 'src/shared/utils/getTranslatedTitle';

const LessonInfoModal = ({
  date,
  data,
  playground,
  refetch,
  duration,
  setCanceledLessons,
  userTimezone,
}) => {
  const [t, i18n] = useTranslation(['lessons', 'common', 'trial']);
  const { user, currentStudent } = useAuth();

  const userToDisplay =
    user.role === Roles.MENTOR ? data?.student : data?.mentor;

  return (
    <div className="sm:min-w-[400px] max-w-[520px] w-full bg-white">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-color-dark-purple">
            {format(toZonedTime(new Date(date), userTimezone), 'eee, MMM do', {
              timeZone: userTimezone,
              locale: localeDic[i18n.language],
            })}
          </h2>
          <p>
            {format(toZonedTime(new Date(date), userTimezone), 'hh:mm a', {
              timeZone: userTimezone,
              locale: localeDic[i18n.language],
            })}
            {' - '}
            {format(
              addMinutes(toZonedTime(new Date(date), userTimezone), duration),
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
        <LabelBox
          label={t('lesson_package')}
          content={getTranslatedTitle(
            data?.packageSubscription?.package?.course,
            i18n.language,
          )}
        />

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
          label={user.role === Roles.MENTOR ? t('student') : t('mentor')}
          content={
            <>
              {userToDisplay?.firstName}{' '}
              {userToDisplay?.lastName[0]
                ? `${userToDisplay?.lastName[0]}.`
                : ''}
            </>
          }
        />

        <LabelBox
          label={t('level')}
          content={
            getTranslatedTitle(data?.languageLevel, i18n.language) ??
            getTranslatedTitle(data?.student?.languageLevel, i18n.language) ??
            getTranslatedTitle(currentStudent?.languageLevel, i18n.language) ??
            data?.student?.langLevel ??
            ''
          }
        />

        <LabelBox
          label={t('duration')}
          content={`${duration} ${t('minutes', { ns: 'common' })}`}
        />

        {data?.isTrial && (
          <LabelBox
            label={t('lesson_topic', { ns: 'trial' })}
            content={getTranslatedTitle(data?.topic, i18n.language)}
          />
        )}

        {user.role === Roles.MENTOR && (
          <LabelBox
            label={t('student_email', { ns: 'lessons' })}
            content={userToDisplay?.user?.email}
          />
        )}
      </div>
    </div>
  );
};

export default LessonInfoModal;
