import { useAuth } from '@/app/providers/auth-provider';
import { MUTATION_UPDATE_MENTOR } from '@/shared/apollo/graphql';
import { useMutation } from '@apollo/client';
import { Controller, useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ReactLoader from '@/components/common/loader';
import Button from '@/components/form/button/button';
import CheckboxField from '@/components/form/checkbox-field';
import InputField from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { UPDATE_USER } from '@/shared/apollo/mutations/user/update-user';
import {
  countries,
  // timezoneOptions,
  useGenderDic,
} from '@/shared/constants/global';
import notify from '@/shared/utils/notify';
import { trimSpaces } from '@/shared/utils/trim-spaces';
import InputWithError from '@/components/form/input-with-error';

const BasicForm = () => {
  const [t] = useTranslation(['common', 'profile', 'translations']);
  const [updateUser] = useMutation(UPDATE_USER);
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

  const genders = useGenderDic();

  // const navigate = useNavigate();

  const { user, refetchUser } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      gender: user?.gender,
      phoneNumber: user?.phoneNumber,
      country: user?.country,
      // timeZone: user?.timeZone,
      address: user?.address,
      convertAvailabilityTime: true,
      googleCalendarSync: user?.googleCalendarSync,
    },
  });

  const handleEditBasicInfo = async (values: {
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: string | null;
    phoneNumber?: string | null;
    country?: string | null;
    // timeZone: user?.timeZone,
    address?: string | null;
    convertAvailabilityTime?: boolean;
    googleCalendarSync?: boolean | null;
  }) => {
    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      country,
      // timeZone,
      address,
      convertAvailabilityTime,
      googleCalendarSync,
    } = trimSpaces(values);

    await updateUser({
      variables: {
        id: user?.id,
        data: {
          phoneNumber: phoneNumber,
          country: country,
          // timeZone: timeZone,
          address: address,
          convertAvailabilityTime: convertAvailabilityTime,
          googleCalendarSync: googleCalendarSync,
        },
      },
      // onCompleted: () => {
      //   notify('Basic information is changed!');
      // },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });

    await updateMentor({
      variables: {
        id: user?.mentor?.id,
        data: {
          firstName: firstName,
          lastName: lastName,
          gender: gender,
        },
      },
      onCompleted: () => {
        notify('Basic information is changed!');
        // navigate('/mentor/profile');
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });

    await refetchUser();
  };

  return (
    <>
      {loading && <ReactLoader />}
      <form onSubmit={handleSubmit(handleEditBasicInfo)} id="basic">
        {/* <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
          {t('basic_info', { ns: 'profile' })}
        </h2> */}

        <fieldset className="flex flex-col space-y-6">
          <legend className="text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
            {t('basic_info', { ns: 'profile' })}
          </legend>

          <InputWithError errorsField={errors?.firstName}>
            <InputField
              className="w-full "
              label={t('first_name')}
              placeholder={'Alice'}
              {...register('firstName', {
                required: t('required_first_name', { ns: 'translations' }),
              })}
            />
          </InputWithError>

          <InputWithError errorsField={errors?.lastName}>
            <InputField
              className="w-full "
              label={t('last_name')}
              placeholder={'Addison'}
              {...register('lastName')}
            />
          </InputWithError>

          <label className="block w-full  not-italic font-semibold text-base text-color-dark-purple">
            {t('gender', { ns: 'profile' })}{' '}
            <Controller
              control={control}
              defaultValue={user?.gender}
              name="gender"
              render={({ field: { value, onChange } }) => (
                <SelectField value={value ?? ''} options={genders} onChange={onChange} />
              )}
            />
          </label>

          <InputField
            className="w-full "
            label={t('email', { ns: 'profile' })}
            type="email"
            placeholder={'example@gmail.com'}
            disabled={true}
            {...register('email')}
          />

          <InputField
            className="w-full "
            label={t('phone_number')}
            placeholder={'+123456789'}
            {...register('phoneNumber')}
          />

          <label className="block w-full  not-italic font-semibold text-base text-color-dark-purple">
            {t('country')}{' '}
            <Controller
              control={control}
              defaultValue={user?.country}
              name="country"
              render={({ field: { value, onChange } }) => (
                <SelectField value={value ?? ''} options={countries} onChange={onChange} />
              )}
            />
          </label>

          <InputField
            className="w-full "
            label={t('address')}
            placeholder={'Cupertino 1337'}
            {...register('address')}
          />

          {/* <label className="block w-full  not-italic font-semibold text-base text-color-dark-purple">
            {t('time_zone')}

            <Controller
              control={control}
              defaultValue={user?.timeZone}
              name="timeZone"
              render={({ field: { value, onChange } }) => (
                <SelectField
                  value={value}
                  options={timezoneOptions}
                  onChange={onChange}
                />
              )}
            />
          </label> */}

          <div>
            <CheckboxField
              className=""
              label="Update mentor availability and calendar to reflect new timezone"
              {...register('convertAvailabilityTime')}
            />
          </div>

          {user?.googleCalendarSync && (
            <div>
              <CheckboxField
                className=""
                label={t('google_calendar_sync', { ns: 'profile' })}
                {...register('googleCalendarSync')}
              />
            </div>
          )}

          {!user?.googleCalendarSync && (
            <a href={user?.googleAuth?.url ?? ''}>
              <Button className="w-full ">Enable google calendar sync</Button>
            </a>
          )}

          {user?.googleCalendarSync && user?.googleAuth?.url && (
            <a href={user?.googleAuth.url}>
              <Button className="w-full ">Refresh Google token</Button>
            </a>
          )}
        </fieldset>

        <Button className="w-full mt-6" type="submit" disabled={!isValid}>
          {t('save')}
        </Button>
      </form>
    </>
  );
};

export default BasicForm;
