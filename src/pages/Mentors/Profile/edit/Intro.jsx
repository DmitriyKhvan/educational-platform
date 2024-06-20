import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from 'src/app/providers/AuthProvider';
import { useTranslation } from 'react-i18next';

import Button from '../../../../components/Form/Button/Button';
import ReactPlayer from 'react-player';
import { BsPlayFill } from 'react-icons/bs';

const Intro = () => {
  const [t] = useTranslation('profile');

  const { user } = useAuth();
  const videoUrl = user?.mentor?.videoUrl;

  return (
    <div className="" id={'intro'}>
      <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
        {t('intro_video')}
      </h2>

      <div className="flex flex-wrap gap-7">
        {videoUrl?.length === 0 ? (
          <h2>No video!</h2>
        ) : (
          <ReactPlayer
            playIcon={
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-color-purple rounded-full">
                <BsPlayFill className="text-white text-2xl" />
              </div>
            }
            light
            url={user?.mentor?.videoUrl}
            playing
            controls
            volume={0.8}
            width="100%"
            height="267px"
          />
        )}

        <Button
          theme="clear"
          className="w-full bg-color-purple/10 text-color-purple"
        >
          <Link to={'/mentor/profile/edit/submit-video'}>
            {t('upload_video')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Intro;
