import React from 'react';
import Modal from 'react-modal';
import ExportArrow from '../../../assets/ExportArrow.png';

import './EditAvatar.scss';
import { useAuth } from '../../../modules/auth';
import { MUTATION_UPDATE_TUTOR } from '../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const EditAvatarModal = ({ isOpen, closeModal, profileImage }) => {
  const [t] = useTranslation('common');
  const { user, refetchUser } = useAuth();
  const [updateTutor] = useMutation(MUTATION_UPDATE_TUTOR);
  const history = useHistory();
  const notify = () => toast('Avatar is changed!');

  const { handleSubmit, register } = useForm();

  const updateAvatar = async (area) => {
    const { data } = await updateTutor({
      variables: {
        where: {
          id: parseInt(user?.tutor?.id),
        },
        data: { avatar: { upload: area.avatar[0] } },
      },
    });

    if (data) {
      notify();
      history.push('/student/profile');
      closeModal();
    }

    await refetchUser();

    return { data };
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="edit-profile-modal-overlay"
      className={`avatar-modal`}
      bodyOpenClassName={'edit-modal-open'}
    >
      <form onSubmit={handleSubmit(updateAvatar)} className="avatarModal_card">
        {<img className="avatar_preview" src={profileImage} alt="" />}

        <div className="avatarModal_card_editor">
          <div className="avatar_block">
            <label htmlFor="input">
              <input
                id="input"
                type={'file'}
                webkitdirectory
                multiple
                {...register('avatar')}
              />
              <img src={ExportArrow} alt="" />
              {t('upload')}
            </label>
          </div>
          {/* <button>
            
          </button> */}
          {/* <button>
            <img src={Rotate} alt=""/>
            Rotate
          </button>
          <button>
            <img src={Crop} alt=""/>
            Crop
          </button> */}
        </div>

        <div className="avatarModal_card_footer">
          <button onClick={closeModal}>{t('cancel')}</button>
          <button type="submit">{t('save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAvatarModal;
