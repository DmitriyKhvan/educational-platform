import React from 'react'
import { Link } from 'react-router-dom'

import VideoIcon from "../../../../assets/Video.png"

const Intro = ({id, cls}) => {
  return (
    <div className={cls.editProfile_container_forms_intro} id={id}>
      <div className={cls.editProfile_container_forms_intro_title}>
        <h2>Introduction Video</h2>

        <h3>My introduction video</h3>
      </div>

      <div className={cls.editProfile_container_forms_intro_row}>
        <div className={cls.intro_left}>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/nLpK42Fjgsg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div className={cls.intro_right}>
          <div className={cls.intro_right_card}>
            <img src={VideoIcon} alt=""/>

            <h3>Upload New Video</h3>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ligula nisi.  
            </p>
            <p>
              Quisque luctus arcu nec scelerisque. Mauris dictum lacus nec feugiat placerat.
            </p>

            <button >
              <Link to={"/tutor/edit-profiles/submit-video"}>
                Submit a New Video
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intro
