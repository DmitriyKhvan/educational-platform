import React from 'react';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { cn } from 'src/utils/functions';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/Tooltip';
import { useTranslation } from 'react-i18next';

export const ProfileCard = ({ student, studentId, selectProfile }) => {
  const [t] = useTranslation('profile');
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            onClick={() =>
              student.isActive ? selectProfile(student) : undefined
            }
            className="group flex flex-col items-center gap-y-5 cursor-pointer"
          >
            <Avatar
              avatarUrl={student.avatar?.url}
              gender={student.gender}
              className={cn(
                'w-[150px] h-[150px] rounded-full  transition duration-300 ease-in-out cursor-pointer',
                student.isActive
                  ? 'group-hover:border-color-purple border-2 group-hover:shadow-[0_0_0_4px_#F0EBF7]'
                  : 'grayscale-[70%] opacity-50',
                student.id === studentId &&
                  'border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7]',
              )}
            />
            <span className="font-semibold text-[20px] text-color-light-grey leading-6 tracking-[-0.2px]">
              {student.firstName}
            </span>
          </div>
        </TooltipTrigger>

        {!student.isActive && (
          <TooltipPortal>
            <TooltipContent>
              <div className="text-center">
                <p className="text-color-dark-purple text-sm font-semibold max-w-[16rem]">
                  {t('deactivated_student')}
                </p>
              </div>
            </TooltipContent>
          </TooltipPortal>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
