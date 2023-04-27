import AvatarPreset1 from '../assets/images/avatars/001.svg';
import AvatarPreset2 from '../assets/images/avatars/002.svg';
import AvatarPreset3 from '../assets/images/avatars/003.svg';
import AvatarPreset4 from '../assets/images/avatars/004.svg';
import AvatarPreset5 from '../assets/images/avatars/005.svg';
import AvatarPreset6 from '../assets/images/avatars/006.svg';
import AvatarPreset7 from '../assets/images/avatars/007.svg';
import AvatarPreset8 from '../assets/images/avatars/008.svg';
import AvatarPreset9 from '../assets/images/avatars/009.svg';

export const Avatar = ({ avatar, name }) => {
  const avatarPresets = [
    AvatarPreset1,
    AvatarPreset2,
    AvatarPreset3,
    AvatarPreset4,
    AvatarPreset5,
    AvatarPreset6,
    AvatarPreset7,
    AvatarPreset8,
    AvatarPreset9,
  ];
  return (
    <>
      {avatar ? (
        avatar.indexOf('preset_') > -1 ? (
          <img
            src={avatarPresets[parseInt(avatar.slice(7))]}
            alt=""
            className="user-avatar preset"
          />
        ) : (
          <img
            src={
              `${process.env.REACT_APP_SERVER_URL}/users/get-avatar?file_name=` +
              avatar
            }
            alt=""
            className="user-avatar"
          />
        )
      ) : (
        <div className="no-avatar">
          <span>{name}</span>
        </div>
      )}
    </>
  );
};
