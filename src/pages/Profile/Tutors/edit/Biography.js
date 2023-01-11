

import React from 'react'
import Stick from "../../../../assets/stick.png"
import Submit from './Submit'
import { Textarea } from './Textarea'

const Biography = () => {
  return (
    <div>
      <div className='editProfile_container_forms_biography_title'>
        <h2>Biography</h2>
      </div>

      <div className='bio_guild_card'>
        <img src={Stick} alt=""/>
        <h3>
          Guidelines on writing a biography. 
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ligula nisi. 
        </p>
        <p>
          Aliquam ultrices, dui quis convallis aliquam, erat odio rhoncus purus, quis posuere leo tellus.
        </p>
      </div>

      <Textarea 
        placeholder="Input"
        label="Introduction"
        text="Include your name, university, degree(s), academic distinctions,
        and why students should book lessons with you."
      />

      <Textarea 
        placeholder="Input"
        label="Relevant Experience"
        text="Include tutoring, teaching, or other work experience
        that is notable or related to your education."
      />

      <Textarea 
        placeholder="Input"
        label="Unique facts about yourself"
        text="For example, honors, accomplishments, hobbies, interests, or other jobs.
        Try to show a bit of your personality!"
      />

      <Submit />
    </div>
  )
}

export default Biography
