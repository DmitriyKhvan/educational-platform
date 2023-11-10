import React from 'react';
import { Link } from 'react-router-dom';

import { differenceInDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const NotificationItem = ({ notification, setVisible }) => {
  const [t] = useTranslation('lessons');
  return (
    <Link
      to={notification.href || '#'}
      className={`flex items-center justify-between px-[15px] py-[7px] font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
      onClick={() => {
        setVisible(false);
      }}
    >
      <p className="flex items-center justify-between w-full box-shadow  transition ease-in-out delay-150  group-hover:text-white">
        <span className="max-w-3/4 font-semibold mr-[30px]">
          {t(notification.body)} (
          {format(new Date(notification.meta.lesson.date), 'eee, MMM do')})
        </span>
        <span>
          <span className="mr-5">
            {notification.meta.user.firstName} {notification.meta.user.lastName}
          </span>
          {notification?.createdAt && (
            <span className="whitespace-nowrap">
              {differenceInDays(new Date(), new Date(notification?.createdAt))}{' '}
              day(s) ago
            </span>
          )}
        </span>
      </p>
    </Link>
  );
};
