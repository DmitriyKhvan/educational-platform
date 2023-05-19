import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png';

import cls from './TutorProfile.module.scss';
import { useAuth } from '../../../modules/auth';

const TutorProfile = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [profileImage, setProfileImage] = useState('');
  const [videoLink, setVideoLink] = React.useState('');

  const [aboutText, setAbout] = React.useState('');

  const actions = useAuth();

  const user = actions?.user;

  useEffect(() => {
    if (user?.tutor?.avatar) {
      setProfileImage(user?.tutor?.avatar?.url);
    } else if (user.gender === 'female') {
      setProfileImage(femaleAvatar);
    } else if (user.gender === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [user]);

  const videoUrl = actions.user?.tutor?.videoUrl;

  function renderVideo() {
    if (!videoUrl) {
      return;
    }
    const url = videoUrl?.split('');
    var yt = ['y', 'o', 'u', 't', 'u', 'b', 'e'];
    var codeURL = [];
    var isVideo = null;

    for (var i = 0; i < url.length; i++) {
      if (yt.includes(url[i])) {
        isVideo = true;
        if (url.includes('=')) {
          for (var i = 0; i < url.length; i++) {
            if (url[i] === '=') {
              codeURL = url.slice(i + 1);
            }
          }
        } else {
          codeURL = url.slice(17);
        }
      } else {
        isVideo = false;
        codeURL = url.slice(18);
      }
    }

    const prepareVideoToDB = codeURL.join('');
    var video = '';

    if (isVideo) {
      video = 'https://www.youtube.com/embed/' + prepareVideoToDB;
    } else {
      video = 'https://player.vimeo.com/video/' + prepareVideoToDB;
    }

    if (video) {
      setVideoLink(video);
    }
  }

  function renderAbout() {
    var text = actions.user?.tutor?.introduction;
    var textLength = actions.user?.tutor?.introduction?.length;
    var news = '';
    if (textLength) {
      for (var i = 0; i < textLength; i++) {
        if (i === 50) {
          news += '\n';
        } else if (i === 100) {
          news += '\n';
        } else if (i === 150) {
          news += '\n';
        } else if (i === 200) {
          news += '\n';
        } else if (i === 250) {
          news += '\n';
        } else if (i === 300) {
          news += '\n';
        } else if (i === 350) {
          news += '\n';
        } else {
          news += text[i];
        }
      }
    }

    if (news) {
      setAbout(news);
    }
  }

  React.useEffect(() => {
    renderAbout();
    renderVideo();
}, [user]);

  return (
    <div className={cls.profile_page}>
      <header className={cls.profile_header}>
        <div className={cls.profile_header_row}>
          <img className="avatar_preview" src={profileImage} alt="" />

          <div className={cls.tutor_name}>
            <h1>
              {actions?.user?.fullName ? actions?.user.fullName : 'Nickname'}
            </h1>
            <h2 className={cls.text_primary}>
              {actions?.user?.tutor?.degree && actions?.user?.tutor?.university
                ? `
                          ${actions?.user?.tutor?.degree},
                          ${actions?.user?.tutor?.university}
                        `
                : ''}
            </h2>
          </div>
        </div>
      </header>
      <main className={cls.profile_content}>
        <Link to={'/tutor/edit-profile'}>{t('edit_profile')}</Link>
        <div className={cls.profile_content_row}>
          <div className={cls.profile_content_row_left}>
            <h2>{t('summary')}</h2>

            <p>{aboutText}</p>
          </div>

          <div className={cls.profile_content_row_right}>
            <section>
              <div className="">
                {actions.user?.country && (
                  <>
                    <h1>{t('country', { ns: 'common' })}</h1>
                    <h2>{actions.user?.country}</h2>
                  </>
                )}
              </div>
              <div className="">
                {actions.user?.timezone && (
                  <>
                    <h1>{t('timezone', { ns: 'common' })}</h1>
                    <h2>{actions.user?.timezone}</h2>
                  </>
                )}
              </div>
              <div className="">
                {actions.user?.email && (
                  <>
                    <h1>{t('email')}</h1>
                    <h2>{actions.user?.email}</h2>
                  </>
                )}
              </div>
            </section>
            <section>
              <div className="">
                {actions.user?.phoneNumber && (
                  <>
                    <h1>{t('phone_number', { ns: 'common' })}</h1>
                    <h2>{actions.user?.phoneNumber}</h2>
                  </>
                )}
              </div>

              <div className="">
                {actions.user?.tutor?.university && (
                  <>
                    <h1>{t('university')}</h1>
                    <h2>{actions.user?.tutor?.university}</h2>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className={cls.profile_footer}>
        <section className={cls.profile_footer_left}>
          <div>
            <h2>{t('intro_video')}</h2>
          </div>

          {videoLink?.length === 0 && (
            <div className={cls.no_video}>
              <h2>No video!</h2>
            </div>
          )}

          {videoLink?.length !== 0 && (
            <div className={cls.video}>
              <iframe
                width="560"
                height="315"
                src={videoLink}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ border: 0 }}
              ></iframe>
            </div>
          )}
        </section>
        <section className={cls.profile_footer_right}>
          <div className={cls.profile_footer_right_topics}>
            <h2>{t('topics')}</h2>
            <div className={cls.approved_row}>
              <button className={cls.appr_topic}>Topic A</button>
              <button className={cls.appr_topic}>Topic A</button>
              <button className={cls.appr_topic}>Topic A</button>
              <button className={cls.appr_add}>Add More</button>
            </div>
          </div>
          <div className={cls.profile_footer_right_students}>
            <div className={cls.profile_footer_right_students_title}>
              <h2>{t('my_students')}</h2>
              <Link to={''}>{t('view_more', { ns: 'common' })}</Link>
            </div>

            <div className={cls.profile_footer_right_students_card}>
              <div className={cls.st_card}>
                <img
                  src="https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg"
                  alt=""
                />
                <h3>Lisa</h3>
              </div>
              <div className={cls.st_card}>
                <img
                  src="https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg"
                  alt=""
                />
                <h3>Lisa</h3>
              </div>
              <div className={cls.st_card}>
                <img
                  src="https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg"
                  alt=""
                />
                <h3>Lisa</h3>
              </div>
            </div>

            <div className={cls.randomizer}>
              <button>Randomize</button>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
};

export default TutorProfile;
