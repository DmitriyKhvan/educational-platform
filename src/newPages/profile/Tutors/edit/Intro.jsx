import React from 'react';
import { Link } from 'react-router-dom';

import VideoIcon from '../../../../assets/Video.png';
import { useAuth } from '../../../../modules/auth';
import { useTranslation } from 'react-i18next';

const Intro = ({ cls }) => {
  const [t] = useTranslation('profile');
  const actions = useAuth();

  const videoUrl = actions.user?.tutor?.videoUrl;

  return (
    <div className={cls.editProfile_container_forms_intro} id={'intro'}>
      <div className={cls.editProfile_container_forms_intro_title}>
        <h2>{t('intro_video')}</h2>

        <br />
        {/* <h3>My introduction video</h3> */}
      </div>

      <div className={cls.editProfile_container_forms_intro_row}>
        <div className={cls.intro_left}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoUrl}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 0 }}
          ></iframe>
        </div>
        <div className={cls.intro_right}>
          <div className={cls.intro_right_card}>
            <img src={VideoIcon} alt="" />

            <h3>{t('upload_video')}</h3>

            {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
              amet ligula nisi.
            </p>
            <p>
              Quisque luctus arcu nec scelerisque. Mauris dictum lacus nec
              feugiat placerat.
            </p> */}

            <button>
              <Link to={'/tutor/edit-profiles/submit-video'}>
                {t('submit_video')}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
