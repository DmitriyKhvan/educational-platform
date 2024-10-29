import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import Button from 'src/components/Form/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/Tooltip';
import { Tag } from '@/entities/questionnaire/ui/tag';
import MentorsModal from 'src/pages/Students/MentorsList/MentorsModal';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import certificates from 'src/shared/assets/images/certificates.png';
import certificate from 'src/shared/assets/images/certificate.png';

export const TopMentorCard = ({ mentor }) => {
  const { fullName, matchingProfile } = mentor;

  const [t] = useTranslation(['common']);
  return (
    <div className="w-full min-[400px]:w-[280px] space-y-5 p-5 rounded-[10px] border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
      <div className="flex justify-between gap-4">
        <div className="space-y-[10px]">
          <span className="text-lg font-bold text-color-dark-purple">{fullName}</span>
          <span className="flex items-center text-[rgba(0,_217,_134,_1)]">
            {matchingProfile?.certifications?.length > 0 && (
              <>
                <img
                  src={matchingProfile?.certifications?.length === 1 ? certificate : certificates}
                  alt="certificate"
                />

                <span className="text-[13px]">
                  {matchingProfile?.certifications.map((item) => item.certification).join(', ')}{' '}
                  certified
                </span>
              </>
            )}
          </span>
        </div>
        <Avatar className="w-[56px] h-[56px] rounded-s-lg overflow-hidden"></Avatar>
      </div>

      <div className="space-y-3">
        <div className="flex gap-[6px] whitespace-nowrap">
          {matchingProfile?.interests?.slice(0, 2).map((item) => (
            <Tag
              key={item.interest}
              icon={item.icon}
              label={item.interest}
              className="px-[10px] text-xs"
            />
          ))}

          {matchingProfile?.interests?.slice(2).length > 0 && (
            <Tag label={`+${matchingProfile?.interests?.slice(2).length}`} className="bg-white " />
          )}
        </div>

        <div className="flex gap-[6px] whitespace-nowrap">
          {matchingProfile?.teachingStyles?.slice(0, 2).map((item) => (
            <Tag
              key={item.teachingStyle}
              icon="✦"
              label={item.teachingStyle}
              className="text-color-purple px-[10px] text-xs"
            />
          ))}
          {matchingProfile?.teachingStyles?.slice(2).length > 0 && (
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
                to={
                  mentor?.availabilities?.regular?.length > 0
                    ? `/student/schedule-lesson/select`
                    : '#'
                }
                state={{
                  mentor: {
                    ...mentor,
                  },
                }}
              >
                <Button className="w-full" disabled={mentor?.availabilities?.regular?.length === 0}>
                  {t('schedule', { ns: 'common' })}
                </Button>
              </Link>
            </TooltipTrigger>

            {mentor?.availabilities?.regular?.length === 0 && (
              <TooltipPortal>
                <TooltipContent>
                  <p className="text-center text-color-dark-purple text-sm font-semibold max-w-[16rem]">
                    We apologize, but this mentor has no availability
                  </p>
                </TooltipContent>
              </TooltipPortal>
            )}
          </Tooltip>
        </TooltipProvider>

        <AdaptiveDialog
          button={
            <Button theme="dark_purple" className="">
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
