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

export const MentorCard = ({
  mentor,
  handleMoreMentor,
  handleSelectMentor,
}) => {
  const [t] = useTranslation(['studentMentor', 'common', 'lessons']);

  const resizerUsername = (name) => {
    return name && name.length > 9 ? name.slice(0, 9 - 1) + '...' : name;
  };

  return (
    // <div className="w-full sm:w-[300px] lg:w-[260px] 2xl:w-[300px]">
    <div className="w-full sm:w-[45%] xl:w-[30%] 2xl:w-[300px]">
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
        <Avatar avatarUrl={mentor.avatar?.url} gender={mentor.gender} />
        {mentor.isFavourite && (
          <img
            className="absolute top-[5%] right-[5%] w-10 h-10 object-cover"
            src={FavIcon}
            alt=""
          />
        )}
      </div>

      <div className="flex justify-between items-start mt-[30px] h-[115px] overflow-hidden">
        <div>
          <h2 className="text-2xl sm:text-[30px] text-color-purple tracking-[-0.6px] mb-4 ">
            {resizerUsername(mentor?.firstName)}
          </h2>

          <h4 className="font-semibold text-[15px] text-color-light-grey leading-[18px] tracking-[-0.2px]">
            {mentor.university}
          </h4>

          <span className="text-[15px] text-color-light-grey leading-[18px] tracking-[-0.2px]">
            {mentor.degree} {mentor.major ? '/ ' + mentor.major : null}
          </span>
        </div>

        <div className="flex flex-col gap-[2px]">
          <Button
            theme="outline"
            className="w-[115px] p-0"
            onClick={() => handleMoreMentor(mentor)}
          >
            {t('learn_more', { ns: 'common' })}
          </Button>

          {mentor?.availabilities ? (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    to={
                      mentor?.availabilities?.length > 0
                        ? {
                            pathname: `/student/schedule-lesson/select`,
                            state: {
                              tutor: {
                                id: mentor.id,
                                firstName: mentor?.firstName,
                                lastName: mentor?.lastName,
                                avatar: mentor.avatar?.url,
                              },
                            },
                          }
                        : '#'
                    }
                  >
                    <Button
                      theme="outline"
                      className="w-[115px] p-0"
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
              theme="outline"
              className="w-[115px] p-2"
              onClick={() => handleSelectMentor(mentor)}
            >
              {t('select_mentor', { ns: 'lessons' })}
            </Button>
          )}

          {/* <button onClick={() => handleStatusTutor(mentor.id)}>
          {mentor?.isFavourite ? 'Remove' : 'Favorite'}
        </button> */}
        </div>
      </div>
    </div>
  );
};
