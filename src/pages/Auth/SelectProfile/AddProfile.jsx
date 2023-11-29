import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'src/components/Form/Button';
import Loader from 'src/components/Loader/Loader';
import LoginForm from 'src/components/onboarding/LoginForm';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from 'src/constants/global';
import { ATTACH_STUDENT_TO_USER } from 'src/modules/auth/graphql';
import Logo from 'src/assets/images/logo_purple.svg';
import { useAuth } from 'src/modules/auth';
import notify from 'src/utils/notify';

export const AddStudentProfile = () => {
  const { user } = useAuth();

  const [attachStudentToUser, { loading, error, data }] = useMutation(
    ATTACH_STUDENT_TO_USER,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { firstName, lastName, gender } = data;

    attachStudentToUser({
      variables: {
        userId: user.id,
        firstName,
        lastName,
        gender,
      },
    });
  };

  if (data) {
    notify('Student profile added');
    location.href = '/select-profile';
  }

  if (error) {
    notify(error.message, 'error');
  }

  const onChangeLanguage = (event) => {
    const lang = event.target.value === 'en' ? 1 : 0;
    setItemToLocalStorage('language', lang);
    setLanguage(lang);
  };

  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );

  return (
    <main className="flex flex-col relative items-center">
      {loading && (
        <div className="absolute z-50 w-screen h-screen bg-black/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ">
            <Loader />
          </div>
        </div>
      )}
      <img
        className="w-48 md:w-64 my-[8vh] md:my-[12.5vh]"
        src={Logo}
        alt="naonow-logo"
      />
      <select
        name=""
        id=""
        onChange={onChangeLanguage}
        defaultValue={language === 0 ? 'kr' : 'en'}
        className="rounded border border-gray-300 text-sm"
      >
        <option value="en">English</option>
        <option value="kr">한국어</option>
      </select>
      <div className="max-w-2xl gap-4 w-full px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full block py-8">
          <LoginForm register={register} errors={errors} />

          <div className="self-start mt-8 flex flex-row gap-4">
            <Button
              type="submit"
              className="h-[40px] px-4 bg-purple-800 text-white rounded-md font-bold disabled:bg-opacity-50 disabled:text-gray-200 disabled:cursor-not-allowed duration-200 hover:opacity-75 active:brightness-75 active:scale-95"
            >
              Add profile
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};
