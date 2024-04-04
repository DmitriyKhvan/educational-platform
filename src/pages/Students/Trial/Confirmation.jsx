import React, { useEffect } from 'react';
import { FaArrowLeft, FaPencil } from 'react-icons/fa6';
import Button from 'src/components/Form/Button';

import { ko as kr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import { TRIAL_SIGN_UP } from 'src/modules/graphql/mutations/trial/trialSignUp';
import { useMutation } from '@apollo/client';
import useLogin from 'src/modules/auth/hooks/login';
import notify from 'src/utils/notify';
import { useAuth } from 'src/modules/auth';
import { ATTACH_TRIAL_STUDENT_TO_USER_RESOLVER } from 'src/modules/graphql/mutations/trial/attachTrialStudentToUserResolver';
import { setItemToLocalStorage } from 'src/constants/global';

const Confirmation = ({ setStep, user, selectedPlan, schedule, mentorId }) => {
  const { user: currentUser } = useAuth();
  const { languageLevel, lessonTopic, packageSubscription } = selectedPlan;
  const { refetchUser } = useAuth();

  const [i18n] = useTranslation();
  const [signUp] = useMutation(TRIAL_SIGN_UP);
  const [addTrialUser] = useMutation(ATTACH_TRIAL_STUDENT_TO_USER_RESOLVER);

  const { login, data: loginData } = useLogin();

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const dateParse = utcToZonedTime(new Date(schedule), user.timeZone);

  const dayFormat = format(dateParse, 'EEEE, MMM dd', {
    locale: locale,
    timeZone: user.timeZone,
  });

  const scheduleStartTimeFormat = format(dateParse, 'hh:mm a', {
    timeZone: user.timeZone,
  });

  const scheduleEndTimeFormat = format(
    addMinutes(dateParse, packageSubscription.sessionTime),
    'hh:mm a',
    {
      timeZone: user.timeZone,
    },
  );

  const trialSignUp = async () => {
    try {
      if (currentUser) {
        const trialUserData = await addTrialUser({
          variables: {
            data: {
              user: {
                userId: currentUser.id,
                firstName: user.firstName,
                lastName: user.lastName,
              },
              packageId: parseInt(packageSubscription.id),
              languageLevelId: parseInt(languageLevel.id),
              lessonTopicId: parseInt(lessonTopic.id),
              lessonBooking: {
                mentorId,
                startAt: new Date(schedule),
              },
            },
          },
        });

        setItemToLocalStorage(
          'studentId',
          trialUserData?.data?.attachTrialStudentToUserResolver?.id,
        );
        location.href = '/student/manage-lessons';
      } else {
        await signUp({
          variables: {
            data: {
              user,
              packageId: parseInt(packageSubscription.id),
              languageLevelId: parseInt(languageLevel.id),
              lessonTopicId: parseInt(lessonTopic.id),
              lessonBooking: {
                mentorId,
                startAt: new Date(schedule),
              },
            },
          },
        });

        await login(user.email, user.password);
      }
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  useEffect(() => {
    if (loginData) {
      setItemToLocalStorage(
        'studentId',
        loginData.authResult.user.students[0].id,
      );

      refetchUser({ studentId: loginData.authResult.user.students[0].id });
      setStep((v) => v + 1);
    }
  }, [loginData]);

  return (
    <div className="">
      <div className="mb-2 flex items-center">
        <FaArrowLeft
          className="mr-3 w-[20px] h-[20px] cursor-pointer"
          onClick={() => setStep((v) => v - 1)}
        />{' '}
        <h1 className="text-3xl font-semibold">Confirmation</h1>
      </div>

      <p className="mb-8">Please ensure that everything below is correct</p>

      <section className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-4">
          Your contact information
        </p>
        <div className="w-full border rounded-lg p-5 flex justify-between items-center">
          <div>
            <label className="mb-4 block">
              <span className="text-[13px] text-gray-400 mb-2">
                English name of student
              </span>
              <p className="text-gray-950 font-medium">{user.firstName}</p>
            </label>

            <label className="mb-4 block">
              <span className="text-[13px] text-gray-400 mb-2">Email</span>
              <p className="text-gray-950 font-medium">{user.email}</p>
            </label>
            <label>
              <span className="text-[13px] text-gray-400 mb-2">
                Phone number
              </span>
              <p className="text-gray-950 font-medium">{user.phoneNumber}</p>
            </label>
          </div>
          <div
            onClick={() => setStep(-1)}
            className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors"
          >
            <FaPencil className="text-color-purple w-3 h-3" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-4">Lesson details</p>
        <div className="w-full border rounded-lg p-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg mb-5">
              {packageSubscription.course.title}
            </h3>
            <div className="flex gap-6">
              <label className="block">
                <span className="text-[13px] text-gray-400">Level</span>
                <p className="text-gray-950 font-medium">
                  {languageLevel.title}
                </p>
              </label>

              <label className="block">
                <span className="text-[13px] text-gray-400">Topic</span>
                <p className="text-gray-950 font-medium">{lessonTopic.title}</p>
              </label>
            </div>
          </div>
          <div
            onClick={() => setStep(0)}
            className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors"
          >
            <FaPencil className="text-color-purple w-3 h-3" />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <p className="text-sm text-gray-400 font-medium mb-4">Date and Time</p>
        <div className="w-full border rounded-lg p-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg mb-4">{`${scheduleStartTimeFormat} - ${scheduleEndTimeFormat}`}</h3>
            <p>{dayFormat}</p>
          </div>
          <div
            onClick={() => setStep(1)}
            className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors"
          >
            <FaPencil className="text-color-purple w-3 h-3" />
          </div>
        </div>
      </section>

      <Button className="w-full h-14 sm:h-16 my-10" onClick={trialSignUp}>
        Continue
      </Button>
    </div>
  );
};

export default Confirmation;
