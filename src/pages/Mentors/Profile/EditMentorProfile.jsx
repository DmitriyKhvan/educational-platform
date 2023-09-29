import React from 'react';
import Layout from '../../../components/Layout';
import cls from './EditMentorProfile.module.scss';
import Stick from '../../../assets/stick.png';
import SampleModal from './SampleModal';
import Biography from './edit/Biography';
import Education from './edit/Education';
import Intro from './edit/Intro';
import EditAvatarModal from './EditAvatarModal';
import BasicForm from './edit/BasicForm';
import { useAuth } from '../../../modules/auth';
import { MUTATION_UPDATE_MENTOR } from '../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import { Link } from 'react-scroll';
import { useTranslation } from 'react-i18next';
import ModalWrapper from '../../../components/ModalWrapper/ModalWrapper';
import { Avatar } from '../../../widgets/Avatar/Avatar';
import Button from '../../../components/Form/Button/Button';

import { FaTrashAlt } from 'react-icons/fa';
import { cn } from '../../../utils/functions';

const EditMentorProfile = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [statusInfo, setStatusInfo] = React.useState('basic');
  const [showSample, setShowSample] = React.useState(false);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);
  const { user, refetchUser } = useAuth();

  const hooks = [
    {
      caption: t('basic_info'),
      route: 'basic',
      count: 475,
    },
    {
      caption: t('biography'),
      route: 'bio',
      count: 1600,
    },
    {
      caption: t('bio_education'),
      route: 'edu',
      count: 3487,
    },
    {
      caption: t('intro_video'),
      route: 'intro',
      count: 5120,
    },
  ];

  const closeSampleModal = () => setShowSample(false);

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
    <Layout>
      <div className={cls.editProfile_container}>
        <div className={cls.editProfile_container_row}>
          <section className="ml-[65px]">
            <h2 className="text-[40px] text-color-dark-purple leading-[48px] tracking-[-1px]">
              {t('edit_profile')}
            </h2>

            <h2 className="mt-[50px] text-[27px] text-color-dark-purple font-medium leading-[33px] tracking-[-1px]">
              {t('change_photo')}
            </h2>

            <div className="flex items-center gap-[30px] mt-[30px]">
              <div>
                <Avatar
                  avatarUrl={user?.mentor?.avatar?.url}
                  className="w-[150px] h-[150px] rounded-[10px]"
                />
              </div>

              <div className="flex flex-col gap-[10pxs]">
                <Button
                  theme="outline"
                  onClick={() => setShowEditAvatar(true)}
                  className="text-[15px] px-[30px] h-[50px]"
                >
                  {t('upload_photo')}
                </Button>

                <Button
                  theme="outline"
                  onClick={deleteAvatar}
                  className="flex items-center justify-center gap-[10px] text-[15px] px-[30px] h-[50px]"
                >
                  <FaTrashAlt className="text-lg" />
                  {t('delete_photo')}
                </Button>
              </div>
            </div>

            <p className="mt-[30px] font-medium text-[15px] text-color-light-grey leading-[18px] tracking-[-0.7px]">
              {t('photo_recommendations')}
            </p>
          </section>

          <section className={cls.editProfile_right}>
            <div className="flex">
              {hooks.map((item) => (
                <Link
                  to={item.route}
                  key={item.caption}
                  onClick={() => {
                    setStatusInfo(item.route);
                  }}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className={cn(
                    'bg-white font-semibold text-[15px] leading-[18px] tracking-[-0.7px] text-color-dark-purple px-[15px] py-[11px] border border-solid border-color-border-grey cursor-pointer [&:nth-child(1)]:rounded-l-[10px] [&:nth-child(4)]:rounded-r-[10px]',
                    statusInfo === item.route &&
                      'bg-color-light-purple text-color-purple border-color-purple',
                  )}
                >
                  {item.caption}
                </Link>
              ))}
            </div>

            <div className={cls.editProfile_right_guild}>
              <div className="w-[440px] bg-white mt-[85px] border border-color-border-grey rounded-[10px] pt-[15px] px-[30px] pb-[30px]">
                <img src={Stick} alt="" />

                <h2 className="mt-[20px] font-semibold text-[20px] text-color-dark-purple leading-[24px] tracking-[-0.6px]">
                  {t('photo_guidelines')}
                </h2>

                <Button
                  onClick={() => setShowSample(true)}
                  theme="outline"
                  className="mt-[25px] w-full"
                >
                  {t('view_sample')}
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div>
          {/* Basic Info */}

          <BasicForm cls={cls} />

          {/* Biography info */}

          <Biography cls={cls} />

          {/* Edu */}

          <Education cls={cls} />

          {/* Intro */}

          <Intro cls={cls} />
        </div>

        {
          <ModalWrapper
            isOpen={showSample}
            closeModal={closeSampleModal}
            paddingContent="0"
          >
            <SampleModal />
          </ModalWrapper>
        }

        {
          <ModalWrapper
            isOpen={showEditAvatar}
            closeModal={closeEditAvatarModal}
            paddingContent="0"
          >
            <EditAvatarModal closeModal={closeEditAvatarModal} />
          </ModalWrapper>
        }
      </div>
    </Layout>
  );
};

export default EditMentorProfile;
