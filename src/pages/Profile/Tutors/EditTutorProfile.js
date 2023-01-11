

import React from 'react'
import Layout from '../../../components/Layout'
import "./EditTutorProfile.scss"
import DelIcon from "../../../assets/del.png"
import Stick from "../../../assets/stick.png"
import SampleModal from './SampleModal'
import { useForm } from 'react-hook-form'
import BasicForm from './edit/BasicForm'
import Biography from './edit/Biography'
import Education from './edit/Education'
import Intro from './edit/Intro'

const EditTutorProfile = () => {
  const [statusInfo , setStatusInfo] = React.useState("basic");
  const [showSample, setShowSample] = React.useState(false)

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

  const closeModal = () => setShowSample(false)

  return (
    <Layout>
      <div className='editProfile_container'>
        <div className='editProfile_container_row'>
          <section className='editProfile_left'>
            <div className='editProfile_left_title'>
              <h2>Edit profile</h2>
            </div> 

            <div className='editProfile_left_photo'>
              <div className='editProfile_left_photo_title'>
                <h2>Change Profile Photo</h2>
              </div>
            </div>

            <div className='editProfile_left_avatar'>
              <div className='avatar_left'>
                <img src='https://www.heysigmund.com/wp-content/uploads/building-resilience-in-children.jpg' alt=''/>
              </div>
              <div className='avatar_right'>
                <button>Upload New Photo</button>
                <button>
                  <img src={DelIcon} alt=''/>
                  Delete Photo
                </button>
              </div>
            </div>

            <div className='editProfile_left_content'>
              <p>Recommendations on the photo file format and max size.</p>
            </div>
          </section>
          <section className='editProfile_right'>
            <div className='editProfile_right_hooks'>
              {hooks.map(item => (
                <a 
                  key={item.caption}
                  onClick={() => setStatusInfo(item.route)} 
                  className={statusInfo === item.route ? "active_hook" : ""} 
                  href={`#${item.route}`}
                >
                  {item.caption}
                </a>
              ))}
            </div>

            <div className='editProfile_right_guild'>
              <div className='guild_card'>
                <img src={Stick} alt=""/>

                <h2>Guidelines on taking a proper photo.</h2>
                <p>Lorem ipsum dolor sit amet, consectetur elit.</p>

                <button onClick={() => setShowSample(true)}>View Sample Photos</button>
              </div>
            </div>
          </section>
        </div>

        <div className='editProfile_container_forms'>
          
          <form className='editProfile_container_forms_basic' id='basic'>    
            <BasicForm />
          </form>

          <form className='editProfile_container_forms_biography' id='bio'>
            <Biography />
          </form>

          <form className='editProfile_container_forms_edu' id='edu'>
            <Education />
          </form>
            
          <Intro id="intro"/>
        </div>  

        {<SampleModal isOpen={showSample} closeModal={closeModal}/>}
      </div>
    </Layout>
  )
}

export default EditTutorProfile