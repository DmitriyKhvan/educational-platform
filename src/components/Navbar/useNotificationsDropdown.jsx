import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { MESSAGE_SUBSCRIPTIONS } from 'src/utils/subscriptions';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

export const useNotificationsDropdown = () => {
  const [notification, setNotification] = useState([]);

  const { data } = useSubscription(MESSAGE_SUBSCRIPTIONS);
  const NOTIFICATIONLIMIT = 5;

  console.log('data', data);
  console.log('notification', notification);

  useEffect(() => {
    if (data?.newMessages) {
      const newNotification = {
        item: data.newMessages,
      };

      setNotification([
        newNotification,
        ...notification.slice(0, NOTIFICATIONLIMIT),
      ]);
    }
  }, [data]);

  const notificationsRender = (item, index, active, setActive, setVisible) => {
    console.log('item', item);
    return (
      <Link
        key={item.item.id}
        to={item.item.href || '#'}
        className={`flex items-center justify-between px-[15px] py-[7px] font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
        onClick={() => {
          setActive(index);
          setVisible(false);
          if (item.item.onClick) {
            item.onClick(index);
          }
        }}
      >
        <p className="flex items-center justify-between w-full box-shadow  transition ease-in-out delay-150  group-hover:text-white">
          <span className="w-3/4 font-semibold mr-[30px]">
            {item.item.body}
          </span>
          {item.item?.sender?.updatedAt && (
            <span className="whitespace-nowrap">
              {differenceInDays(
                new Date(),
                new Date(item.item?.sender?.updatedAt),
              )}{' '}
              day(s) ago
            </span>
          )}
        </p>
      </Link>
    );
  };

  return { notificationsRender, notification };
};
