
import { Switch } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import Submit from './Submit'
import { TextInput } from './TextInput'


const label = { inputProps: { 'aria-label': 'Switch demo' } }

const BasicForm = ({cls}) => {

  const {
    register
  } = useForm({
    mode:"onBlur"
  })

  return (
    <div>
      <div className={cls.editProfile_container_forms_basic_title}>
        <h2>Basic Information</h2>
      </div>
      
      <TextInput 
        type="text"
        value="Jessica"
        cls={cls}
        label="First name"
        {...register("first_name")}
      />

      <TextInput 
        type="text"
        value="Brighton"
        label="Last name"
        {...register("last_name")}
      />

      <TextInput 
        type="email"
        value="jessica.brighton@gmail.com"
        label="Email address"
        {...register("email")}
      />

      <TextInput 
        type="number"
        value="+1 (424) 123-4567"
        label="Phone number"
        {...register("phone_number")}
      />

      <div className={cls.editProfile_container_forms_basic_switch}>
        <Switch {...label} defaultChecked />
        <h3>Receive SMS notifications</h3>
      </div>

      <div className={cls.form_divider}>
        <p>Location</p>

        <select {...register("location")}>
          <option value={"usa"}>United States of America</option>
        </select>
      </div>

      <TextInput 
        type="text"
        value="123 Market St"
        label="Address"
        {...register("phone_number")}
      />

      <div className={cls.form_divider}>
        <p>Time zone</p>

        <select {...register("time_zone")}>
          <option value={"usa"}>Pacific Standard Time (GMT-8)</option>
        </select>
      </div>

      <Submit />

    </div>
  )
}

export default BasicForm
