import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { getTutorInfo } from '../../../actions/tutor'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

import cls from  "./TutorProfile.module.scss"
import { useAuth } from '../../../modules/auth'

const Profile = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const [profileImage, setProfileImage] = useState('')
  const border = { border: '1px solid #DEDEE1' }

  useEffect(() => {
    if (user.avatar) {
      setProfileImage(user.avatar)
    } else if (user.gender === 'female') {
      setProfileImage(femaleAvatar)
    } else if (user.gender === 'male') {
      setProfileImage(maleAvatar)
    } else {
      setProfileImage(maleAvatar)
    }
  }, [user])

  useEffect(() => {
    if (user.tutor_profile?.id) {
      dispatch(getTutorInfo(user.tutor_profile?.id))
    }
  }, [user, dispatch])

  const actions = useAuth();

  console.log(actions)

  return (
    <Layout>
      <header className={cls.profile_header}>
        <div className={cls.profile_header_row}>
          {
          !actions?.user?.avatar 
          ?   <img 
                className={cls.profile_image} 
                src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' 
                alt=''
              /> 
          : <img className='avatar_preview' src={actions?.user.avatar} alt=''/>
        }

          <div className={cls.tutor_name}>
              <h1>{actions?.user.fullName}</h1>
              <h2 className={cls.text_primary}>
                {tutor?.degree ? tutor.degree : "B.A. English, Stanford University"}
              </h2>
          </div>
        </div>
      </header>
      <main className={cls.profile_content}>
        <Link to={"/tutor/edit-profile"}>Edit Profile</Link>
        <div className={cls.profile_content_row}>
          <div className={cls.profile_content_row_left}>
            <h2>About me</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

              Varius vel pharetra vel turpis nunc eget. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. 
            </p>
          </div>  

          <div className={cls.profile_content_row_right}>
            <section>
              <div className=''>
                <h1>Location</h1>
                <h2>
                  {
                    actions.user?.country 
                      ? actions.user?.country
                      : "🇺🇸 San Diego, CA"
                  }
                </h2>
              </div>
              <div className=''>
                <h1>Time zone</h1>
                <h2>{
                  actions.user?.timeZone
                    ? actions.user?.timeZone
                    : "PST (GMT-8)" 
                }</h2>
              </div>
              <div className=''>
                <h1>Email Address</h1>
                <h2>{actions.user?.email}</h2>
              </div>
            </section>
            <section>
              <div className=''>
                <h1>Phone Number</h1>
                <h2>{actions.user?.phoneNumber}</h2>
              </div>
              
              <div className=''>
                <h1>University</h1>
                <h2>Stanford University</h2>
              </div>
            </section>
          </div>
        </div>
        
      </main>
      <footer className={cls.profile_footer}>
        <section className={cls.profile_footer_left}>
          <div>
            <h2>Introduction video</h2>
          </div>
          <div className={cls.video}>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/nLpK42Fjgsg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </section>
        <section className={cls.profile_footer_right}>
          <div className={cls.profile_footer_right_topics}>
            <h2>Approved topics</h2>
            <div className={cls.approved_row}>
              <button className={cls.appr_topic}>
                Topic A
              </button>
              <button className={cls.appr_topic}>
                Topic A
              </button>
              <button className={cls.appr_topic}>
                Topic A
              </button>
              <button className={cls.appr_add}>
                Add More
              </button>
            </div>
          </div>
          <div className={cls.profile_footer_right_students}>
            <div className={cls.profile_footer_right_students_title}>
              <h2>My students</h2>
              <Link to={""}>
                View more
              </Link>
            </div>

            <div className={cls.profile_footer_right_students_card}>
              <div className={cls.st_card}>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
                <h3>Lisa</h3>
              </div>
              <div className={cls.st_card}>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
                <h3>Lisa</h3>
              </div>
              <div className={cls.st_card}>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
                <h3>Lisa</h3>
              </div>
            </div>

            <div className={cls.randomizer}>
              <button>
                Randomize
              </button>
            </div>
          </div>
        </section>  
      </footer>
    </Layout>
  )
}

export default Profile;
