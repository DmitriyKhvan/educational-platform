import React from 'react';
import AuthLayout from '../../../components/AuthLayout';
// import Button from '../../../components/Form/Button/Button';
import { HiMiniPlusSmall } from 'react-icons/hi2';
import { useAuth } from 'src/modules/auth';
import { ProfileCard } from './ProfileCard';
import { useState } from 'react';
import { setItemToLocalStorage } from 'src/constants/global';

export const SelectProfile = () => {
  const { user } = useAuth();

  const [studentId, setStudentId] = useState(null);

  const selectProfile = (id) => {
    setStudentId(id);
    setItemToLocalStorage('studentId', id);
    location.href = '/';
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-y-[70px]">
        <h1 className="text-[40px] text-color-dark-purple leading-[48px] tracking-[-1px]">
          Select a Profile
        </h1>

        <div className="flex items-center justify-center gap-x-[50px]">
          {user.students.map((student) => (
            <ProfileCard
              key={student.id}
              student={student}
              studentId={studentId}
              selectProfile={selectProfile}
            />
          ))}

          <div className="flex flex-col items-center gap-y-5">
            <HiMiniPlusSmall className="text-[150px] text-color-purple rounded-full bg-color-light-purple cursor-pointer" />
            <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
              Add Account
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
    </AuthLayout>
  );
};
