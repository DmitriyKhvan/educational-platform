import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button/button';
import EditAvatarModal from '@/pages/mentors/profile/edit-avatar-modal';
import BasicForm from '@/pages/mentors/profile/edit/basic-form';
import Biography from '@/pages/mentors/profile/edit/biography';
import Education from '@/pages/mentors/profile/edit/education';
import Intro from '@/pages/mentors/profile/edit/intro';
import { MUTATION_UPDATE_MENTOR } from '@/shared/apollo/graphql';
import { Avatar } from '@/widgets/avatar/avatar';
import { useMutation } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { FaTrashAlt } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa6';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { MatchingInfo } from './edit/matching-info';

const EditMentorProfile = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);
  const { user, refetchUser } = useAuth();

  const closeEditAvatarModal = () => setShowEditAvatar(false);

  const deleteAvatar = async () => {
    const mentorId = user?.mentor?.id;
    if (mentorId) {
      const { data } = await updateMentor({
        variables: {
          id: Number.parseInt(mentorId),
          data: { avatar: null },
        },
      });

      if (data) {
        refetchUser();
      }
    }
  };

  return (
    <div className="max-w-[400px] mx-auto space-y-10">
      <div className="w-full space-y-6">
        <div className="flex items-center">
          <Link className="mr-3" to="/mentor/profile">
            <FaChevronLeft className="text-[16px] font-bold" />
          </Link>
          <h3 className="text-black m-0 text-[32px] font-bold">{t('edit_profile')}</h3>
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
