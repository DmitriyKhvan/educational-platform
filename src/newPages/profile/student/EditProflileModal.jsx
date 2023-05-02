import Modal from 'react-modal';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ReactComponent as Close } from '../../../assets/images/Close icon.svg';
import AvatarImg from '../../../assets/avatar.png';
import { TextInput } from '../../../components/TextInput';
import { useAuth } from '../../../modules/auth';
import Select from 'react-select';

import {
  MUTATION_UPDATE_STUDENT,
  MUTATION_UPDATE_USER,
} from '../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import timezone from 'timezones-list';
import { toast } from 'react-toastify';
import { getData } from 'country-list';

import { AiFillEdit } from 'react-icons/ai';

const EditProflileModal = ({ profileImage, isOpen, setIsOpen }) => {
  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);
  const [preview, setPreview] = React.useState({});

  const notifyAvatar = () => toast('Avatar is changed!');
  const notify = () => toast('Student information is changed!');

  const [updateUser] = useMutation(MUTATION_UPDATE_USER);

  const { user, refetchUser } = useAuth();
  const timezones = timezone.map((x) => x.label);

  const { reset, register, handleSubmit, control } = useForm({
    defaultValues: {
      koreanEquivalent: user?.koreanEquivalent,
      gender: user?.gender,
      lastName: user?.lastName,
      firstName: user?.firstName,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
    },
  });

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (area) => {
    if (area.avatar?.length) {
      setPreview(area.avatar);

      const { data } = await updateStudent({
        variables: {
          where: {
            id: parseInt(user?.student?.id),
          },
          data: {
            avatar: { upload: area.avatar[0] },
          },
        },
      });

      if (data) {
        closeModal();
        notifyAvatar();
      }

      await refetchUser();
    }

    const { data: userData } = await updateUser({
      variables: {
        where: {
          id: parseInt(user?.id),
        },
        data: {
          koreanEquivalent: area.koreanEquivalent,
          lastName: area.lastName,
          gender: area.gender,
          timeZone: area.timeZone,
          phoneNumber: area.phoneNumber,
          firstName: area.firstName,
          country: area.country,
          address: area.address,
        },
      },
    });

    if (userData) {
      closeModal();
      notify();
    }

    await refetchUser();
  };

  const avatar = user?.student?.avatar?.url || AvatarImg;
  const countries = getData().map((x) => x.name);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="edit-profile-modal-overlay"
      className={
        window.innerHeight >= 1668
          ? `edit-profile-modal maxHeight`
          : 'edit-profile-modal'
      }
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className="header">
        <h3>Edit Profile</h3>
        <button onClick={closeModal}>
          <Close />
        </button>
      </div>
      <div className="avatar-block">
        {avatar && <img src={profileImage} alt={'userInfo.tutorName'} />}
        <label htmlFor="inputTag" className="file_upload">
          <input
            {...register('avatar')}
            webkitdirectory
            directory
            id="inputTag"
            type={'file'}
            multiple
          />
          <AiFillEdit className="edit-icon" />
        </label>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="body">
        <section className="scroll-form">
          <section>
            <TextInput
              label="Korean Equivalent"
              type={'text'}
              placeholder={'알렉스'}
              {...register('koreanEquivalent')}
            />
          </section>
          <section>
            <label>
              Gender
              <select {...register('gender')}>
                <option value={'male'}>Male</option>
                <option value={'female'}>Female</option>
              </select>
            </label>
          </section>

          <div className="student_country">
            <label>Time zone (optional)</label>
            <Controller
              control={control}
              defaultValue={user?.timeZone}
              name="timeZone"
              render={({ field: { ref, value, onChange } }) => (
                <Select
                  inputRef={ref}
                  value={{ label: value, value: value }}
                  options={timezones.map((each) => {
                    return { label: each, value: each };
                  })}
                  onChange={(e) => onChange(e.value)}
                />
              )}
            />
          </div>
          <section>
            <TextInput
              label="Last Name"
              type={'text'}
              placeholder={'Addison'}
              {...register('lastName')}
            />
          </section>
          <section>
            <TextInput
              label="First Name"
              type={'text'}
              placeholder={'Alisa'}
              {...register('firstName')}
            />
          </section>
          <section>
            <TextInput
              label="Phone Number"
              type={'text'}
              placeholder="+1(555)555-5555"
              {...register('phoneNumber')}
            />
          </section>
          <section>
            <TextInput
              label="Address"
              type={'text'}
              placeholder={'Bakarov 98'}
              {...register('address')}
            />
          </section>
          <div className="student_country">
            <label htmlFor="country">Country</label>
            <Controller
              control={control}
              defaultValue={user?.country}
              name="country"
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
        </section>
        <button style={{ cursor: 'pointer' }} type="submit">
          Save Edits
        </button>
      </form>
    </Modal>
  );
};

export default EditProflileModal;
