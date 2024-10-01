import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/common/loader';
import LessonCard from '@/pages/students/schedule-lesson/lesson-card';
import ScheduleCard from '@/pages/students/schedule-lesson/schedule-card';
import { UPDATE_APPOINTMENT } from '@/shared/apollo/graphql';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import MentorImageRow from '@/pages/students/schedule-lesson/mentor-image-row';
import NotEnoughCreditsModal from '@/pages/students/schedule-lesson/not-enough-credits-modal';
import { getItemToLocalStorage, localeDic } from '@/shared/constants/global';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { getTranslatedTitle } from '@/shared/utils/get-translated-title';
import { notEnoughCredits } from '@/shared/utils/not-enough-credits';
import notify from '@/shared/utils/notify';
import type {
  AvailabilitySlot,
  Lesson,
  Mentor,
  Mutation,
  PackageSubscription,
} from '@/types/types.generated';

import { format, toZonedTime } from 'date-fns-tz';
import { AiOutlineInfo } from 'react-icons/ai';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useCreateLessonsMutation } from '@/shared/apollo/mutations/lessons/create-lessons.generated';
import { parse } from 'date-fns';

interface LessonConfirmationProps {
  plan?: PackageSubscription;
  mentor: Mentor;
  slot: AvailabilitySlot;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  lessonId?: string | null;
  isMentorScheduled?: boolean;
  setCreatedLessons: React.Dispatch<React.SetStateAction<Lesson[] | undefined>>;
  repeat: number;
  setRepeat: React.Dispatch<React.SetStateAction<number | null>>;
}

const LessonConfirmation: React.FC<LessonConfirmationProps> = ({
  plan,
  mentor,
  slot,
  setTabIndex,
  lessonId,
  isMentorScheduled = false,
  setCreatedLessons,
  repeat,
  setRepeat,
}) => {
  const navigate = useNavigate();
  const [t, i18n] = useTranslation(['common', 'lessons', 'dashboard', 'translations']);

  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, currentStudent } = useAuth();

  const [createLessons] = useCreateLessonsMutation();

  const [updateAppointment] = useMutation<
    Mutation,
    { id: string; mentorId: string; startAt: string; repeat: number }
  >(UPDATE_APPOINTMENT);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userTimezone =
    user?.timeZone?.split(' ')[0] || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scheduleDate = format(new Date(slot.date), 'eeee, MMM dd', {
    locale: localeDic[i18n.language as keyof typeof localeDic],
  });
  const scheduleStartTime = format(new Date(`${slot.date}T${slot.from}:00`), 'hh:mm a', {
    locale: localeDic[i18n.language as keyof typeof localeDic],
  });
  const scheduleEndTime = format(new Date(`${slot.date}T${slot.to}:00`), 'hh:mm a', {
    locale: localeDic[i18n.language as keyof typeof localeDic],
  });

  const dateParse = parse(
    `${slot.date} ${slot.from}`,
    'yyyy-MM-dd HH:mm',
    toZonedTime(new Date(), userTimezone),
  );

  const selectedSchedule = format(dateParse, 'EEE MMM dd yyyy HH:mm:ss XXX', {
    timeZone: userTimezone,
  });

  const utcIsoTimeString = new Date(selectedSchedule).toISOString();

  const confirmLesson = async (confirmedNotEnough = false) => {
    if (repeat && !confirmedNotEnough && notEnoughCredits(plan?.credits || 0, repeat)) {
      setOpenModal(true);
      return;
    }
    setIsLoading(true);

    try {
      if (lessonId) {
        await updateAppointment({
          variables: {
            id: lessonId,
            mentorId: mentor.id,
            startAt: utcIsoTimeString,
            repeat,
          },
        });
        notify(t('lesson_rescheduled', { ns: 'lessons' }));
        navigate('/student/lesson-calendar');
      } else {
        const { data } = await createLessons({
          variables: {
            mentorId: mentor.id,
            studentId: getItemToLocalStorage('studentId', ''),
            packageSubscriptionId: plan?.id || '',
            startAt: utcIsoTimeString,
            duration: plan?.package?.sessionTime ?? 0,
            repeat,
          },
        });

        setTabIndex(5);
        setCreatedLessons(
          data?.createLessons.sort(
            (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
          ),
        );
      }
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const repeatLessonLabel = (monthCount: number) =>
    t('repeat_lesson', {
      ns: 'lessons',
      weekDay: format(new Date(selectedSchedule), 'eeee', {
        locale: localeDic[i18n.language as keyof typeof localeDic],
      }),
      count: monthCount,
    });

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-wrap lg:flex-nowrap min-h-full">
        <div className="grow max-w-[488px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setTabIndex(isMentorScheduled ? 2 : 3);
              }}
            >
              <IoArrowBack className="text-2xl" />
            </button>
            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
              {t('confirmation', { ns: 'lessons' })}
            </h1>
          </div>

          <p className="text-sm text-color-light-grey mt-[15px]">
            {t('confirmation_subtitle', { ns: 'lessons' })}
          </p>

          {!currentStudent?.isTrial && (
            <div>
              <p className="mt-6 mb-3 sm:mb-4 text-sm text-color-light-grey">
                {t('mentor', { ns: 'lessons' })}
              </p>
              <div className="flex">
                <MentorImageRow
                  setTabIndex={setTabIndex}
                  mentor={mentor}
                  isMentorScheduled={isMentorScheduled}
                />
              </div>
            </div>
          )}

          <div>
            <p className="mt-6 mb-3 sm:mb-4 text-sm text-color-light-grey">
              {t('lesson_topic', { ns: 'lessons' })}
            </p>
            <div className="flex">
              <LessonCard
                setTabIndex={setTabIndex}
                lesson={getTranslatedTitle(plan?.package?.course || {}, i18n.language)}
                duration={`${plan?.package?.sessionTime} ${t('minutes', {
                  ns: 'common',
                })}`}
                remaining={plan?.credits || 0}
                total={plan?.package?.totalSessions || 0}
              />
            </div>
          </div>

          <div>
            <p className="mt-6 mb-3 sm:mb-4 text-sm text-color-light-grey">
              {t('date_time', { ns: 'lessons' })}
            </p>
            <div className="flex">
              <ScheduleCard
                setTabIndex={setTabIndex}
                startTime={scheduleStartTime}
                endTime={scheduleEndTime}
                date={scheduleDate}
              />
            </div>
          </div>

          {!lessonId && !currentStudent?.isTrial && (
            <div className="my-10">
              <CheckboxField
                label={repeatLessonLabel(1)}
                onChange={(e) => setRepeat(e.target.checked ? 1 : 0)}
                checked={repeat === 1}
                className="mb-6"
              />

              <CheckboxField
                label={repeatLessonLabel(3)}
                onChange={(e) => setRepeat(e.target.checked ? 3 : 0)}
                checked={repeat === 3}
              />
            </div>
          )}

          {lessonId && !!repeat && (
            <div className="mt-10">
              <div className="mx-auto mb-4 bg-color-purple bg-opacity-10 rounded-lg flex gap-4 items-center p-4">
                <span className="w-5 h-5 bg-color-purple rounded-full flex justify-center items-center">
                  <AiOutlineInfo className="text-white" />
                </span>
                <p className="w-[340px] text-color-purple">
                  You are rescheduling <b>All Upcoming Lessons</b>
                </p>
              </div>
            </div>
          )}

          <AdaptiveDialog open={openModal} setOpen={setOpenModal}>
            <NotEnoughCreditsModal confirmLesson={confirmLesson} repeat={repeat} />
          </AdaptiveDialog>

          <Button
            className="w-full text-xl h-auto p-[18px] mt-10"
            theme="purple"
            onClick={() => confirmLesson()}
          >
            {t('booking_lesson', { ns: 'lessons' })}
          </Button>
        </div>
      </div>
    </>
  );
};

export default LessonConfirmation;
