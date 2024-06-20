import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPencil } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/app/providers/AuthProvider';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import Button from 'src/components/Form/Button';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { BsPlayFill } from 'react-icons/bs';
import { Tag } from 'src/entities/Questionnaire/ui/Tag';
import { PiSealCheckFill } from 'react-icons/pi';

const energyLevel = '🧘 Calm energy';
const interests = [
  '🐶 Animals',
  '💃 Dance',
  '🎨 Art',
  '🍿 Movies',
  '📜 History',
  '🎼 Music',
  '📐 Math',
  '⚽ Sports',
];

const teachingStyle = [
  'Empathetic',
  'Charismatic',
  'Playful',
  'Creative',
  'Enthusiastic',
];

const specialization = ['Pre-level 1', 'Writing', 'Speaking competitions'];

const certifications = ['TESOL', 'TEFL'];

const MentorProfile = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [t] = useTranslation(['profile', 'common']);

  const { user, logout } = useAuth();

  const videoUrl = user?.mentor?.videoUrl;

  return (
    <div className="max-w-[400px] mx-auto space-y-[30px]">
      <div className="w-full space-y-8">
        <header className="flex items-center w-full space-x-4 ">
          <div className="w-16 h-16 sm:w-20 sm:h-20">
            <Avatar
              avatarUrl={user?.avatar?.url}
              className="w-full h-full min-w-16 sm:min-w-20 rounded-full border"
            />
          </div>
          <div className="w-full h-auto py-2">
            <div className="flex justify-between ml-auto w-full">
              <div className="flex justify-between w-full">
                <div>
                  <h2 className="text-[20px] sm:text-[24px] font-bold leading-6 tracking-[-1px] text-color-dark-purple">
                    {user?.firstName + ' '}
                    {user?.lastName}
                  </h2>
                  <Link
                    to="/mentor/profile/edit"
                    className="text-color-purple flex items-center gap-2 hover:underline font-medium text-[13px] sm:text-sm"
                  >
                    <FaPencil /> {t('edit_profile')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full ">
          <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
            {t('add_details')}
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between border-b">
              <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                {t('email')}
              </h4>
              <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                {user?.email}
              </p>
            </div>

            {user?.koreanEquivalent && (
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('korean_name')}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                  {user?.koreanEquivalent}
                </p>
              </div>
            )}

            {user?.gender && (
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('gender')}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple  leading-6 tracking-[-0.6px]">
                  {user?.gender}
                </p>
              </div>
            )}

            {user?.country && (
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('country', { ns: 'common' })}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                  {user?.country ? user?.country : 'Korea'}
                </p>
              </div>
            )}

            {user?.address && (
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('address', { ns: 'common' })}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                  {user?.address}
                </p>
              </div>
            )}

            {user?.phoneNumber && (
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('phone_number', { ns: 'common' })}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                  {user?.phoneNumber}
                </p>
              </div>
            )}

            {user?.timeZone && (
              <div className="flex justify-between border-b">
                <h4 className="font-medium text-sm text-gray-400 leading-6 tracking-[-0.6px] mb-[10px]">
                  {t('time_zone', { ns: 'common' })}
                </h4>
                <p className="font-medium text-sm text-color-dark-purple leading-6 tracking-[-0.6px]">
                  {user?.timeZone ? user?.timeZone : 'PST (GMT-8)'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
          {t('intro_video')}
        </h2>

        {videoUrl?.length === 0 ? (
          <h2>No video!</h2>
        ) : (
          <ReactPlayer
            playIcon={
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-color-purple rounded-full">
                <BsPlayFill className="text-white text-2xl" />
              </div>
            }
            light
            url={user?.mentor?.videoUrl}
            playing
            controls
            volume={0.8}
            width="100%"
            height="267px"
          />
        )}
      </div>

      <div className="full space-y-6">
        <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
          Information for student matching
        </h2>

        <div className="space-y-4">
          <h4 className="text-sm font-normal text-gray-400">Energy level</h4>

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            <Tag className="border-none bg-gray-50" label={energyLevel} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-normal text-gray-400">Interests</h4>

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {interests.map((interest) => {
              return (
                <Tag
                  key={interest}
                  className="border-none bg-gray-50"
                  label={interest}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-normal text-gray-400">Teaching style</h4>

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {teachingStyle.map((style) => {
              return (
                <Tag
                  key={style}
                  icon={<span className="text-base text-color-purple">✦</span>}
                  className="border-none bg-gray-50"
                  label={style}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-normal text-gray-400">Specialization</h4>

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {specialization.map((special) => {
              return (
                <Tag
                  key={special}
                  className="border-none bg-gray-50"
                  label={special}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-normal text-gray-400">Certifications</h4>

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {certifications.map((certif) => {
              return (
                <Tag
                  key={certif}
                  icon={
                    <PiSealCheckFill className="text-[rgba(0,_217,_134,_1)]" />
                  }
                  className="border-none bg-gray-50"
                  label={certif}
                />
              );
            })}
          </div>
        </div>
      </div>

      <AdaptiveDialog
        button={
          <Button theme="red" className="w-full h-[60px]">
            <FiLogOut className="mr-2" /> Log out
          </Button>
        }
        open={logoutOpen}
        setOpen={setLogoutOpen}
      >
        <div className="text-center">
          <h2 className="font-bold text-[22px] mb-4">
            {t('logging_out', { ns: 'modals' })}
          </h2>
          <p className="text-[15px] mb-6">
            {t('are_you_sure_to_logout', { ns: 'modals' })}
          </p>

          <Button onClick={logout} theme="destructive" className="w-full mb-3">
            {t('yes_logout', { ns: 'modals' })}
          </Button>
          <Button
            onClick={() => setLogoutOpen(false)}
            theme="gray"
            className="w-full"
          >
            {t('cancel', { ns: 'modals' })}
          </Button>
        </div>
      </AdaptiveDialog>
    </div>
  );
};

export default MentorProfile;
