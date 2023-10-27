import React from 'react';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { cn } from 'src/utils/functions';

export const ProfileCard = ({ student, studentId, selectProfile }) => {
  return (
    <div
      onClick={() => selectProfile(student.id)}
      className="flex flex-col items-center gap-y-5"
    >
      <div className="flex items-center justify-center w-[158px] h-[158px] overflow-hidden rounded-full">
        <Avatar
          avatarUrl={student.avatar?.url}
          gender={student.gender}
          className={cn(
            'w-[150px] h-[150px] rounded-full cursor-pointer hover:border-color-purple border-2 hover:shadow-[0_0_0_4px_#F0EBF7] transition duration-300 ease-in-out',
            student.id === studentId &&
              'border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7]',
          )}
        />
      </div>
      <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
        {student.firstName}
      </span>
    </div>
  );
};
