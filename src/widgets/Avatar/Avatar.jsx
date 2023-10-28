import React, { useEffect, useState } from 'react';
import { useAuth } from '../../modules/auth';

import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';

import cls from './Avatar.module.css';
import ReactLoader from 'src/components/common/Loader';

export const Avatar = ({ avatarUrl, gender, className = '' }) => {
  const { user } = useAuth();

  const genderAvatar = gender ? gender : user.gender;

  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (avatarUrl) {
      setTimeout(() => {
        setProfileImage(avatarUrl);
      }, 300);
    } else if (genderAvatar === 'female') {
      setTimeout(() => {
        setProfileImage(femaleAvatar);
      }, 300);
    } else {
      setTimeout(() => {
        setProfileImage(maleAvatar);
      }, 300);
    }
  }, [avatarUrl]);

  return profileImage ? (
    <img
      className={`${cls.img} ${className}`}
      src={profileImage}
      alt="avatar"
    />
  ) : (
    <ReactLoader />
  );
};
