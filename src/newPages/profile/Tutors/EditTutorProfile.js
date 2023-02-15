import React from 'react'
import Layout from '../../../components/Layout'
import cls from  "./EditTutorProfile.module.scss"
import DelIcon from "../../../assets/del.png"
import Stick from "../../../assets/stick.png"
import SampleModal from './SampleModal'
import Biography from './edit/Biography'
import Education from './edit/Education'
import Intro from './edit/Intro'
import EditAvatarModal from './EditAvatarModal'
import BasicForm from './edit/BasicForm'
import { useAuth } from '../../../modules/auth'
import { MUTATION_UPDATE_TUTOR } from '../../../modules/auth/graphql'
import { useMutation } from '@apollo/client'
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'


const EditTutorProfile = () => {
  const [statusInfo , setStatusInfo] = React.useState("basic");
  const [showSample, setShowSample] = React.useState(false);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);
  const [updateTutor] = useMutation(MUTATION_UPDATE_TUTOR);
  const [profileImage, setProfileImage] = React.useState('')
  const { user, refetchUser } = useAuth()

  const hooks = [
    {
      caption: "Basic info",
      route: "basic",
      count:475
    }, 
    {
      caption: "Biography",
      route: "bio",
      count:1480
    },
    {
      caption: "Education",
      route: "edu",
      count:3367
    },
    {
      caption: "Introduction Video",
      route: "intro",
      count:5000
    }
  ]

  React.useEffect(() => {
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

  const closeSampleModal = () => setShowSample(false);

  const closeEditAvatarModal = () => setShowEditAvatar(false);

  const deleteAvatar = async () => {
    const { data } = await updateTutor({
      variables: {
        where: {
          id: parseInt(user?.tutor?.id)
        },
        data: { avatar: null}
      }
    })

    if(data) {
      refetchUser()
    }
  }

  const handleScrollToSelector = (data) => {
    setStatusInfo(data)
    hooks.forEach(item => {
      if(item.route.includes(data)) {
        window.scrollTo({
          behavior: "smooth",
          top: item.count
        })
      } 
    })
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
              {
                <img  src={profileImage} alt=''/>
              }
              </div>
              <div className={cls.avatar_right}>
                <button onClick={() => setShowEditAvatar(true)}>Upload New Photo</button>
                <button onClick={deleteAvatar}>
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
                <div 
                  key={item.caption}
                  onClick={() => {
                    handleScrollToSelector(item.route)
                  }} 
                  className={statusInfo === item.route ? cls.active_hook : ""} 
                >
                  {item.caption}
                </div>
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

          <BasicForm cls={cls}/>

          {/* Biography info */}



          <Biography cls={cls}/>
          
          {/* Edu */}
          
          <Education cls={cls}/>

          {/* Intro */}
            
          <Intro  cls={cls}/>
        </div>  
        
        {<SampleModal isOpen={showSample} closeModal={closeSampleModal}/>}
        {<EditAvatarModal profileImage={profileImage} closeModal={closeEditAvatarModal} isOpen={showEditAvatar} />}
      </div>
    </Layout>
  )
}

export default EditTutorProfile;