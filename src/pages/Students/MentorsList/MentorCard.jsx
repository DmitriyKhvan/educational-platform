import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Avatar } from '../../../widgets/Avatar/Avatar';
import FavIcon from '../../../assets/images/Favorite.png';
import Button from 'src/components/Form/Button';

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
    <div className="w-full sm:w-[300px]">
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
        <Avatar avatarUrl={mentor.avatar?.url} />
        {mentor.isFavourite && (
          <img
            className="absolute top-[5%] right-[5%] w-10 h-10 object-cover"
            src={FavIcon}
            alt=""
          />
        )}
      </div>

      <div className="flex justify-between items-start mt-[30px] h-[120px] overflow-hidden">
        <div>
          <h2 className="text-2xl sm:text-[30px] text-color-purple tracking-[-0.6px] mb-4 ">
            {resizerUsername(
              mentor?.user ? mentor?.user?.firstName : mentor.fullName,
            )}
          </h2>

          <h4 className="font-semibold text-[15px] text-color-light-grey leading-[18px] tracking-[-0.2px]">
            {mentor.university}
          </h4>

          <span className="text-[15px] text-color-light-grey leading-[18px] tracking-[-0.2px]">
            {mentor.degree} {mentor.major ? '/ ' + mentor.major : null}
          </span>
        </div>

        <div className="flex flex-col gap-[10px]">
          <Button
            theme="outline"
            className="w-[115px] p-0"
            onClick={() => handleMoreMentor(mentor)}
          >
            {t('learn_more', { ns: 'common' })}
          </Button>

          {mentor?.availabilities ? (
            <Link
              to={{
                pathname: `/student/schedule-lesson/select`,
                state: {
                  tutor: {
                    id: mentor.id,
                    firstName: mentor.user?.firstName,
                    lastName: mentor.user?.lastName,
                    avatar: mentor.avatar?.url,
                  },
                },
              }}
              style={{
                pointerEvents:
                  mentor?.availabilities?.length > 0 ? 'auto' : 'none',
              }}
            >
              <Button
                theme="outline"
                className="w-[115px] p-0"
                disabled={mentor?.availabilities?.length === 0}
              >
                {t('schedule', { ns: 'common' })}
              </Button>
            </Link>
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
