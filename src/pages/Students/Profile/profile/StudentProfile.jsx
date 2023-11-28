import React, { useState } from 'react';
import { useAuth } from '../../../../modules/auth';
import { useMutation, useQuery } from '@apollo/client';
import {
  MUTATION_UPDATE_STUDENT,
  PACKAGE_QUERY,
} from '../../../../modules/auth/graphql';
import { useTranslation } from 'react-i18next';
import Introduction from './Introduction';
import Button from '../../../../components/Form/Button/Button';
import { Avatar } from '../../../../widgets/Avatar/Avatar';
import notify from '../../../../utils/notify';
import ModalWrapper from '../../../../components/ModalWrapper/ModalWrapper';
import EditProflileStudent from '../editInfo/EditStudentProfile';
import ReactLoader from '../../../../components/common/Loader';
import { getItemToLocalStorage } from 'src/constants/global';

const StudentProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [t] = useTranslation(['profile', 'common', 'lessons']);

  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);

  const { user, refetchUser } = useAuth();

  const { data: { packageSubscriptions: planStatus } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      variables: {
        studentId: getItemToLocalStorage('studentId'),
      },
    },
  );

  const saveIntroduction = async (text) => {
    if (text !== '') {
      const { data } = await updateStudent({
        variables: {
          // id: parseInt(user?.student?.id),
          id: parseInt(getItemToLocalStorage('studentId')),
          data: {
            about: text,
          },
        },
      });

      if (data) {
        notify(t('introduction_changed', { ns: 'profile' }));
      }

      await refetchUser();
    }
  };

  return (
    <>
      {loading && <ReactLoader className="fixed !important" />}
      <div className="flex flex-wrap h-[calc(100vh-80px)] overflow-auto ">
        <div className="sm:w-full xl:w-3/5 p-[30px] sm:p-[60px]">
          <div>
            <div className="relative w-full h-[150px] bg-color-purple rounded-t-[10px]">
              <div className="absolute left-[5%] top-[55%] w-[140px] h-[140px] bg-white border-8 border-solid border-white rounded-[10px]">
                <Avatar avatarUrl={user?.avatar?.url} />
              </div>
            </div>
            <div className="w-full h-auto py-4 border border-solid border-color-border-grey rounded-b-[10px]">
              <div className="flex justify-between w-[65%] ml-auto">
                <div>
                  <h2 className="mt-0 mb-[10px] text-3xl leading-9 tracking-[-1px] text-color-dark-purple">
                    {user?.firstName + ' '}
                    {user?.lastName}
                  </h2>

                  <span className="text-base font-semibold tracking-[-0.6px] text-color-light-grey">
                    {user?.timeZone ? user?.timeZone : 'PST (GMT-8)'}
                  </span>
                </div>

                <div>
                  <Button
                    className="mr-4"
                    theme="outline"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    {t('edit_profile')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Introduction
            text={user?.student?.about}
            onChange={saveIntroduction}
          />

          <div className="mt-[30px]">
            <h2 className="text-xl text-color-dark-purple font-medium tracking-[-0.6px] leading-6">
              {t('enrolled_courses')}
            </h2>
            {planStatus &&
              planStatus.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 mt-5 p-5 bg-white border border-solid border-color-border-grey rounded-[10px]"
                >
                  <h3 className="text-sm text-color-dark-purple font-semibold leading-6 tracking-[-0.6px] whitespace-nowrap">
                    {item.package.course.title}
                  </h3>

                  <Button className="px-[10px] cursor-auto" theme="purple">
                    {t('lesson_type', { ns: 'profile' })}
                  </Button>

                  <Button className="px-[10px] text-color-purple bg-color-light-purple cursor-auto">
                    {item.package.sessionTime} {t('minutes', { ns: 'common' })}
                  </Button>

                  <Button
                    className="px-[10px] cursor-auto hover:bg-white hover:text-inherit"
                    theme="outline"
                  >
                    {t('lessons_completed', {
                      ns: 'lessons',
                      count: item.package.totalSessions - item.credits,
                      total: item.package.totalSessions,
                    })}
                  </Button>
                </div>
              ))}

            {planStatus?.length === 0 && (
              <p className="mt-[30px]">{t('no_lessons', { ns: 'lessons' })}</p>
            )}
          </div>
        </div>

        <div className="w-full xl:w-2/5 p-[30px] sm:p-[60px] border-t xl:border-t-0 xl:border-l border-solid border-color-border-grey bg-[#F7F7FA]">
          <h2 className="font-medium text-2xl text-color-light-grey tracking-[-0.6px]">
            {t('add_details')}
          </h2>

          <div className="flex flex-col gap-5 mt-5">
            <div>
              <h4 className="font-medium text-xl text-color-dark-purple leading-6 tracking-[-0.6px] mb-[10px]">
                {t('email')}
              </h4>
              <p className="font-medium text-xl text-color-purple leading-6 tracking-[-0.6px]">
                {user?.email}
              </p>
            </div>

            {user?.koreanEquivalent && (
              <div>
                <h4 className="font-medium text-xl text-color-dark-purple leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('korean_name')}
                </h4>
                <p className="font-medium text-xl text-color-purple leading-6 tracking-[-0.6px]">
                  {user?.koreanEquivalent}
                </p>
              </div>
            )}

            {user?.gender && (
              <div>
                <h4 className="font-medium text-xl text-color-dark-purple leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('gender')}
                </h4>
                <p className="font-medium text-xl text-color-purple leading-6 tracking-[-0.6px]">
                  {user?.gender}
                </p>
              </div>
            )}

            {user?.country && (
              <div>
                <h4 className="font-medium text-xl text-color-dark-purple leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('country', { ns: 'common' })}
                </h4>
                <p className="font-medium text-xl text-color-purple leading-6 tracking-[-0.6px]">
                  {user?.country ? user?.country : 'Korea'}
                </p>
              </div>
            )}

            {user?.address && (
              <div>
                <h4 className="font-medium text-xl text-color-dark-purple leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('address', { ns: 'common' })}
                </h4>
                <p className="font-medium text-xl text-color-purple leading-6 tracking-[-0.6px]">
                  {user?.address}
                </p>
              </div>
            )}

            {user?.phoneNumber && (
              <div>
                <h4 className="font-medium text-xl text-color-dark-purple leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('phone_number', { ns: 'common' })}
                </h4>
                <p className="font-medium text-xl text-color-purple leading-6 tracking-[-0.6px]">
                  {user?.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalWrapper isOpen={isOpen} closeModal={setIsOpen}>
        <EditProflileStudent closeModal={setIsOpen} setLoading={setLoading} />
      </ModalWrapper>
    </>
  );
};
export default StudentProfile;
