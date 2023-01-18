

import React from 'react'
import Layout from '../../../components/Layout'
import cls from  "./EditTutorProfile.module.scss"
import DelIcon from "../../../assets/del.png"
import Stick from "../../../assets/stick.png"
import SampleModal from './SampleModal'
import { useForm } from 'react-hook-form'
import BasicForm from './edit/BasicForm'
import Biography from './edit/Biography'
import Education from './edit/Education'
import Intro from './edit/Intro'
import EditAvatarModal from './EditAvatarModal'

const EditTutorProfile = () => {
  const [statusInfo , setStatusInfo] = React.useState("basic");
  const [showSample, setShowSample] = React.useState(false);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);

  const hooks = [
    {
      caption: "Basic info",
      route: "basic"
    }, 
    {
      caption: "Biography",
      route: "bio"
    },
    {
      caption: "Education",
      route: "edu"
    },
    {
      caption: "Introduction Video",
      route: "intro"
    }
  ]

  const {
    handleSubmit,
    formState: {errors}
  } = useForm({ 
    mode:"onBlur"
  })

  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  const closeSampleModal = () => setShowSample(false);

  const closeEditAvatarModal = () => setShowEditAvatar(false);

  return (
    <Layout>
      <div className={cls.editProfile_container}>
        <div className={cls.editProfile_container_row}>
          <section className={cls.editProfile_left}>
            <div className={cls.editProfile_left_title}>
              <h2>Edit profile</h2>
            </div> 

            <div className={cls.editProfile_left_photo}>
              <div className={cls.editProfile_left_photo_title}>
                <h2>Change Profile Photo</h2>
              </div>
            </div>

            <div className={cls.editProfile_left_avatar}>
              <div className={cls.avatar_left}>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
              </div>
              <div className={cls.avatar_right}>
                <button onClick={() => setShowEditAvatar(true)}>Upload New Photo</button>
                <button>
                  <img src={DelIcon} alt=''/>
                  Delete Photo
                </button>
              </div>
            </div>

            <div className={cls.editProfile_left_content}>
              <p>Recommendations on the photo file format and max size.</p>
            </div>
          </section>
          <section className={cls.editProfile_right}>
            <div className={cls.editProfile_right_hooks}>
              {hooks.map(item => (
                <a 
                  key={item.caption}
                  onClick={() => setStatusInfo(item.route)} 
                  className={statusInfo === item.route ? cls.active_hook : ""} 
                  href={`#${item.route}`}
                >
                  {item.caption}
                </a>
              ))}
            </div>

            <div className={cls.editProfile_right_guild}>
              <div className={cls.guild_card}>
                <img src={Stick} alt=""/>

                <h2>Guidelines on taking a proper photo.</h2>
                <p>Lorem ipsum dolor sit amet, consectetur elit.</p>

                <button onClick={() => setShowSample(true)}>View Sample Photos</button>
              </div>
            </div>
          </section>
        </div>

        <div className={cls.editProfile_container_forms}>
          
          <form className={cls.editProfile_container_forms_basic} id='basic'>    
            <BasicForm cls={cls}/>
          </form>

          <form className={cls.editProfile_container_forms_biography} id='bio'>
            <Biography cls={cls}/>
          </form>

          <form className={cls.editProfile_container_forms_edu} id='edu'>
            <Education cls={cls}/>
          </form>
            
          <Intro id="intro" cls={cls}/>
        </div>  

        {<SampleModal isOpen={showSample} closeModal={closeSampleModal}/>}
        {<EditAvatarModal closeModal={closeEditAvatarModal} isOpen={showEditAvatar} />}
      </div>
    </Layout>
  )
}

export default EditTutorProfile