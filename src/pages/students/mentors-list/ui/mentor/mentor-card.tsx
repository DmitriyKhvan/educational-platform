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
import { HiMiniChevronRight } from 'react-icons/hi2';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

export const MentorCard = ({
  mentor,
  handleSelectMentor,
}: {
  mentor: Mentor;
  handleSelectMentor?: (mentor: Mentor) => void;
}) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  const [t] = useTranslation(['studentMentor', 'common', 'lessons']);

  return (
    <div className="flex w-full gap-4 sm:gap-6">
      <div className="relative min-w-[64px] max-w-[64px] sm:min-w-[80px] sm:max-w-[80px] h-[80px] overflow-hidden rounded-lg">
        <Avatar avatarUrl={mentor.avatar?.url ?? undefined} />
        {/* <div className="absolute left-0 right-0 bottom-0 py-[2px] rounded-b-lg bg-[#FF5F4B] text-white text-[10px] text-center font-semibold">
          Top mentor
        </div> */}
      </div>

      <div className="flex flex-col sm:flex-row grow justify-between gap-x-6">
        <div>
          <h2 className="text-base sm:text-lg text-color-dark-purple font-bold leading-normal tracking-[-0.6px]">
            {mentor?.firstName}
          </h2>

          {isMobile ? (
            <div>
              {mentor.university && (
                <p className="text-[13px] leading-normal tracking-[-0.2px] mt-2 mb-3">
                  <span className="text-color-dark-purple">{mentor.university}</span>{' '}
                  {(mentor.degree || mentor.major) && (
                    <span className="text-gray-400">
                      ({mentor.degree} {`${mentor.major}/ ${mentor.major}`})
                    </span>
                  )}
                </p>
              )}
            </div>
          ) : (
            <div>
              {mentor.university && (
                <h4 className="text-[13px] text-color-dark-purple leading-normal tracking-[-0.2px] mt-2">
                  {mentor.university}
                </h4>
              )}

              {(mentor.degree || mentor.major) && (
                <h4 className="text-[13px] text-gray-400 leading-normal tracking-[-0.2px] mt-3">
                  ({mentor.degree} {`${mentor.major}/ ${mentor.major}`})
                </h4>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {mentor?.availabilities ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    to={
                      mentor?.availabilities?.length > 0 ? '/student/schedule-lesson/select' : '#'
                    }
                    state={{
                      mentor: {
                        ...mentor,
                      },
                    }}
                  >
                    <Button
                      className="w-full px-[18px] sm:px-6 h-[40px] text-xs sm:text-sm"
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
          ) : (
            <Button
              className="px-[18px] sm:px-6 h-[40px] text-xs sm:text-sm whitespace-nowrap"
              onClick={() => handleSelectMentor?.(mentor)}
            >
              {t('select_mentor', { ns: 'lessons' })}
            </Button>
          )}
          <AdaptiveDialog
            button={
              <Button
                theme="gray"
                className="flex items-center justify-center px-[18px] sm:px-6 h-[40px] text-xs sm:text-sm"
              >
                <span className="whitespace-nowrap">{t('learn_more', { ns: 'common' })}</span>
                <HiMiniChevronRight className="text-sm" />
              </Button>
            }
            classNameDrawer="h-[80%]"
          >
            <MentorsModal mentor={mentor} />
          </AdaptiveDialog>
        </div>
      </div>
    </div>
  );
};
