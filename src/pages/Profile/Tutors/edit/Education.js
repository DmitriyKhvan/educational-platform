import React from 'react'
import { useForm } from 'react-hook-form'
import Stick from "../../../../assets/stick.png"
import { TextInput } from './TextInput'

import Verify from "../../../../assets/Verif.png"
import ExportArrow from "../../../../assets/ExportArrow.png"
import Submit from './Submit'

const Education = () => {

  const {
    register
  } = useForm({
    mode:"onBlur"
  })

  return (
    <div>
      <div className='editProfile_container_forms_edu_title'>
        <h2>Education</h2>
      </div>

      <div className='edu_guild_card'>
        <img src={Stick} alt=""/>
        <h3>
          Guidelines on being honest.
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ligula nisi. 
        </p>
      </div>

      <div className='form_divider'>
        <p>School</p>

        <select {...register("school")}>
          <option value={"usa"}>Stanford University</option>
        </select>
      </div>

      <div className='form_divider'>
        <p>Graduating year</p>

        <select {...register("graduating_year")}>
          <option value={"usa"}>Class of 2012</option>
        </select>
      </div>

      <div className='form_divider'>
        <p>Degree</p>

        <select {...register("degree")}>
          <option value={"usa"}>B.A. in English</option>
        </select>
      </div>

      <div className='form_divider'>
        <p>Major</p>

        <select {...register("major")}>
          <option value={"usa"}>Major Name</option>
        </select>
      </div>

      <div className='form_divider'>
        <p>Certificates (optional)</p>

        <select {...register("certificate")}>
          <option value={"usa"}>Certificate Name</option>
        </select>
      </div>

      <TextInput 
        type="text"
        placeholder="Training Name"
        label="Other Degrees, Certificates, Certifications, and/or Experience (optional)"
        {...register("phone_number")}
      />

      <div className='form_divider_edu'>
        <select {...register("certificate")}>
          <option value={"usa"}>Add More</option>
        </select>
      </div>

      <div className='edu_verify_card'>
        <img src={Verify} alt=''/>

        <h3>Education Verification</h3>

        <p>
          Please upload proof of your educational status.
        </p>

        <p>
          Options include a Diploma, University Transcript, Certificates or Student ID.
        </p>

        <button>
          <img src={ExportArrow} alt=""/>
          Upload
        </button>

        <div>
          <span>
            JPG, PNG, or PDF format; maximum file size of 20MB.
          </span>
        </div>

      </div>

      <Submit />

    </div>
  )
}

export default Education
