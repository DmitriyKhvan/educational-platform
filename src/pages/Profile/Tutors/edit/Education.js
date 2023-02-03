import React from 'react'
import { useForm } from 'react-hook-form'
import Stick from "../../../../assets/stick.png"
import { TextInput } from './TextInput'

import Verify from "../../../../assets/Verif.png"
import ExportArrow from "../../../../assets/ExportArrow.png"
import Submit from './Submit'
import { useMutation } from '@apollo/client'
import { MUTATION_UPDATE_TUTOR } from '../../../../modules/auth/graphql'
import { useAuth } from '../../../../modules/auth'

const Education = ({cls}) => {

  const [updateTutor, { loading: updateUserLoading }] = useMutation(MUTATION_UPDATE_TUTOR);

  const {user, refetchUser} = useAuth();

  const {
    register,
    handleSubmit
  } = useForm({
    mode:"onBlur"
  })

  const handleEditEdu = async (area) => {

    await updateTutor({
      variables: {
        where: {
          id: parseInt(user?.tutor?.id),
        },
        data: area
      }
    })

    await refetchUser();
 
  }

  return (
    <form onSubmit={handleSubmit(handleEditEdu)} className={cls.editProfile_container_forms_edu} id='edu'>
      <div>
        <div className={cls.editProfile_container_forms_edu_title}>
          <h2>Education</h2>
        </div>

        <div className={cls.edu_guild_card}>
          <img src={Stick} alt=""/>
          <h3>
            Guidelines on being honest.
          </h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ligula nisi. 
          </p>
        </div>

        <div className={cls.form_divider}>
          <p>University</p>

          <select {...register("university")}>
            <option value={"usa"}>Stanford University</option>
          </select>
        </div>

        <div className={cls.form_divider}>
          <p>Graduating year</p>

          <select {...register("graduatingYear")}>
            <option value={2015}>Class of 2012</option>
          </select>
        </div>

        <div className={cls.form_divider}>
          <p>Degree</p>

          <select {...register("degree")}>
            <option value={"usa"}>B.A. in English</option>
          </select>
        </div>

        <div className={cls.form_divider}>
          <p>Major</p>

          <select {...register("major")}>
            <option value={"usa"}>Major Name</option>
          </select>
        </div>

        <div className={cls.form_divider}>
          <p>Certificates (optional)</p>

          <select {...register("certificates")}>
            <option value={"usa"}>Certificate Name</option>
          </select>
        </div>

        <TextInput 
          type="text"
          defaultValue="Training Name"
          label="Other Degrees, Certificates, Certifications, and/or Experience (optional)"
          {...register("phoneNumber")}
        />

        <div className={cls.form_divider_edu}>
          <select {...register("certificates")}>
            <option value={"usa"}>Add More</option>
          </select>
        </div>

        <div className={cls.edu_verify_card}>
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
    </form>
  )
}

export default Education;
