import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Avatar } from 'src/widgets/Avatar/Avatar';
import FavIcon from 'src/assets/images/Favorite.png';
import Button from 'src/components/Form/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/Tooltip';

import { HiMiniChevronRight } from 'react-icons/hi2';

export const MentorCard = ({
  mentor,
  handleMoreMentor,
  handleSelectMentor,
}) => {
  const [t] = useTranslation(['studentMentor', 'common', 'lessons']);

  // const resizerUsername = (name) => {
  //   return name && name.length > 9 ? name.slice(0, 9 - 1) + '...' : name;
  // };

  return (
    // <div className="w-full sm:w-[45%] xl:w-[30%] 2xl:w-[300px]">
    <div className="w-[calc(50%-0.75rem)] sm:w-[256px]">
      <div className="relative w-full h-[176px] sm:h-[240px] overflow-hidden rounded-lg">
        <Avatar avatarUrl={mentor.avatar?.url} gender={mentor.gender} />
        {mentor.isFavourite && (
          <img
            className="absolute top-[5%] right-[5%] w-10 h-10 object-cover"
            src={FavIcon}
            alt=""
          />
        )}

        <div className="absolute left-2 bottom-2 px-3 py-[6px] rounded-lg bg-[#FF5F4B] text-white text-xs font-semibold">
          Top mentor
        </div>
      </div>

      <div className="mt-4 overflow-hidden">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg text-color-dark-purple font-bold tracking-[-0.6px] mb-2">
            {mentor?.firstName}
          </h2>

          <h4 className="text-[13px] sm:text-sm text-color-dark-purple leading-[18px] tracking-[-0.2px] mb-3">
            {mentor.university}
          </h4>

          <span className="text-xs sm:text-sm text-gray-400 leading-[18px] tracking-[-0.2px]">
            {mentor.degree} {mentor.major ? '/ ' + mentor.major : null}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {mentor?.availabilities ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    className="m-1"
                    to={
                      mentor?.availabilities?.length > 0
                        ? {
                            pathname: `/student/schedule-lesson/select`,
                            state: {
                              tutor: {
                                ...mentor,
                              },
                            },
                          }
                        : '#'
                    }
                  >
                    <Button
                      theme="dark_purple"
                      className="w-full h-[57px]"
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
              theme="dark_purple"
              className="p-2 m-1 h-[57px]"
              onClick={() => handleSelectMentor(mentor)}
            >
              {t('select_mentor', { ns: 'lessons' })}
            </Button>
          )}

          <Button
            theme="gray"
            className="m-1 h-[57px]"
            onClick={() => handleMoreMentor(mentor)}
          >
            <span className="whitespace-nowrap">
              {t('learn_more', { ns: 'common' })}
            </span>
            <HiMiniChevronRight className="text-sm" />
          </Button>

          {/* <button onClick={() => handleStatusTutor(mentor.id)}>
          {mentor?.isFavourite ? 'Remove' : 'Favorite'}
        </button> */}
        </div>
      </div>
    </div>
  );
};
