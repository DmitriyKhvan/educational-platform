import React from 'react';
import Layout from '../../../components/Layout';
import cls from './EditMentorProfile.module.scss';
import DelIcon from '../../../assets/del.png';
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
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png';
import { Link } from 'react-scroll';
import { useTranslation } from 'react-i18next';

const EditMentorProfile = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [statusInfo, setStatusInfo] = React.useState('basic');
  const [showSample, setShowSample] = React.useState(false);
  const [showEditAvatar, setShowEditAvatar] = React.useState(false);
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);
  const [profileImage, setProfileImage] = React.useState('');
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

  React.useEffect(() => {
    if (user?.mentor?.avatar) {
      setProfileImage(user?.mentor?.avatar?.url);
    } else if (user.gender === 'female') {
      setProfileImage(femaleAvatar);
    } else if (user.gender === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [user]);

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
          <section className={cls.editProfile_left}>
            <div className={cls.editProfile_left_title}>
              <h2>{t('edit_profile')}</h2>
            </div>

            <div className={cls.editProfile_left_photo}>
              <div className={cls.editProfile_left_photo_title}>
                <h2>{t('change_photo')}</h2>
              </div>
            </div>

            <div className={cls.editProfile_left_avatar}>
              <div className={cls.avatar_left}>
                {<img src={profileImage} alt="" />}
              </div>
              <div className={cls.avatar_right}>
                <button onClick={() => setShowEditAvatar(true)}>
                  {t('upload_photo')}
                </button>
                <button onClick={deleteAvatar}>
                  <img src={DelIcon} alt="" />
                  {t('delete_photo')}
                </button>
              </div>
            </div>

            <div className={cls.editProfile_left_content}>
              <p>{t('photo_recommendations')}</p>
            </div>
          </section>
          <section className={cls.editProfile_right}>
            <div className={cls.editProfile_right_hooks}>
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
                  className={statusInfo === item.route ? cls.active_hook : ''}
                >
                  {item.caption}
                </Link>
              ))}
            </div>

            <div className={cls.editProfile_right_guild}>
              <div className={cls.guild_card}>
                <img src={Stick} alt="" />

                <h2>{t('photo_guidelines')}</h2>

                <button onClick={() => setShowSample(true)}>
                  {t('view_sample')}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className={cls.editProfile_container_forms}>
          {/* Basic Info */}

          <BasicForm cls={cls} />

          {/* Biography info */}

          <Biography cls={cls} />

          {/* Edu */}

          <Education cls={cls} />

          {/* Intro */}

          <Intro cls={cls} />
        </div>

        {<SampleModal isOpen={showSample} closeModal={closeSampleModal} />}
        {
          <EditAvatarModal
            profileImage={profileImage}
            closeModal={closeEditAvatarModal}
            isOpen={showEditAvatar}
          />
        }
      </div>
    </Layout>
  );
};

export default EditMentorProfile;
