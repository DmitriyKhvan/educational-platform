import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../../modules/auth';
import { useQuery } from '@apollo/client';
// import { useMutation, useQuery } from '@apollo/client';
import {
  // ALL_PACKAGE_QUERY,
  // MUTATION_UPDATE_STUDENT,
  PACKAGE_QUERY,
} from '../../../../modules/auth/graphql';
import { useTranslation } from 'react-i18next';
// import Introduction from './Introduction';
// import Button from '../../../../components/Form/Button/Button';
import { Avatar } from '../../../../widgets/Avatar/Avatar';
// import notify from '../../../../utils/notify';
// import ModalWrapper from '../../../../components/ModalWrapper/ModalWrapper';
// import EditProflileStudent from '../editInfo/EditStudentProfile';
// import ReactLoader from '../../../../components/common/Loader';
// import { getItemToLocalStorage } from 'src/constants/global';
import { getItemToLocalStorage } from 'src/constants/global';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { FaPencil } from 'react-icons/fa6';
import Button from 'src/components/Form/Button';
import { FiLogOut } from 'react-icons/fi';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import LevelBadge from './LevelBadge';

const StudentProfile = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [t] = useTranslation(['profile', 'common', 'lessons', 'modals']);

  // const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);

  const { user, currentStudent, logout } = useAuth();
  // const { user, refetchUser, currentStudent } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.Intercom('shutdown');
    window.location.reload(true);
  };

  const { data: { packageSubscriptions: planStatus } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      variables: {
        studentId: getItemToLocalStorage('studentId'),
      },
    },
  );

  // console.log(planStatus, 'planStatus');

  // const saveIntroduction = async (text) => {
  //   if (text !== '') {
  //     const { data } = await updateStudent({
  //       variables: {
  //         // id: parseInt(user?.student?.id),
  //         id: parseInt(getItemToLocalStorage('studentId')),
  //         data: {
  //           about: text,
  //         },
  //       },
  //     });

  //     if (data) {
  //       notify(t('introduction_changed', { ns: 'profile' }));
  //     }

  //     await refetchUser();
  //   }
  // };

  // const getCompleteLessons = (lessons) => {
  //   return lessons.filter(
  //     (lesson) =>
  //       lesson.status === LessonsStatusType.COMPLETED ||
  //       lesson.status === LessonsStatusType.PAID,
  //   ).length;
  // };

  const [uncompletedPackages, completedPackages] = useMemo(
    () => [
      planStatus?.filter((x) => x.credits),
      planStatus?.filter((x) => !x.credits),
    ],
    [planStatus],
  );

  console.log(completedPackages);

  return (
    <>
      {/* {loading && <ReactLoader className="fixed !important" />} */}
      <div className="flex flex-col min-h-[calc(100vh-120px)] mt-10">
        <div className="w-full px-6 max-w-[448px] mx-auto space-y-8">
          <header className="flex items-center w-full space-x-4 ">
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              <Avatar
                avatarUrl={user?.avatar?.url}
                className="w-full h-full min-w-16 sm:min-w-20 rounded-full border"
              />
            </div>
            <div className="w-full h-auto py-2">
              <div className="flex justify-between ml-auto w-full">
                <div className="flex justify-between w-full">
                  <div>
                    <h2 className="text-[20px] sm:text-[24px] font-bold leading-9 tracking-[-1px] text-color-dark-purple">
                      {user?.firstName + ' '}
                      {user?.lastName}
                    </h2>
                    <Link
                      to="/student/profile/edit"
                      className="text-color-purple flex items-center gap-2 hover:underline font-medium text-[13px] sm:text-sm"
                    >
                      <FaPencil /> {t('edit_profile')}
                    </Link>
                  </div>

                  <div>
                    <LevelBadge level={currentStudent?.langLevel} />
                  </div>
                  {/* <p className="text-base font-semibold tracking-[-0.6px] text-color-purple ">
                    {currentStudent?.langLevel}
                  </p> */}

                  {/* <p className="text-base font-semibold tracking-[-0.6px] text-color-light-grey">
                    {user?.timeZone ? user?.timeZone : 'PST (GMT-8)'}
                  </p> */}
                </div>

                {/* <div>
                  <Button
                    className="mr-4"
                    theme="outline"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    {t('edit_profile')}
                  </Button>
                </div> */}
              </div>
            </div>
          </header>

          <div className="w-full ">
            <h2 className="text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
              {t('add_details')}
            </h2>

            <div className="flex flex-col gap-5 mt-5">
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('email')}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                  {user?.email}
                </p>
              </div>

              {user?.koreanEquivalent && (
                <div className="flex justify-between border-b">
                  <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                    {t('korean_name')}
                  </h4>
                  <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                    {user?.koreanEquivalent}
                  </p>
                </div>
              )}

              {user?.gender && (
                <div className="flex justify-between border-b">
                  <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                    {t('gender')}
                  </h4>
                  <p className="font-medium text-sm text-color-dark-purple  leading-6 tracking-[-0.6px]">
                    {user?.gender}
                  </p>
                </div>
              )}

              {user?.country && (
                <div className="flex justify-between border-b">
                  <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                    {t('country', { ns: 'common' })}
                  </h4>
                  <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                    {user?.country ? user?.country : 'Korea'}
                  </p>
                </div>
              )}

              {user?.address && (
                <div className="flex justify-between border-b">
                  <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                    {t('address', { ns: 'common' })}
                  </h4>
                  <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                    {user?.address}
                  </p>
                </div>
              )}

              {user?.phoneNumber && (
                <div className="flex justify-between border-b">
                  <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                    {t('phone_number', { ns: 'common' })}
                  </h4>
                  <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                    {user?.phoneNumber}
                  </p>
                </div>
              )}

              {user?.timeZone && (
                <div className="flex justify-between border-b">
                  <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                    {t('time_zone', { ns: 'common' })}
                  </h4>
                  <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                    {user?.timeZone ? user?.timeZone : 'PST (GMT-8)'}
                  </p>
                </div>
              )}

              {/* <p className="text-base font-semibold tracking-[-0.6px] text-color-light-grey">
                {user?.timeZone ? user?.timeZone : 'PST (GMT-8)'}
              </p> */}
            </div>
          </div>
        </div>

        {/* <Introduction
            text={currentStudent.about}
            onChange={saveIntroduction}
          /> */}

        <div className="mt-[30px] max-w-[448px] px-6 w-full mx-auto">
          <h2 className="mb-4 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
            {t('enrolled_courses')}
          </h2>
          {uncompletedPackages &&
            uncompletedPackages.map((item) => (
              <div
                key={item.id}
                className="w-full p-5 bg-white border border-solid mb-2 border-color-border-grey shadow-sm rounded-[10px]"
              >
                <h3 className="text-[18px] mb-3 text-color-dark-purple font-bold leading-6 tracking-[-0.6px] whitespace-nowrap">
                  {item.package.course.title}
                </h3>

                <div className="flex space-x-6">
                  {/* <Button className="px-[10px] cursor-auto" theme="purple">
                    {t('lesson_type', { ns: 'profile' })}
                  </Button> */}

                  <div className="">
                    <h4 className="text-gray-300 font-medium text-sm">
                      {t('lessons_remaining', {
                        ns: 'profile',
                        // count: getCompleteLessons(item.lessons),
                        // total: item.package.totalSessions,
                      })}
                    </h4>
                    <p className="text-color-purple font-medium text-sm">
                      {item.credits}/{item.package.totalSessions}
                    </p>
                  </div>

                  <div className="">
                    <h4 className="text-gray-300 font-medium text-sm">
                      {t('duration', { ns: 'lessons' })}
                    </h4>
                    <p className="text-color-dark-purple font-medium text-sm">
                      {item.package.sessionTime}{' '}
                      {t('minutes', { ns: 'common' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {uncompletedPackages?.length === 0 && (
            <p className="mt-[30px]">{t('no_lessons', { ns: 'lessons' })}</p>
          )}
        </div>

        <div className="mt-[30px] max-w-[448px] px-6 w-full mx-auto">
          <h2 className="mb-4 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
            {t('completed_courses')}
          </h2>
          {completedPackages &&
            completedPackages.map((item) => (
              <div
                key={item.id}
                className="w-full p-5 bg-gray-50 border border-solid mb-2 border-color-border-grey shadow-sm rounded-[10px]"
              >
                <h3 className="text-[18px] mb-3 text-gray-400 font-bold leading-6 tracking-[-0.6px] whitespace-nowrap">
                  {item.package.course.title}
                </h3>

                <div className="flex space-x-6">
                  {/* <Button className="px-[10px] cursor-auto" theme="purple">
                    {t('lesson_type', { ns: 'profile' })}
                  </Button> */}

                  <div className="">
                    <h4 className="text-gray-300 font-medium text-sm">
                      {t('lessons_remaining', {
                        ns: 'profile',
                        // count: getCompleteLessons(item.lessons),
                        // total: item.package.totalSessions,
                      })}
                    </h4>
                    <p className=" text-gray-400 font-medium text-sm">
                      {item.credits}/{item.package.totalSessions}
                    </p>
                  </div>

                  <div className="">
                    <h4 className="text-gray-300 font-medium text-sm">
                      {t('duration', { ns: 'lessons' })}
                    </h4>
                    <p className=" text-gray-400 font-medium text-sm">
                      {item.package.sessionTime}{' '}
                      {t('minutes', { ns: 'common' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {completedPackages?.length === 0 && (
            <p className="mt-[30px]">{t('no_lessons', { ns: 'lessons' })}</p>
          )}
        </div>

        <AdaptiveDialog
          button={
            <Button
              theme="red"
              className="max-w-[400px] w-full mx-auto my-8 h-[60px]"
            >
              <FiLogOut className="mr-2" /> Log out
            </Button>
          }
          open={logoutOpen}
          setOpen={setLogoutOpen}
        >
          <div className="text-center">
            <h2 className="font-bold text-[22px] mb-4">
              {t('logging_out', { ns: 'modals' })}
            </h2>
            <p className="text-[15px] mb-6">
              {t('are_you_sure_to_logout', { ns: 'modals' })}
            </p>

            <Button
              onClick={handleLogout}
              theme="destructive"
              className="w-full mb-3"
            >
              {t('yes_logout', { ns: 'modals' })}
            </Button>
            <Button
              onClick={() => setLogoutOpen(false)}
              theme="outline"
              className="w-full"
            >
              {t('cancel', { ns: 'modals' })}
            </Button>
          </div>
        </AdaptiveDialog>
      </div>

      {/* <ModalWrapper isOpen={isOpen} closeModal={setIsOpen}>
        <EditProflileStudent closeModal={setIsOpen} setLoading={setLoading} />
      </ModalWrapper> */}
    </>
  );
};
export default StudentProfile;
