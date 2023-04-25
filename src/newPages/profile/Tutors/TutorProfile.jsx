import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

import cls from './TutorProfile.module.scss'
import { useAuth } from '../../../modules/auth'

const TutorProfile = () => {
  const [t] = useTranslation(['profile', 'common'])
  const [profileImage, setProfileImage] = useState('')
  const actions = useAuth()

  const user = actions?.user

  useEffect(() => {
    if (user?.tutor?.avatar) {
      setProfileImage(user?.tutor?.avatar?.url)
    } else if (user.gender === 'female') {
      setProfileImage(femaleAvatar)
    } else if (user.gender === 'male') {
      setProfileImage(maleAvatar)
    } else {
      setProfileImage(maleAvatar)
    }
  }, [user])

  const videoUrl = actions.user?.tutor?.videoUrl

  return (
    <div className={cls.profile_page}>
      <header className={cls.profile_header}>
        <div className={cls.profile_header_row}>
          <img className='avatar_preview' src={profileImage} alt='' />

          <div className={cls.tutor_name}>
            <h1>{actions?.user.fullName}</h1>
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

            <p>{actions.user?.tutor?.introduction}</p>
          </div>

          <div className={cls.profile_content_row_right}>
            <section>
              <div className=''>
                {actions.user?.country && (
                  <>
                    <h1>{t('country', { ns: 'common' })}</h1>
                    <h2>{actions.user?.country}</h2>
                  </>
                )}
              </div>
              <div className=''>
                {actions.user?.timezone && (
                  <>
                    <h1>{t('timezone', { ns: 'common' })}</h1>
                    <h2>{actions.user?.timezone}</h2>
                  </>
                )}
              </div>
              <div className=''>
                {actions.user?.email && (
                  <>
                    <h1>{t('email')}</h1>
                    <h2>{actions.user?.email}</h2>
                  </>
                )}
              </div>
            </section>
            <section>
              <div className=''>
                {actions.user?.phoneNumber && (
                  <>
                    <h1>{t('phone_number', { ns: 'common' })}</h1>
                    <h2>{actions.user?.phoneNumber}</h2>
                  </>
                )}
              </div>

              <div className=''>
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
          <div className={cls.video}>
            <iframe
              width='560'
              height='315'
              src={`https://www.youtube.com/embed/${videoUrl}`}
              title='YouTube video player'
              frameborder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowfullscreen
            ></iframe>
          </div>
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
                  src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg'
                  alt=''
                />
                <h3>Lisa</h3>
              </div>
              <div className={cls.st_card}>
                <img
                  src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg'
                  alt=''
                />
                <h3>Lisa</h3>
              </div>
              <div className={cls.st_card}>
                <img
                  src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg'
                  alt=''
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
  )
}

export default TutorProfile
