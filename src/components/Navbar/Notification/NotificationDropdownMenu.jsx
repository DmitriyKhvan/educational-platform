import React, { useState, useEffect, memo } from 'react';

import { MESSAGE_SUBSCRIPTIONS } from 'src/utils/subscriptions';
import { useSubscription } from '@apollo/client';

import { useOutsideClick } from 'src/utils/useOutsideClick';
import { IoNotifications } from 'react-icons/io5';
import { NOTIFICATION_LIMIT } from 'src/constants/global';
import { NotificationItem } from './NotificationItem';

// eslint-disable-next-line react/display-name
export const NotificationDropdownMenu = memo(() => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotification] = useState([]);

  const ref = useOutsideClick(() => setVisible(false));

  const { data } = useSubscription(MESSAGE_SUBSCRIPTIONS);

  console.log('data', data);
  console.log('notifications', notifications);

  useEffect(() => {
    if (data?.newMessages) {
      setNotification([
        data.newMessages,
        ...notifications.slice(0, NOTIFICATION_LIMIT - 1),
      ]);
    }
  }, [data]);

  return (
    <div ref={ref} className={`dropdown ml-[20px]`}>
      <div
        onClick={() =>
          notifications.length ? setVisible((val) => !val) : undefined
        }
        className="flex relative items-center cursor-pointer"
      >
        <IoNotifications className="text-2xl" />
      </div>

      {notifications.length > 0 && (
        <span className="badge">{notifications.length}</span>
      )}

      {visible && notifications.length > 0 && (
        <>
          {/* <div className="background" onClick={() => setVisible(false)} /> */}
          <div className="absolute right-0 top-[40px] w-[500px] bg-white rounded-[9px] py-[6px] border-[0.5px] border-color-border-grey shadow-[1px_3px_5px_rgba(0,0,0,0.1)] z-[3001]">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                setVisible={setVisible}
                notification={notification}
              />
            ))}
            <p className="view-more">SEE ALL ACTIVITIES</p>
          </div>
        </>
      )}
    </div>
  );
});
