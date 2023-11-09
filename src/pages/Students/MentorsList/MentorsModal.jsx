import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Avatar } from '../../../widgets/Avatar/Avatar';
import Button from '../../../components/Form/Button/Button';
import FavIcon from '../../../assets/images/Favorite.png';
import { HiCheckBadge } from 'react-icons/hi2';

const MentorsModal = ({ mentor, setShowMentorModal }) => {
  const [t] = useTranslation(['common', 'profile']);

  const [videoLink, setVideoLink] = React.useState('');

  React.useEffect(() => {
    setVideoLink(mentor?.videoUrl || '');
  }, [mentor]);

  return (
    <div className="flex h-full bg-white ">
      {videoLink?.length === 0 && (
        <div className="flex items-center justify-center w-[460px] h-full pl-4 py-4">
          <Avatar avatarUrl={mentor?.avatar?.url} />
        </div>
      )}

      {videoLink?.length !== 0 && (
        <iframe
          className="w-2/5 h-full"
          src={videoLink}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0 }}
        ></iframe>
      )}

      <div className="w-3/5 h-full overflow-auto py-[65px] px-[50px] break-word hyphens-auto">
        {mentor?.isFavourite && (
          <img src={FavIcon} alt="" className="absolute r-[2%] t-[3%]" />
        )}

        <h1 className="mb-3 text-[40px] leading-[48px] tracking-[-1px] text-color-dark-purple">{`${
          mentor?.fullName || mentor?.user?.fullName
        }`}</h1>

        <div className="flex gap-[25px]">
          <div className="pb-3">
            <h3 className="flex items-center justify-between font-medium text-color-light-grey text-[15px] leading-[28px] tracking-[-0.2px]">
              <span>{t('university', { ns: 'profile' })}</span>
              <HiCheckBadge className="text-color-purple text-xl" />
            </h3>
            <p className="font-semibold text-color-dark-purple text-[15px] leading-[18px] tracking-[-0.2px]">
              {mentor?.university}
            </p>
          </div>
          <div className="pb-3">
            <h3 className="font-medium text-color-light-grey text-[15px] leading-[28px] tracking-[-0.2px]">
              {t('university_degree', { ns: 'profile' })} /{' '}
              {t('university_major', { ns: 'profile' })}
            </h3>
            <p className="font-semibold text-color-dark-purple text-[15px] leading-[18px] tracking-[-0.2px]">
              {mentor?.degree} {mentor?.major ? '/ ' + mentor?.major : null}
            </p>
          </div>
        </div>

        {mentor?.introduction && (
          <div className="py-3">
            <h3 className="font-semibold text-[15px] leading-[18px] tracking-[-0.2px] text-color-light-grey">
              {t('biography', { ns: 'profile' })}
            </h3>
            <p className="font-medium text-color-dark-purple mt-2 text-[15px] leading-[21px] tracking-[-0.6px]">
              {mentor?.introduction}
            </p>
          </div>
        )}

        {mentor?.relevantExperience && (
          <div className="py-3">
            <h3 className="font-semibold text-[15px] leading-[18px] tracking-[-0.2px] text-color-light-grey">
              {t('bio_experience_label', { ns: 'profile' })}
            </h3>
            <p className="font-medium text-color-dark-purple mt-2 text-[15px] leading-[21px] tracking-[-0.6px]">
              {mentor?.relevantExperience}
            </p>
          </div>
        )}

        {mentor?.uniqueFacts && (
          <div className="py-3">
            <h3 className="font-semibold text-[15px] leading-[18px] tracking-[-0.2px] text-color-light-grey">
              {t('bio_facts_label', { ns: 'profile' })}
            </h3>
            <p className="font-medium text-color-dark-purple mt-2 text-[15px] leading-[21px] tracking-[-0.6px]">
              {mentor?.uniqueFacts}
            </p>
          </div>
        )}

        <div className="flex justify-end mt-[15px] gap-[10px]">
          <Button
            className="px-[15px] py-[10px]"
            theme="outline"
            onClick={() => setShowMentorModal(false)}
          >
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button
            theme="purple"
            className="px-[15px] py-[10px]"
            disabled={mentor?.availabilities?.length === 0}
          >
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
              {t('schedule')}
            </Link>
          </Button>
          {/* <button>Message</button> */}
          {/* <button onClick={() => handleStatusTutor(parseInt(tutorId))}>
                {mentor?.isFavourite ? 'Remove' : 'Favorite'}
              </button> */}
        </div>
      </div>
    </div>
  );
};

export default MentorsModal;
