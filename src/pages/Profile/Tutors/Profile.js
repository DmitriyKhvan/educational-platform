import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { getTutorInfo } from '../../../actions/tutor'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'

import "./TutorProfile.scss"

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

  return (
    <Layout>
      <header className='profile_header'>
        <div className='profile_header_row'>
          <img className='profile_image' src={profileImage} alt='Profile Avatar' />

          <div className='tutor_name'>
              <h1>{user.full_name}</h1>
              <h2 className='mt-1 text-primary'>
                {tutor?.degree ? tutor.degree : "B.A. English, Stanford University"}
              </h2>
          </div>
        </div>
      </header>
      <main className='profile_content'>
        <Link to={"/tutor/edit-profile"}>Edit Profile</Link>
        <div className='profile_content_row'>
          <div className="profile_content_row_left">
            <h2>About me</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

              Varius vel pharetra vel turpis nunc eget. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. 
            </p>
          </div>  

          <div className='profile_content_row_right'>
            <section>
              <div className=''>
                <h1>Location</h1>
                <h2>🇺🇸 San Diego, CA</h2>
              </div>
              <div className=''>
                <h1>Time zone</h1>
                <h2>PST (GMT-8)</h2>
              </div>
              <div className=''>
                <h1>Email Address</h1>
                <h2>jessica.brighton@gmail.com</h2>
              </div>
            </section>
            <section>
              <div className=''>
                <h1>Phone Number</h1>
                <h2>(555) 555-5555</h2>
              </div>
              
              <div className=''>
                <h1>University</h1>
                <h2>Stanford University</h2>
              </div>
            </section>
          </div>
        </div>
        
      </main>
      <footer className='profile_footer'>
        <section className='profile_footer_left'>
          <div>
            <h2>Introduction video</h2>
          </div>
          <div className='video'>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/nLpK42Fjgsg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </section>
        <section className='profile_footer_right'>
          <div className='profile_footer_right_topics'>
            <h2>Approved topics</h2>
            <div className='approved_row'>
              <button className='appr_topic'>
                Topic A
              </button>
              <button className='appr_topic'>
                Topic A
              </button>
              <button className='appr_topic'>
                Topic A
              </button>
              <button className='appr_add'>
                Add More
              </button>
            </div>
          </div>
          <div className='profile_footer_right_students'>
            <div className='profile_footer_right_students_title'>
              <h2>My students</h2>
              <Link to={""}>
                View more
              </Link>
            </div>

            <div className='profile_footer_right_students_card'>
              <div className='st_card'>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
                <h3>Lisa</h3>
              </div>
              <div className='st_card'>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
                <h3>Lisa</h3>
              </div>
              <div className='st_card'>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
                <h3>Lisa</h3>
              </div>
            </div>

            <div className='randomizer'>
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
