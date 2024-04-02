import { FaUserLarge } from 'react-icons/fa6';
import duckAvatar from 'src/assets/images/avatars/duck-avatar.png';

import cls from './Avatar.module.css';

export const Avatar = ({ avatarUrl, className = '', fallback = 'user' }) => {
  return avatarUrl || fallback === 'duck' ? (
    <img
      className={`${cls.img} ${className}`}
      src={avatarUrl ?? duckAvatar}
      alt="avatar"
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-gray-50 ${
        className ? className : 'w-full h-full'
      }`}
    >
      <FaUserLarge className="text-2xl sm:text-4xl text-gray-200" />
    </div>
  );
};
