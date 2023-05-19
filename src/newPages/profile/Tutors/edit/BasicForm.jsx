import { useMutation } from '@apollo/client';
// import { Switch } from '@mui/material'
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../../modules/auth';
import { MUTATION_UPDATE_USER } from '../../../../modules/auth/graphql';
import Submit from './Submit';
import { TextInput } from './TextInput';
import Select from 'react-select';
import timezones from 'timezones-list';
import find from 'lodash/find';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getData } from 'country-list';
import { useTranslation } from 'react-i18next';
import TutorApi from '../../../../api/TutorApi';

const timezoneOptions = timezones.map(({ label, tzCode }) => ({
  label,
  value: tzCode,
}));

function getIntHoursOffset(utcTzOffset) {
  return parseInt(utcTzOffset.split(':')[0], 10);
}

function getOffsetBetweenTimezones(tzCode1, tzCode2) {
  const utcTz1 = getIntHoursOffset(find(timezones, { tzCode: tzCode1 }).utc);
  const utcTz2 = getIntHoursOffset(find(timezones, { tzCode: tzCode2 }).utc);

  return utcTz1 - utcTz2;
}

const BasicForm = ({ cls }) => {
  const [t] = useTranslation(['common', 'profile']);
  const [updateTutor] = useMutation(MUTATION_UPDATE_USER);

  const notify = () => toast('Basic information is changed!');

  const history = useHistory();

  const { user, refetchUser } = useAuth();

  const { register, handleSubmit, control } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
      gender: user?.gender,
      convertAvailabilityTime: true,
    },
  });

  const handleEditBasicInfo = async ({ convertAvailabilityTime, ...area }) => {
    const oldTimezone = user?.timeZone;
    const { data } = await updateTutor({
      variables: {
        where: {
          id: user?.id,
        },
        data: area,
      },
    });

    if (convertAvailabilityTime && oldTimezone !== area.timeZone) {
      const offsetHours = getOffsetBetweenTimezones(oldTimezone, area.timeZone);
      await TutorApi.adjustTutorAvailability(offsetHours);
    }

    if (data) {
      notify();
      history.push('/tutor/profile');
    }

    await refetchUser();
  };

  const countries = getData().map((x) => x.name);

  return (
    <form
      onSubmit={handleSubmit(handleEditBasicInfo)}
      className={cls.editProfile_container_forms_basic}
      id="basic"
    >
      <div>
        <div className={cls.editProfile_container_forms_basic_title}>
          <h2>{t('basic_info', { ns: 'profile' })}</h2>
        </div>

        <TextInput
          type="text"
          placeholder={'Alisa'}
          label={t('first_name')}
          {...register('firstName')}
        />

        <TextInput
          type="text"
          placeholder={'Addison'}
          label={t('last_name')}
          {...register('lastName')}
        />

        <div className={cls.form_divider}>
          <p>{t('gender', { ns: 'profile' })}</p>

          <select {...register('gender')}>
            <option value={'male'}>{t('male', { ns: 'profile' })}</option>
            <option value={'female'}>{t('female', { ns: 'profile' })}</option>
            <option value={'non-binary'}>Non-binary</option>
          </select>
        </div>

        <TextInput
          type="email"
          placeholder={'example@gmail.com'}
          label={t('email', { ns: 'profile' })}
          disabled={true}
          {...register('email')}
        />

        <TextInput
          type="text"
          placeholder={'+9965537201'}
          label={t('phone_number')}
          {...register('phoneNumber')}
        />

        {/* <div className={cls.editProfile_container_forms_basic_switch}>
        <Switch {...label} defaultChecked />
        <h3>Receive SMS notifications</h3>
      </div> */}

        <div className="basic">
          <div className={cls.form_divider}>
            <p>{t('country')}</p>

            <div className="tutor_timeZone">
              <Controller
                control={control}
                name="country"
                defaultValue={user?.country}
                render={({ field: { ref, value, onChange } }) => (
                  <Select
                    inputRef={ref}
                    value={{ label: value, value: value }}
                    options={countries.map((each) => {
                      return { label: each, value: each };
                    })}
                    onChange={(e) => onChange(e.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <TextInput
          type="text"
          placeholder={'Bakarov 99'}
          label={t('address')}
          {...register('address')}
        />

        <div className={cls.form_divider}>
          <p>{t('time_zone')}</p>

          <div className="tutor_timeZone">
            <Controller
              control={control}
              name="timeZone"
              defaultValue={user?.timeZone}
              render={({ field: { ref, value, onChange } }) => (
                <Select
                  inputRef={ref}
                  value={find(timezoneOptions, { value })}
                  options={timezoneOptions}
                  onChange={(e) => onChange(e.value)}
                />
              )}
            />
          </div>
          <div className="tutor_checkbox">
            <label>
              <input type="checkbox" {...register('convertAvailabilityTime')} />
              <span>Conver availability time into the new timezone?</span>
            </label>
          </div>
        </div>
      </div>

      <Submit />
    </form>
  );
};

export default BasicForm;
