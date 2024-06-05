import React from 'react';

import { useAuth } from 'src/app/providers/AuthProvider';
import { MUTATION_UPDATE_MENTOR } from '../../../shared/apollo/graphql';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import notify from '../../../shared/utils/notify';
import Button from '../../../components/Form/Button/Button';
import { Avatar } from '../../../widgets/Avatar/Avatar';
import ReactLoader from '../../../components/common/Loader';

import { HiOutlineUpload } from 'react-icons/hi';

const EditAvatarModal = ({ closeModal }) => {
  const [t] = useTranslation('common');
  const { user, refetchUser } = useAuth();
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);
  const navigate = useNavigate();
  const [file, setFile] = React.useState(null);

  const { handleSubmit } = useForm();

  const updateAvatar = async () => {
    if (file) {
      await updateMentor({
        variables: {
          id: parseInt(user?.mentor?.id),
          data: { avatar: file },
        },
        onCompleted: () => {
          notify(t('changed_avatar'));
          navigate('/mentor/profile');
          closeModal();
        },
      });

      await refetchUser();
    }
  };

  return (
    <>
      {loading && <ReactLoader />}
      <form
        onSubmit={handleSubmit(updateAvatar)}
        className="w-[500px] h-auto bg-white rounded-[10px] pt-[30px] pb-[20px] shadow-[0px_2px_15px_rgba(0,_0,_0,_0.06)]"
      >
        {!file ? (
          <div className="h-[250px] px-[30px] overflow-hidden">
            <Avatar
              className="object-contain "
              avatarUrl={user?.mentor?.avatar?.url}
            />
          </div>
        ) : (
          <img
            src={URL.createObjectURL(file)}
            alt="Thumb"
            className="w-full object-contain h-[250px] px-[30px]"
          />
        )}

        <div className="px-[30px] pb-[10px] border-b border-solid border-color-border-grey">
          {file ? (
            <label
              onClick={() => setFile(null)}
              className="flex items-center justify-center gap-[10px] w-full my-[10px] py-[15px] bg-white  font-semibold text-[15px] text-color-dark-purple leading-[18px] tracking-[-0.2px] border border-solid border-color-border-grey rounded-[10px] cursor-pointer"
            >
              <span>&times;</span>
              {t('choose_other')}
            </label>
          ) : (
            <label className="flex items-center justify-center gap-[10px] w-full my-[10px] py-[15px] bg-white  font-semibold text-[15px] text-color-dark-purple leading-[18px] tracking-[-0.2px] border border-solid border-color-border-grey rounded-[10px] cursor-pointer">
              <input
                className="hidden"
                multiple
                accept="image/*"
                type={'file'}
                onChange={(e) => setFile(e.target.files[0])}
              />

              <HiOutlineUpload className="text-xl" />

              {t('upload')}
            </label>
          )}
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

        <div className="flex gap-[10px] mt-4 px-[30px]">
          <Button theme="outline" className="w-full" onClick={closeModal}>
            {t('cancel')}
          </Button>
          <Button theme="outline" className="w-full" type="submit">
            {t('save')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditAvatarModal;
