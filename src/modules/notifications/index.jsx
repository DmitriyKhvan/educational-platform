import { useQuery, useSubscription } from '@apollo/client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { MESSAGE_SUBSCRIPTIONS } from 'src/utils/subscriptions';
import { GET_USER_NOTIFICATIONS } from '../graphql/queries/notifications';

import { NOTIFICATION_LIMIT } from 'src/constants/global';

export const NotificationsContext = createContext({});

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotification] = useState([]);

  const { data: newNofifications } = useSubscription(MESSAGE_SUBSCRIPTIONS);

  const { data: allNotifications, refetch: refetchNotifications } = useQuery(
    GET_USER_NOTIFICATIONS,
  );

  useEffect(() => {
    if (newNofifications?.newMessages) {
      setNotification([
        newNofifications.newMessages,
        ...notifications.slice(0, NOTIFICATION_LIMIT - 1),
      ]);
    }
  }, [newNofifications]);

  useEffect(() => {
    if (allNotifications?.getUserNotifications.length) {
      setNotification([
        ...allNotifications.getUserNotifications.slice(
          0,
          NOTIFICATION_LIMIT - 1,
        ),
      ]);
    }
  }, [allNotifications]);

  // console.log('notifications', notifications);

  return (
    <NotificationsContext.Provider
      value={{ notifications, refetchNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};
