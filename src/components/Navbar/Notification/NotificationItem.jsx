import React from 'react';

import { differenceInDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Avatar } from 'src/widgets/Avatar/Avatar';

export const NotificationItem = ({ notification }) => {
  const [t] = useTranslation('lessons');

  const daysAgo = differenceInDays(
    new Date(),
    new Date(notification?.createdAt),
  );

  const timeAgo = daysAgo !== 0 ? `${daysAgo} day(s) ago` : 'today';

  return (
    <div
      className={`p-4 font-semibold group border border-color-border-grey rounded-lg`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          avatarUrl={notification.meta.user.avatar}
          className="w-10 h-10 rounded-full overflow-hidden"
        />

        <span className="truncate text-base font-semibold">
          {notification.meta.user.firstName}{' '}
          {notification.meta.user.lastName &&
            `${notification.meta.user.lastName[0]}.`}
        </span>
      </div>
      <div className="mb-4">
        <span className="font-medium text-sm">
          {t(notification.body)} (
          {format(new Date(notification.meta.lesson.date), 'eee, MMM do')})
        </span>
      </div>
      <div>
        {notification?.createdAt && (
          <span className="whitespace-nowrap text-xs font-normal text-color-darker-grey">
            {timeAgo}
          </span>
        )}
      </div>
    </div>
  );
};
