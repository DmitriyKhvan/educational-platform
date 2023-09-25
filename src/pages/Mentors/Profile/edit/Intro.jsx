import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../../../modules/auth';
import { useTranslation } from 'react-i18next';
import { renderVideo } from '../../../../utils/functions';
import Button from '../../../../components/Form/Button/Button';
import { HiOutlineVideoCamera } from 'react-icons/hi2';

const Intro = () => {
  const [t] = useTranslation('profile');
  const [videoLink, setVideoLink] = React.useState('');

  const actions = useAuth();

  const videoUrl = actions.user?.mentor?.videoUrl;

  React.useEffect(() => {
    setVideoLink(renderVideo(videoUrl) || '');
  }, [actions]);

  return (
    <div className="pl-[66px] py-[50px]" id={'intro'}>
      <h2 className="mb-5 text-[27px] font-medium leading-[33px] tracking-[-1px] text-color-dark-purple">
        {t('intro_video')}
      </h2>

      <div className="flex gap-10">
        <div>
          {videoLink?.length === 0 && (
            <div className="w-[420px] h-[342px] flex items-center justify-center">
              <h2 className="text-color-darker-grey">No video!</h2>
            </div>
          )}

          {videoLink?.length !== 0 && (
            <iframe
              className="w-[420px] h-[342px]"
              src={videoLink}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 0 }}
            ></iframe>
          )}
        </div>

        <div className="w-[420px] h-[342px] px-[30px] py-[15px] bg-white border border-solid border-color-border-grey rounded-[10px]">
          <HiOutlineVideoCamera className="text-color-purple text-[35px]" />

          <h3 className="mt-5 font-semibold text-[20px] leading-6 trackign-[-0.6px] text-color-purple">
            {t('upload_video')}
          </h3>

          <Button theme="outline" className="w-full mt-3 ml-[-2px]">
            <Link to={'/mentor/edit-profiles/submit-video'}>
              {t('submit_video')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
