

import { useMutation } from '@apollo/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import Stick from "../../../../assets/stick.png"
import { useAuth } from '../../../../modules/auth'
import { MUTATION_UPDATE_TUTOR } from '../../../../modules/auth/graphql'
import Submit from './Submit'
import { Textarea } from './Textarea'

const Biography = ({cls}) => {

  const [updateTutor, { loading: updateUserLoading }] = useMutation(MUTATION_UPDATE_TUTOR);

  const { user, refetchUser } = useAuth();

  const {
    register,
    handleSubmit
  } = useForm({
    mode:"onBlur"
  })

  const handleEditBigraphy = async (area) => {

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
    <form 
      onSubmit={handleSubmit(handleEditBigraphy)}
      className={cls.editProfile_container_forms_biography} id='bio'
    >
      <div>
        <div className={cls.editProfile_container_forms_biography_title}>
          <h2>Biography</h2>
        </div>

        <div className={cls.bio_guild_card}>
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
          defaultValue="Input"
          label="Introduction"
          text="Include your name, university, degree(s), academic distinctions,
          and why students should book lessons with you."
          {...register("introduction")}
        />

        <Textarea 
          defaultValue="Input"
          label="Relevant Experience"
          text="Include tutoring, teaching, or other work experience
          that is notable or related to your education."
          {...register("relevantExperience")}
        />

        <Textarea 
          defaultValue="Input"
          label="Unique facts about yourself"
          text="For example, honors, accomplishments, hobbies, interests, or other jobs.
          Try to show a bit of your personality!"
          {...register("uniqueFacts")}
        />

        <Submit />
      </div>
    </form>

  )
}

export default Biography
