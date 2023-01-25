

import React from 'react'
import Layout from '../../../components/Layout'
import cls from  "./EditTutorProfile.module.scss"
import DelIcon from "../../../assets/del.png"
import Stick from "../../../assets/stick.png"
import SampleModal from './SampleModal'
import { useForm } from 'react-hook-form'
import Biography from './edit/Biography'
import Education from './edit/Education'
import Intro from './edit/Intro'
import EditAvatarModal from './EditAvatarModal'
import Submit from './edit/Submit'
import { TextInput } from './edit/TextInput'
import { Switch } from 'react-router-dom'
import { useAuth } from '../../../modules/auth'

const EditTutorProfile = () => {
  const [statusInfo , setStatusInfo] = React.useState("basic");
  const [showSample, setShowSample] = React.useState(false);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);

  const { updateUser } = useAuth();


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
    formState: {errors},
    register
  } = useForm({ 
    mode:"onBlur"
  })

  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  const closeSampleModal = () => setShowSample(false);

  const closeEditAvatarModal = () => setShowEditAvatar(false);


  const handleEditBasicInfo = async (area) => {

   const {data} = await updateUser(area)

   console.log(data)

  }

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
          
          {/* Basic Info */}

          <form 
            onSubmit={handleSubmit(handleEditBasicInfo)} 
            className={cls.editProfile_container_forms_basic} id='basic'
          >    
            <div>
              <div className={cls.editProfile_container_forms_basic_title}>
                <h2>Basic Information</h2>
              </div>
      
              <TextInput
                type="text"
                value="Jessica"
                cls={cls}
                label="First name"
                {...register("firstName")}
              />

              <TextInput 
                type="text"
                value="Brighton"
                label="Last name"
                {...register("lastName")}
              />

              <TextInput 
                type="email"
                value="jessica.brighton@gmail.com"
                label="Email address"
                {...register("email")}
              />

              <TextInput 
                type="text"
                value="+1(424)1234567"
                label="Phone number"
                {...register("phoneNumber")}
              />

              <div className={cls.editProfile_container_forms_basic_switch}>
                <Switch {...label} defaultChecked />
                <h3>Receive SMS notifications</h3>
              </div>

              <div className={cls.form_divider}>
                <p>Location</p>

                <select {...register("country")}>
                  <option value={"United States of America"}>United States of America</option>
                </select>
              </div>

              <TextInput 
                type="text"
                value="123 Market St"
                label="Address"
                {...register("address")}
              />

              <div className={cls.form_divider}>
                <p>Time zone</p>

                <select {...register("timeZone")}>
                  <option value={"usa"}>Pacific Standard Time (GMT-8)</option>
                </select>
              </div>

            </div>

            <Submit />
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