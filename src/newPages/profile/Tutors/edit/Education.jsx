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
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

const Education = ({cls}) => {

  const [updateTutor] = useMutation(MUTATION_UPDATE_TUTOR);

  const notify = () => toast("Education information is changed!")
  const [file, setFile] = React.useState({});

  const history = useHistory();

  const {user, refetchUser} = useAuth();

  const {
    register,
    handleSubmit
  } = useForm({
    mode:"onBlur",
    defaultValues: {
      university: user?.tutor?.university,
      graduatingYear: user?.tutor?.graduatingYear,
      degree: user?.tutor?.degree,
      major: user?.tutor?.major
    }
  })

  const handleEditEdu = async (area) => {

    if(file) {
      const files = file.target?.files[0];
      const { data } = updateTutor({
        variables: {
          where: {
            id: parseInt(user?.tutor?.id)
          },
          data: {diplomaVerification: { upload: files } }
        }
      })
    }

    const newData = {
      ...area,
      graduatingYear: parseInt(area.graduatingYear)
    }

    const { data } = await updateTutor({
      variables: {
        where: {
          id: parseInt(user?.tutor?.id),
        },
        data: newData
      }
    })

    if(data) {
      notify();
      history.push("/student/profile")
    }

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

          <TextInput 
            type="text"
            placeholder="Standford University"
            {...register("university")}
          />
        </div>

        <div className={cls.form_divider}>
          <p>Graduating year</p>

          <TextInput 
            type="number"
            placeholder="2018"
            {...register("graduatingYear")}
          />
        </div>

        <div className={cls.form_divider}>
          <p>Degree</p>

          <TextInput 
            type="text"
            placeholder="A.B English"
            {...register("degree")}
          />
        </div>

        <div className={cls.form_divider}>
          <p>Major</p>

          <TextInput 
            type="text"
            placeholder="Major"
            {...register("major")}
          />
        </div>

        <div className={cls.form_divider}>
          <p>Certificates (optional)</p>

          <select {...register("certificates")}>
            <option value={"usa"}>Certificate Name</option>
          </select>
        </div>

        {/* <TextInput 
          type="text"
          defaultValue="Training Name"
          label="Other Degrees, Certificates, Certifications, and/or Experience (optional)"
          {...register("phoneNumber")}
        /> */}

        {/* <div className={cls.form_divider_edu}>
          <select {...register("certificates")}>
            <option value={"usa"}>Add More</option>
          </select>
        </div> */}

        <div className={cls.edu_verify_card}>
          <img src={Verify} alt=''/>

          <h3>Education Verification</h3>

          <p>
            Please upload proof of your educational status.
          </p>

          <p>
            Options include a Diploma, University Transcript, Certificates or Student ID.
          </p>

          <div className={cls.avatar_block}>
            <label htmlFor='file'>
              <input  id='file' type={"file"} multiple onChange={e => setFile(e)}/>
              <img src={ExportArrow} alt=""/>
              Upload
            </label>
          </div>

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
