import { useState } from 'react';

import { useAuth } from '@/app/providers/auth-provider';
import { MUTATION_UPDATE_MENTOR } from '@/shared/apollo/graphql';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ReactLoader from '@/components/common/loader';
import Button from '@/components/form/button/button';
import notify from '@/shared/utils/notify';
import { Avatar } from '@/widgets/avatar/avatar';

import { HiOutlineUpload } from 'react-icons/hi';

const EditAvatarModal = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const [t] = useTranslation('common');
  const { user, refetchUser } = useAuth();
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const { handleSubmit } = useForm();

  const updateAvatar = async () => {
    if (file && user?.mentor?.id) {
      await updateMentor({
        variables: {
          id: Number.parseInt(user?.mentor?.id),
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
      <form onSubmit={handleSubmit(updateAvatar)} className="w-[400px] h-auto">
        {!file ? (
          <Avatar className="h-[250px]" avatarUrl={user?.mentor?.avatar?.url} />
        ) : (
          <img
            src={URL.createObjectURL(file)}
            alt="Thumb"
            className="w-full object-contain h-[250px]"
          />
        )}

        <div className=" border-b border-solid border-color-border-grey">
          {file ? (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="flex items-center justify-center gap-[10px] w-full my-[10px] py-[15px] bg-white  font-semibold text-[15px] text-color-dark-purple leading-[18px] tracking-[-0.2px] border border-solid border-color-border-grey rounded-[10px] cursor-pointer"
            >
              <span>&times;</span>
              {t('choose_other')}
            </button>
          ) : (
            <label className="flex items-center justify-center gap-[10px] w-full my-[10px] py-[15px] bg-white  font-semibold text-[15px] text-color-dark-purple leading-[18px] tracking-[-0.2px] border border-solid border-color-border-grey rounded-[10px] cursor-pointer">
              <input
                className="hidden"
                multiple
                accept="image/*"
                type={'file'}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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

        <div className="flex gap-[10px] mt-4">
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
