import React from 'react';
import Modal from 'react-modal';
import ExportArrow from '../../../assets/ExportArrow.png';

import './EditAvatar.scss';
import { useAuth } from '../../../modules/auth';
import { MUTATION_UPDATE_MENTOR } from '../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import notify from '../../../utils/notify';

Modal.setAppElement('#root');

const EditAvatarModal = ({ isOpen, closeModal, profileImage }) => {
  const [t] = useTranslation('common');
  const { user, refetchUser } = useAuth();
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);
  const history = useHistory();
  const [file, setFile] = React.useState(null);

  const { handleSubmit } = useForm();

  const updateAvatar = async () => {
    if (file) {
      const { data } = await updateMentor({
        variables: {
          id: parseInt(user?.mentor?.id),
          data: { avatar: file },
        },
      });

      if (data) {
        notify('Avatar is changed!');
        history.push('/mentor/profile');
        closeModal();
      }

      await refetchUser();

      return { data };
    }
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
        {!file ? (
          <img className="avatar_preview" src={profileImage} alt="" />
        ) : (
          <img
            src={URL.createObjectURL(file)}
            alt="Thumb"
            className="avatar_preview"
          />
        )}

        <div className="avatarModal_card_editor">
          <div className="avatar_block">
            {file ? (
              <>
                <label onClick={() => setFile(null)}>
                  <span>&times;</span>
                  {t('choose_other')}
                </label>
              </>
            ) : (
              <label htmlFor="input">
                <input
                  id="input"
                  multiple
                  accept="image/*"
                  type={'file'}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <img src={ExportArrow} alt="" />
                {t('upload')}
              </label>
            )}
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
