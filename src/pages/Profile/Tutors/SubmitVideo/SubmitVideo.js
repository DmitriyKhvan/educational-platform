

import React from 'react'
import Layout from '../../../../components/Layout'

import cls from  "./SubmitVideo.module.scss"

import VideoContainer from "../../../../assets/videos/video container.png"
import VideoLayer from "../../../../assets/videos/VIDEO LAYER.png"
import { useHistory } from 'react-router-dom'
import { ME_QUERY, MUTATION_UPDATE_TUTOR } from '../../../../modules/auth/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { useAuth } from '../../../../modules/auth'
import { useForm } from 'react-hook-form'



const SubmitVideo = () => {
  const history = useHistory()

  const [updateTutor,  { loading: updateUserLoading }] = useMutation(MUTATION_UPDATE_TUTOR);


  const { user , refetchUser} = useAuth();

  const {
    register,
    handleSubmit
  } = useForm({
    mode:"onBlur"
  });

  const handleEditVideo = async (area) => {
    const url = area.videoUrl.slice(17,);

    if(url) {
      const {data} = await updateTutor({
        variables: {
          where: {
            id: parseInt(user?.tutor?.id),
          },
          data: {videoUrl: url}
        }
      })

      if(data) {
        history.push('/tutor/edit-profiles/submit-videos/submited')
      }
    }

    await refetchUser()
  }

  const cancelVideo = () => {
    history.push("/tutor/edit-profile")
  }

  return (
    <Layout>
      <div className={cls.submitVideo_container}>
        <div className={cls.submitVideo_container_title}>
          <h2>Edit profile</h2>
        </div>

        <div className={cls.submitVideo_container_record}>
          <h2>Record your video</h2>

          <div className={cls.submitVideo_container_record_row}>
            <form onSubmit={handleSubmit(handleEditVideo)} className={cls.record_left}>
              <div 
                className={cls.video_player_background} 
                style={{background: `url("${VideoContainer}") center / cover`}}
              > 
                <img src={VideoLayer} alt=''/>
              </div>

              <button className={cls.recording_button}>
                <span className={cls.record_icon}></span>
                Start Recording
              </button>

              <div className={cls.record_youtube}>
                <p>Have a pre-recorded video on Youtube or Vimeo?</p>

                <div className={cls.record_youtube_row}>
                  <input 
                    type={"text"}
                    placeholder="youtube.com/video"
                    {...register("videoUrl")}
                  />
                  <button>Submit</button>
                </div>
              </div>

              <div className={cls.record_footer_buttons}>
                  <button onClick={cancelVideo}>
                    Cancel and Return
                  </button>
                  <button type='submit'>
                    Submit My Video
                  </button>
                </div>
            </form>

            <div className={cls.record_right}>
              <div className={cls.instruction_card}>
                <h3>Instructions</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ligula nisi.
                </p>
                <p>
                  Aliquam ultrices, dui quis convallis aliquam, erat odio rhoncus purus, quis posuere leo tellus.
                </p>
                <p>
                  Quisque luctus arcu nec scelerisque consectetur. Mauris dictum lacus nec feugiat placerat.
                </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/cwbC8rJ9TPA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SubmitVideo
