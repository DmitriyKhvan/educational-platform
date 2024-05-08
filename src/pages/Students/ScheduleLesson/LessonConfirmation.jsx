import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationManager from '../../../components/NotificationManager';
import Layout from '../../../layouts/DashboardLayout';
import ScheduleCard from './ScheduleCard';
import Loader from '../../../components/common/Loader';
import { useAuth } from '../../../modules/auth';
import LessonCard from './LessonCard';
import { useMutation } from '@apollo/client';
import {
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
} from '../../../modules/auth/graphql';

import CheckboxField from '../../../components/Form/CheckboxField';
import { getItemToLocalStorage } from 'src/constants/global';
import Button from 'src/components/Form/Button';
import MentorImageRow from './MentorImageRow';
import { utcToZonedTime, format } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import { IoArrowBack } from 'react-icons/io5';
import koLocale from 'date-fns/locale/ko';
import { useHistory } from 'react-router-dom';
import notify from 'src/utils/notify';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { AiOutlineInfo } from 'react-icons/ai';
import NotEnoughCreditsModal from './NotEnoughCreditsModal';
import { notEnoughCredits } from 'src/utils/notEnoughCredits';
import { getTranslatedTitle } from 'src/utils/getTranslatedTitle';

const LessonConfirmation = ({
  plan,
  mentor,
  time,
  setTabIndex,
  lessonId = null,
  isMentorScheduled = false,
  setCreatedLessons,
  repeat,
  setRepeat,
}) => {
  const history = useHistory();
  const [t, i18n] = useTranslation([
    'common',
    'lessons',
    'dashboard',
    'translations',
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [credits, setCredits] = useState(plan?.credits);
  const [canceledLessons] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const { user, currentStudent } = useAuth();
  const [newAppointment, setNewAppointment] = useState([]);

  const [createAppointment] = useMutation(CREATE_APPOINTMENT);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  useEffect(() => {
    // leave only scheduled lessons
    if (canceledLessons) {
      const appointments = newAppointment.filter(
        (appointment) =>
          !canceledLessons.some((lesson) => lesson.id === appointment.id),
      );
      setNewAppointment(appointments);

      // remaining credits
      setCredits((prev) => prev + canceledLessons.length);
    }
  }, [canceledLessons]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scheduleDate = format(
    utcToZonedTime(new Date(time), userTimezone),
    'eeee, MMM dd',
    {
      locale: i18n.language === 'kr' ? koLocale : undefined,
    },
  );
  const scheduleStartTime = format(
    utcToZonedTime(new Date(time), userTimezone),
    'hh:mm a',
    {
      locale: i18n.language === 'kr' ? koLocale : undefined,
    },
  );
  const scheduleEndTime = format(
    addMinutes(
      utcToZonedTime(new Date(time), userTimezone),
      plan?.package?.sessionTime,
    ),
    'hh:mm a',
    {
      locale: i18n.language === 'kr' ? koLocale : undefined,
    },
  );

  const utcIsoTimeString = new Date(time).toISOString();

  const confirmLesson = async (confirmedNotEnough = false) => {
    if (
      repeat &&
      !confirmedNotEnough &&
      notEnoughCredits(plan.credits, repeat)
    ) {
      setOpenModal(true);
      return;
    }
    setIsLoading(true);

    /* this means if the lesson ID exists, its going to be a reschedule */
    try {
      if (lessonId) {
        await updateAppointment({
          variables: {
            id: lessonId,
            mentorId: mentor.id,
            startAt: utcIsoTimeString,
            repeat: repeat,
          },
        });
        notify(t('lesson_rescheduled', { ns: 'lessons' }));
        history.push('/student/lesson-calendar');
      } else {
        const {
          data: { lesson: createdLesson },
        } = await createAppointment({
          variables: {
            mentorId: mentor.id,
            studentId: getItemToLocalStorage('studentId'),
            subscriptionId: plan?.id,
            startAt: utcIsoTimeString,
            duration: plan?.package?.sessionTime,
            repeat: repeat,
          },
        });
        setTabIndex(5);
        setCreatedLessons(
          createdLesson.sort(
            (a, b) => new Date(a.startAt) - new Date(b.startAt),
          ),
        );
      }
    } catch (error) {
      NotificationManager.error(error.message, t);
    } finally {
      setIsLoading(false);
    }
  };

  const repeatLessonLabel = (monthCount) =>
    t('repeat_lesson', {
      ns: 'lessons',
      weekDay: format(new Date(time), 'eeee', {
        locale: i18n.language === 'kr' ? koLocale : undefined,
      }),
      count: monthCount,
    });

  return (
    <Layout>
      <div className="flex flex-wrap lg:flex-nowrap min-h-full">
        <div className="grow max-w-[488px] mx-auto">
          <div className="flex items-center gap-3">
            <button
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

          <div>
            <p className="mt-10 mb-3 sm:mb-4 text-sm text-color-light-grey">
              {t('lesson_topic', { ns: 'lessons' })}
            </p>
            <div className="flex">
              <LessonCard
                setTabIndex={setTabIndex}
                lesson={getTranslatedTitle(
                  plan?.package?.course,
                  i18n.language,
                )}
                duration={`${plan?.package?.sessionTime} ${t('minutes', {
                  ns: 'common',
                })}`}
                remaining={credits}
                total={plan?.package?.totalSessions}
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

          {!lessonId && !currentStudent?.isTrial && (
            <div className="my-10">
              <CheckboxField
                label={repeatLessonLabel(1)}
                onChange={(e) => setRepeat(e.target.checked ? 1 : null)}
                checked={repeat === 1}
                className="mb-6"
              />

              <CheckboxField
                label={repeatLessonLabel(3)}
                onChange={(e) => setRepeat(e.target.checked ? 3 : null)}
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
            <NotEnoughCreditsModal
              confirmLesson={confirmLesson}
              repeat={repeat}
            />
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
      {isLoading && <Loader />}
    </Layout>
  );
};

export default LessonConfirmation;
