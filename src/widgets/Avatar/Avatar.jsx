import { FaUserLarge } from 'react-icons/fa6';
import duckAvatar from 'src/assets/images/avatars/duck-avatar.png';

import cls from './Avatar.module.css';
import { cn } from 'src/utils/functions';

export const Avatar = ({
  avatarUrl,
  className = '',
  fallback = 'user',
  iconClassName = '',
}) => {
  return avatarUrl || fallback === 'duck' ? (
    <img
      className={`${cls.img} ${className}`}
      src={avatarUrl ?? duckAvatar}
      alt="avatar"
    />
  ) : (
    <div
      className={cn(
        `flex items-center justify-center bg-gray-50`,
        className ? className : 'w-full h-full',
      )}
    >
      <FaUserLarge
        className={cn('text-2xl sm:text-4xl text-gray-200', iconClassName)}
      />
    </div>
  );
};
