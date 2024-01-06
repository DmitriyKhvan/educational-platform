import React, { useState } from 'react';
// import Button from '../../../components/Form/Button/Button';
import { HiMiniPlusSmall } from 'react-icons/hi2';
import { useAuth } from 'src/modules/auth';
import { ProfileCard } from './ProfileCard';
import { setItemToLocalStorage } from 'src/constants/global';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

export const SelectProfile = () => {
  const [t] = useTranslation('profile');
  const { user } = useAuth();

  const [studentId, setStudentId] = useState(null);

  const selectProfile = (student) => {
    setStudentId(student.id);
    setItemToLocalStorage('studentId', student.id);
    setItemToLocalStorage('token', student.newToken);
    location.href = '/student/manage-lessons';
  };

  return (
    <OnboardingLayout>
      <div className="flex flex-col items-center gap-y-[70px] py-6 sm:py-8 lg:py-10">
        <h1 className="text-[40px] text-color-dark-purple leading-[48px] tracking-[-1px]">
          {t('select_profile')}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-[50px]">
          {user.students.map((student) => (
            <ProfileCard
              key={student.id}
              student={student}
              studentId={studentId}
              selectProfile={selectProfile}
            />
          ))}

          <div
            onClick={() => (location.href = '/add-student-profile')}
            className="flex flex-col items-center gap-y-5"
          >
            <HiMiniPlusSmall className="text-[150px] text-color-purple rounded-full bg-color-light-purple cursor-pointer hover:border-color-purple border-2 hover:shadow-[0_0_0_4px_#F0EBF7] transition duration-300 ease-in-out" />
            <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
              {t('add_account')}
            </span>
          </div>
        </div>

        {/* <Button
          onClick={() => (location.href = '/')}
          disabled={studentId === null}
        >
          Return to Dashboard
        </Button> */}
      </div>
    </OnboardingLayout>
  );
};
