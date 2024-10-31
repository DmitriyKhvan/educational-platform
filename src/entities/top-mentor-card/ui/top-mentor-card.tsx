import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import { Tag } from '@/entities/questionnaire/ui/tag';

import certificates from '@/shared/assets/images/certificates.png';
import certificate from '@/shared/assets/images/certificate.png';
import Button from '@/components/form/button';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { Avatar } from '@/widgets/avatar/avatar';
import MentorsModal from '@/pages/students/mentors-list/ui/mentor/mentors-modal';
import type { Mentor } from '@/types/types.generated';
import { useMemo } from 'react';

export const TopMentorCard = ({ mentor }: { mentor: Mentor }) => {
  const { fullName, matchingProfile } = mentor;

  const location = useLocation();

  const url = useMemo(() => {
    if (
      location.pathname === '/student/mentors-list' ||
      location.pathname === '/mentor-matches-list'
    ) {
      return '/student/schedule-lesson/select';
    }

    return `${location.pathname}${location.search}`;
  }, [location]);

  const disableMentor = useMemo(() => {
    const regularAvailabilities = mentor.availabilities.filter(
      (availability) => !availability?.isTrial,
    );

    return regularAvailabilities.length === 0;
  }, [mentor.availabilities]);

  const [t] = useTranslation(['common']);
  return (
    <div className="w-full min-[400px]:w-[280px] space-y-5 p-5 rounded-[10px] border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
      <div className="flex justify-between gap-4">
        <div className="space-y-[10px]">
          <span className="text-lg font-bold text-color-dark-purple">{fullName}</span>
          <span className="flex items-center text-[rgba(0,_217,_134,_1)]">
            {matchingProfile?.certifications && matchingProfile?.certifications?.length > 0 && (
              <>
                <img
                  src={matchingProfile?.certifications?.length === 1 ? certificate : certificates}
                  alt="certificate"
                />

                <span className="text-xs">
                  {`${matchingProfile?.certifications?.map((item) => item?.certification).join(', ')} certified`}
                </span>
              </>
            )}
          </span>
        </div>
        <Avatar className="w-[56px] h-[56px] rounded-s-lg overflow-hidden" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-[6px] whitespace-nowrap">
          {matchingProfile?.interests?.slice(0, 2).map((item) => (
            <Tag
              key={item?.interest}
              icon={item?.icon}
              label={item?.interest ?? ''}
              className="px-[10px] text-xs"
            />
          ))}

          {matchingProfile?.interests?.slice(2) &&
            matchingProfile?.interests?.slice(2).length > 0 && (
              <Tag
                label={`+${matchingProfile?.interests?.slice(2).length}`}
                className="bg-white "
              />
            )}
        </div>

        <div className="flex gap-[6px] whitespace-nowrap">
          {matchingProfile?.teachingStyles?.slice(0, 2).map((item) => (
            <Tag
              key={item?.teachingStyle}
              icon="✦"
              label={item?.teachingStyle ?? ''}
              className="text-color-purple px-[10px] text-xs"
            />
          ))}
          {matchingProfile?.teachingStyles?.slice(2) &&
            matchingProfile?.teachingStyles?.slice(2).length > 0 && (
              <Tag
                label={`+${matchingProfile?.teachingStyles?.slice(2).length}`}
                className="bg-white "
              />
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Link
                to={!disableMentor ? url : '#'}
                state={{
                  mentor: {
                    ...mentor,
                  },
                }}
              >
                <Button theme="purple" className="w-full" disabled={disableMentor}>
                  {t('schedule', { ns: 'common' })}
                </Button>
              </Link>
            </TooltipTrigger>

            {disableMentor && (
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

        <AdaptiveDialog
          button={
            <Button theme="dark_purple" className="w-full">
              View profile
            </Button>
          }
          classNameDrawer="h-[80%]"
        >
          <MentorsModal mentor={mentor} />
        </AdaptiveDialog>
      </div>
    </div>
  );
};
