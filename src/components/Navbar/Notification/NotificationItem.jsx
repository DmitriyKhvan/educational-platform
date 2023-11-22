import React from 'react';
import { Link } from 'react-router-dom';

import { differenceInDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { HiUserCircle } from 'react-icons/hi2';

export const NotificationItem = ({ notification, setVisible }) => {
  const [t] = useTranslation('lessons');

  const daysAgo = differenceInDays(
    new Date(),
    new Date(notification?.createdAt),
  );

  const timeAgo = daysAgo !== 0 ? `${daysAgo} day(s) ago` : 'today';

  return (
    <Link
      to={notification.href || '#'}
      className={`flex items-center justify-between px-[15px] py-[7px] font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
      onClick={() => {
        setVisible(false);
      }}
    >
      <p className="flex items-center justify-between w-full box-shadow  transition ease-in-out delay-150  group-hover:text-white">
        <span className="flex items-center justify-between w-[85%] mr-2">
          <span className="flex items-center w-[40%] mr-2">
            {notification.meta.user.avatar ? (
              <img
                className="w-[30px] h-[30px] mr-1 rounded-full border-2 border-color-white object-center object-cover"
                src={notification.meta.user.avatar}
                alt=""
              />
            ) : (
              <HiUserCircle className="mr-1 text-[30px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />
            )}

            <span className="truncate">
              {notification.meta.user.firstName}{' '}
              {notification.meta.user.lastName}
            </span>
          </span>
          <span className="w-[60%] font-semibold">
            {t(notification.body)} (
            {format(new Date(notification.meta.lesson.date), 'eee, MMM do')})
          </span>
        </span>

        {notification?.createdAt && (
          <span className="w-[15%] whitespace-nowrap text-xs text-color-darker-grey">
            {timeAgo}
          </span>
        )}
      </p>
    </Link>
  );
};
