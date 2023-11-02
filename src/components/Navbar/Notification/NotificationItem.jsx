import React from 'react';
import { Link } from 'react-router-dom';

import { differenceInDays } from 'date-fns';

export const NotificationItem = ({ notification, setVisible }) => {
  return (
    <Link
      to={notification.href || '#'}
      className={`flex items-center justify-between px-[15px] py-[7px] font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
      onClick={() => {
        setVisible(false);
      }}
    >
      <p className="flex items-center justify-between w-full box-shadow  transition ease-in-out delay-150  group-hover:text-white">
        <span className="w-3/4 font-semibold mr-[30px]">
          {notification.body}
        </span>
        {notification?.sender?.updatedAt && (
          <span className="whitespace-nowrap">
            {differenceInDays(
              new Date(),
              new Date(notification?.sender?.updatedAt),
            )}{' '}
            day(s) ago
          </span>
        )}
      </p>
    </Link>
  );
};
