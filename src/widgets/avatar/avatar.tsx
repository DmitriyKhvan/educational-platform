import duckAvatar from '@/shared/assets/images/avatars/duck-avatar.png';
import { FaUserLarge } from 'react-icons/fa6';

import { cn } from '@/shared/utils/functions';
import cls from '@/widgets/avatar/avatar.module.css';
import type { Maybe } from '@/types/types.generated';

export const Avatar = ({
  avatarUrl,
  className = '',
  fallback = 'user',
  iconClassName = '',
  // gender = ''
}: {
  avatarUrl?: Maybe<string> | undefined;
  className?: string;
  fallback?: 'user' | 'duck';
  iconClassName?: string;
  // gender?: Maybe<GenderType>
}) => {
  return avatarUrl ?? fallback === 'duck' ? (
    <img className={`${cls.img} ${className}`} src={avatarUrl ?? duckAvatar} alt="avatar" />
  ) : (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-50',
        className ? className : 'w-full h-full',
      )}
    >
      <FaUserLarge className={cn('text-2xl sm:text-4xl text-gray-200', iconClassName)} />
    </div>
  );
};
