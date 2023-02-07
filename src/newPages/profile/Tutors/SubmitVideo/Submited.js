


import React from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../../../../components/Layout'

import cls from  "./Submited.module.scss"

const Submited = () => {
  const history = useHistory()
  const notify = () => toast("Introduction video is changed!")

  return (
    <Layout>
      <div className={cls.submited_container}>
        <div className={cls.submited_container_title}>
          <h2>Edit profile</h2>
        </div>
        <div className={cls.submited_container_videoSubmited}>
          <h2>Video Submitted 🎉</h2>
          <div className={cls.submited_container_videoSubmited_card}>
            <h3>We’ll review and approve your video.</h3>
            <p>
              Thank you for making your teaching intro video! 
            </p>
            <p>
              <b>Nao Now</b> will review your video and ensure no changes need to be made before students are able to book lessons with you.
            </p>
            <p>
              You will receive an email notification when the video review is completed. 
            </p>
          </div>

          <button onClick={() => {
            history.push("/student/profile")
            notify()
          }} >Return to My Profile</button>
        </div>
      </div>
    </Layout>
  )
}

export default Submited