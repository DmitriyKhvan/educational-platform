
import { useMutation } from '@apollo/client'
import { Switch } from '@mui/material'
import React from 'react'
import { useForm , Controller } from 'react-hook-form'
import { useAuth } from '../../../../modules/auth'
import { MUTATION_UPDATE_USER } from '../../../../modules/auth/graphql'
import Submit from './Submit'
import { TextInput } from './TextInput'
import Select from 'react-select';
import timezone from 'timezones-list';
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
const label = { inputProps: { 'aria-label': 'Switch demo' } }

const BasicForm = ({cls}) => {

  const [updateTutor] = useMutation(MUTATION_UPDATE_USER);

  const notify = () => toast("Basic information is changed!");

  const history = useHistory();

  const { user, refetchUser } = useAuth();

  const timezones = timezone.map(x => x.label)

  const {
    register,
    handleSubmit,
    control
  } = useForm({
    mode:"onBlur",
    defaultValues: {
      firstName: user?.firstName
    }
  });

  const handleEditBasicInfo = async (area) => {

    const { data } =  await updateTutor({
      variables: {
        where: {
          id: user?.id,
        },
        data: area
      }
    })

    if(data) {
      notify();
      history.push("/student/profile")
    }

    await refetchUser();
  }

  return (
    <form 
      onSubmit={handleSubmit(handleEditBasicInfo)} 
      className={cls.editProfile_container_forms_basic} id='basic'
    >    
    <div>
      <div className={cls.editProfile_container_forms_basic_title}>
        <h2>Basic Information</h2>
      </div>

      <TextInput
        type="text"
        defaultValue={user?.firstName}
        label="First name"
        {...register("firstName")}
      />

      <TextInput 
        type="text"
        defaultValue={user?.lastName}
        label="Last name"
        {...register("lastName")}
      />

      <TextInput 
        type="email"
        defaultValue={user?.email}
        label="Email address"
        {...register("email")}
      />

      <TextInput 
        type="text"
        defaultValue={user?.phoneNumber}
        label="Phone number"
        {...register("phoneNumber")}
      />

      <div className={cls.editProfile_container_forms_basic_switch}>
        <Switch {...label} defaultChecked />
        <h3>Receive SMS notifications</h3>
      </div>

      <div className={cls.form_divider}>
        <p>Location</p>

        <select defaultValue={user?.country} {...register("country")}>
          <option value={"USA"}>United States of America</option>
        </select>
      </div>

      <TextInput
        type="text"
        defaultValue={user?.address}
        label="Address"
        {...register("address")}
      />

      <div className={cls.form_divider}>
        <p>Time zone</p>

        <div style={{width:"420px", marginTop:"15px"}}>
          <Controller
            control={control}
            name="timeZone"
            defaultValue={user?.timeZone}
            render={({ field: { ref, value, onChange } }) => (
              <Select
                inputRef={ref}
                value={{ label: value, value: value }}
                options={timezones.map(each => {
                  return { label: each, value: each };
                })}
                onChange={e => onChange(e.value)}
              />
            )}
          />
        </div>
      </div>
    </div>

    <Submit />
  </form>  
  )
}

export default BasicForm;
