import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import { buttonizeA11Y } from '@/shared/utils/buttonizeA11Y';
import { cn } from '@/shared/utils/functions';
import type { AuthStudent } from '@/types/types.generated';
import { Avatar } from '@/widgets/avatar/avatar';
import { useTranslation } from 'react-i18next';
import { MdLock } from 'react-icons/md';

interface ProfileCardProps {
  student: AuthStudent | null;
  studentId: string | null;
  selectProfile: (student: AuthStudent) => void;
}
export const ProfileCard = ({ student, studentId, selectProfile }: ProfileCardProps) => {
  const [t] = useTranslation('profile');
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            {...buttonizeA11Y(() => (student?.isActive ? selectProfile(student) : undefined))}
            // onClick={() => (student.isActive ? selectProfile(student) : undefined)}
            className="group flex flex-col items-center gap-y-4 cursor-pointer"
          >
            <div className="relative">
              <Avatar
                avatarUrl={student?.avatar?.url}
                // gender={student.gender}
                fallback="duck"
                className={cn(
                  'w-[150px] h-[150px] rounded-full  transition duration-300 ease-in-out cursor-pointer bg-color-purple',
                  student?.isActive &&
                    'group-hover:border-color-purple border-2 group-hover:shadow-[0_0_0_4px_#F0EBF7]',
                  student?.id === studentId &&
                    'border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7]',
                )}
              />
              {!student?.isActive && (
                <span className="absolute right-0 bottom-0 rounded-full flex justify-center items-center w-10 h-10 bg-color-light-grey2">
                  <MdLock className="w-5 h-5 text-color-light-grey" />
                </span>
              )}
            </div>
            <div className="text-center">
              <span
                className={cn(
                  'block mb-2 font-semibold text-[20px] leading-6 tracking-[-0.2px]',
                  student?.isActive ? 'text-color-dark-violet' : 'text-color-darker-grey',
                )}
              >
                {student?.firstName}
              </span>

              {!student?.isActive && (
                <span className="block font-semibold text-[15px] text-color-darker-grey leading-4 tracking-[-0.2px]">
                  {t('deactivated')}
                </span>
              )}
            </div>
          </div>
        </TooltipTrigger>

        {!student?.isActive && (
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
