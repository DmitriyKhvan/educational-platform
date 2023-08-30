import React from 'react';
import { useAuth } from '../../../../modules/auth';
import { useMutation, useQuery } from '@apollo/client';
import {
  MUTATION_UPDATE_STUDENT,
  PACKAGE_QUERY,
} from '../../../../modules/auth/graphql';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Introduction from './Introduction';
import Button from '../../../../components/Form/Button/Button';
import { Avatar } from '../../../../widgets/Avatar/Avatar';

const StudentProfile = () => {
  const [t] = useTranslation(['profile', 'common', 'lessons']);

  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);

  const navigate = useHistory();

  const { user, refetchUser } = useAuth();

  const { data: { packageSubscriptions: planStatus } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      variables: {
        userId: user?.id,
      },
    },
  );

  const saveIntroduction = async (text) => {
    if (text !== '') {
      const { data } = await updateStudent({
        variables: {
          id: parseInt(user?.student?.id),
          data: {
            about: text,
          },
        },
      });

      if (data) {
        toast('Introduction is changed!');
      }

      await refetchUser();
    }
  };

  return (
    <div className="flex flex-wrap h-full overflow-auto">
      <div className="sm:w-full xl:w-3/5 p-[30px]">
        <div>
          <div className="relative w-full h-[150px] bg-color-purple rounded-t-[10px]">
            <div className="absolute left-[5%] top-[55%] w-[140px] h-[140px] border-8 border-solid border-white rounded-[10px]">
              <Avatar avatarUrl={user?.student?.avatar?.url} />
            </div>
          </div>
          <div className="w-full h-auto py-4 border border-solid border-color-border-grey rounded-b-[10px]">
            <div className="flex justify-between w-[68%] ml-auto">
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
                    navigate.push('/student/profile/edit-information');
                  }}
                >
                  {t('edit_profile')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Introduction text={user?.student?.about} onChange={saveIntroduction} />

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

                <Button className="text-sm p-[10px]" theme="purple">
                  {t('lesson_type', { ns: 'profile' })}
                </Button>

                <Button className="text-sm p-[10px] text-color-purple bg-color-light-purple">
                  {item.package.sessionTime} {t('minutes', { ns: 'common' })}
                </Button>

                <Button className="text-sm p-[10px]" theme="outline">
                  {t('lessons_remaining', {
                    ns: 'lessons',
                    count: item.credits,
                  })}
                </Button>
              </div>
            ))}

          {planStatus?.length === 0 && (
            <p className="mt-[30px]">{t('no_lessons', { ns: 'lessons' })}</p>
          )}
        </div>
      </div>

      <div className="w-full xl:w-2/5 p-[30px] border-t xl:border-t-0 xl:border-l border-solid border-color-border-grey">
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
  );
};
export default StudentProfile;
