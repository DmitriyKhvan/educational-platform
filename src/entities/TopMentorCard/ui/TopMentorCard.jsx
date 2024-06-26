import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiSealCheckFill } from 'react-icons/pi';
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
import { Tag } from 'src/entities/Questionnaire/ui/Tag';
import MentorsModal from 'src/pages/Students/MentorsList/MentorsModal';
import { Avatar } from 'src/widgets/Avatar/Avatar';

export const TopMentorCard = ({ mentor }) => {
  // const {fullName, } = mentor
  const [t] = useTranslation(['common']);
  return (
    <div className="w-full min-[400px]:w-[280px] space-y-5 p-5 rounded-[10px] border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
      <div className="flex justify-between gap-4">
        <div className="space-y-[10px]">
          <span className="text-lg font-bold text-color-dark-purple">
            Monica
          </span>
          <span className="flex items-center  text-[rgba(0,_217,_134,_1)]">
            <div className="relative w-5 h-4">
              <PiSealCheckFill className="absolute" />
              {/* <PiSealCheckFill className="absolute ml-1" /> */}
            </div>

            <span className="text-[13px]">TESOL, TEFL certified</span>
          </span>
        </div>
        <Avatar className="w-[64px] h-[64px] rounded-s-lg overflow-hidden"></Avatar>
      </div>

      <div className="space-y-3">
        <div className="flex gap-[6px] whitespace-nowrap">
          <Tag label="💻 Technology" className="px-[10px] text-xs" />

          <div className="flex">
            <Tag label="🌳 Ecology" className="px-[10px] text-xs" />
            <Tag label="+3" className="bg-white " />
          </div>
        </div>

        <div className="flex gap-[6px] whitespace-nowrap">
          <Tag
            icon="✦"
            label="Academic"
            className="text-color-purple px-[10px] text-xs"
          />

          <div className="flex">
            <Tag
              icon="✦"
              label="Creative"
              className="text-color-purple px-[10px] text-xs"
            />
            <Tag label="+3" className="bg-white " />
          </div>
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
                <Button
                  className="w-full"
                  disabled={mentor?.availabilities?.regular?.length === 0}
                >
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
