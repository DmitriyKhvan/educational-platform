import Button from '@/components/form/button';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import MentorsModal from '@/pages/students/mentors-list/ui/mentor/mentors-modal';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import type { Mentor } from '@/types/types.generated';
import { Avatar } from '@/widgets/avatar/avatar';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { MdPersonSearch } from 'react-icons/md';
import { WeekSlots } from '../week-slots/week-slots';

export const MentorCard2 = ({
  mentor,
}: {
  mentor: Mentor;
}) => {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [t] = useTranslation(['studentMentor', 'common', 'lessons']);

  return (
    <div className="w-full sm:w-fit space-y-6 p-4 border border-gray-100 rounded-xl shadow-[0px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-y-4">
        <div className="flex items-center flex-grow gap-x-4 sm:gap-x-5">
          <div className="relative min-w-[64px] max-w-[64px] h-[64px] overflow-hidden rounded-lg">
            <Avatar avatarUrl={mentor.avatar?.url ?? undefined} />
          </div>

          <div>
            <h2 className="text-base sm:text-lg text-color-dark-purple font-bold leading-normal tracking-[-0.6px]">
              {mentor?.firstName}
            </h2>

            <h4 className="text-[13px] space-x-1">
              {mentor.university && (
                <span className=" text-color-dark-purple">{mentor.university}</span>
              )}

              {(mentor.degree || mentor.major) && (
                <span className=" text-gray-400">
                  ({mentor.degree} {`${mentor.major}/ ${mentor.major}`})
                </span>
              )}
            </h4>
          </div>
        </div>

        <div className="flex gap-3">
          <AdaptiveDialog
            button={
              <Button theme="gray" className="flex items-center justify-center gap-2 w-[145px]">
                <MdPersonSearch className="text-xl" />
                <span className="whitespace-nowrap">{t('learn_more', { ns: 'common' })}</span>
              </Button>
            }
            classNameDrawer="h-[80%]"
          >
            <MentorsModal mentor={mentor} />
          </AdaptiveDialog>

          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  to={mentor?.availabilities?.length > 0 ? '/student/schedule-lesson/select' : '#'}
                  state={{
                    mentor: {
                      ...mentor,
                    },
                  }}
                >
                  <Button
                    theme="purple"
                    className="w-[145px]"
                    disabled={mentor?.availabilities?.length === 0}
                  >
                    {t('schedule', { ns: 'common' })}
                  </Button>
                </Link>
              </TooltipTrigger>

              {mentor?.availabilities?.length === 0 && (
                <TooltipPortal>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="text-color-dark-purple text-sm font-semibold max-w-[16rem]">
                        We apologize, but this mentor has no availability
                      </p>
                    </div>
                  </TooltipContent>
                </TooltipPortal>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {!isMobile && <WeekSlots mentor={mentor} />}
    </div>
  );
};
