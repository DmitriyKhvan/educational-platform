
import { useMutation } from '@apollo/client'
// import { Switch } from '@mui/material'
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
import { getData } from 'country-list'

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
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      address: user?.address
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

  const countries = getData().map(x => x.name)

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
        placeholder={"Alisa"}
        label="First name"
        {...register("firstName")}
      />

      <TextInput 
        type="text"
        placeholder={"Addison"}
        label="Last name"
        {...register("lastName")}
      />

      <TextInput 
        type="email"
        placeholder={"example@gmail.com"}
        label="Email address"
        disabled={true}
        {...register("email")}
      />

      <TextInput 
        type="text"
        placeholder={"+9965537201"}
        label="Phone number"
        {...register("phoneNumber")}
      />

      {/* <div className={cls.editProfile_container_forms_basic_switch}>
        <Switch {...label} defaultChecked />
        <h3>Receive SMS notifications</h3>
      </div> */}

      <div className='basic'>
        <div className={cls.form_divider}>
          <p>Country</p>

          <div className='tutor_timeZone'>
            <Controller
              control={control}
              name="country"
              defaultValue={user?.country}
              render={({ field: { ref, value, onChange } }) => (
                <Select
                  inputRef={ref}
                  value={{ label: value, value: value }}
                  options={countries.map(each => {
                    return { label: each, value: each };
                  })}
                  onChange={e => onChange(e.value)}
                />
              )}
            />
          </div>
        </div>
      </div>

      <TextInput
        type="text"
        placeholder={"Bakarov 99"}
        label="Address"
        {...register("address")}
      />

      <div className={cls.form_divider}>
        <p>Time zone</p>

        <div className='tutor_timeZone'>
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
