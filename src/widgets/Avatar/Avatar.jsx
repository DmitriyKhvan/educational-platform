import React, { useEffect, useState } from 'react';
import { useAuth } from '../../modules/auth';

import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';

export const Avatar = ({ avatarUrl, className = '' }) => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(maleAvatar);

  useEffect(() => {
    if (avatarUrl) {
      setProfileImage(avatarUrl);
    } else if (user?.gender === 'female') {
      setProfileImage(femaleAvatar);
    }
  }, [avatarUrl]);

  return (
    <img
      className={`w-full h-full object-center object-cover ${className}`}
      src={profileImage}
      alt={'userInfo.tutorName'}
    />
  );
};
