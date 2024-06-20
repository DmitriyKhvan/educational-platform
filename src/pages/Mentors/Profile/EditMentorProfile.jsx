import React from 'react';
import Biography from './edit/Biography';
import Education from './edit/Education';
import Intro from './edit/Intro';
import EditAvatarModal from './EditAvatarModal';
import BasicForm from './edit/BasicForm';
import { useAuth } from 'src/app/providers/AuthProvider';
import { MUTATION_UPDATE_MENTOR } from '../../../shared/apollo/graphql';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../../widgets/Avatar/Avatar';
import Button from '../../../components/Form/Button/Button';

import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa6';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { MatchingInfo } from './edit/MatchingInfo';

const EditMentorProfile = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);
  const { user, refetchUser } = useAuth();

  const closeEditAvatarModal = () => setShowEditAvatar(false);

  const deleteAvatar = async () => {
    const { data } = await updateMentor({
      variables: {
        id: parseInt(user?.mentor?.id),
        data: { avatar: null },
      },
    });

    if (data) {
      refetchUser();
    }
  };

  return (
    <div className="max-w-[400px] mx-auto space-y-10">
      <div className="w-full space-y-6">
        <div className="flex items-center">
          <Link className="mr-3" to="/mentor/profile">
            <FaChevronLeft className="text-[16px] font-bold" />
          </Link>
          <h3 className="text-black m-0 text-[32px] font-bold">
            {t('edit_profile')}
          </h3>
        </div>

        <h2 className="text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
          {t('change_photo')}
        </h2>

        <div className="flex items-center gap-6">
          <Avatar
            className="w-[128px] h-[128px] rounded-[10px] overflow-hidden"
            avatarUrl={user?.mentor?.avatar?.url}
          />

          <div className="grow flex flex-col gap-4">
            <AdaptiveDialog
              open={showEditAvatar}
              setOpen={setShowEditAvatar}
              button={
                <Button
                  theme="clear"
                  className="text-sm h-[56px] bg-color-purple/10 text-color-purple"
                >
                  {t('upload_photo')}
                </Button>
              }
            >
              <EditAvatarModal closeModal={closeEditAvatarModal} />
            </AdaptiveDialog>

            <Button
              theme="gray"
              onClick={deleteAvatar}
              className="flex items-center justify-center gap-[10px] text-sm text-gray-300 h-[56px]"
            >
              <FaTrashAlt />
              {t('delete_photo')}
            </Button>
          </div>
        </div>
      </div>

      <BasicForm />

      <MatchingInfo />

      <Biography />

      <Education />

      <Intro />
    </div>
  );
};

export default EditMentorProfile;
