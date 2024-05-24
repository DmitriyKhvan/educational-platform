import React, { useState } from 'react';
import { ProfileCard } from './ProfileCard';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { setItemToLocalStorage } from 'src/constants/global';
import { LuPlus } from 'react-icons/lu';

const SelectProfile = () => {
  const [t] = useTranslation('profile');
  const { user, currentStudent } = useAuth();

  const [studentId, setStudentId] = useState(null);

  const selectProfile = (student) => {
    setStudentId(student.id);
    setItemToLocalStorage('studentId', student.id);
    setItemToLocalStorage('token', student.newToken);
    location.href = '/student/manage-lessons';
  };

  const addAccount = () => {
    if (currentStudent?.isTrial) {
      location.href = '/trial';
    } else {
      location.href = '/add-student-profile';
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-[70px]">
      <h1 className="text-xl leading-5 sm:text-[36px] sm:leading-[48px] font-bold text-color-dark-purple tracking-[-1px]">
        {t('select_profile')}
      </h1>

      <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-[50px]">
        {user.students.map((student) => (
          <ProfileCard
            key={student.id}
            student={student}
            studentId={studentId}
            selectProfile={selectProfile}
          />
        ))}

        <div
          onClick={addAccount}
          className="group flex flex-col items-center gap-y-5 cursor-pointer"
        >
          <div className="flex items-center justify-center w-[150px] h-[150px] text-color-purple rounded-full bg-color-light-purple group-hover:border-color-purple border-2 group-hover:shadow-[0_0_0_4px_#F0EBF7] transition duration-300 ease-in-out">
            <LuPlus className="text-[32px]" />
          </div>
          <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
            {t('add_account')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectProfile;
