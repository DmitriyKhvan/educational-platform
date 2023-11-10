import { useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { MESSAGE_SUBSCRIPTIONS } from 'src/utils/subscriptions';
import { GET_USER_NOTIFICATIONS } from '../graphql/queries/notifications';

import { NOTIFICATION_LIMIT } from 'src/constants/global';
import { MARK_MESSAGE_AS_READ } from '../graphql/mutations/notifications';

export const NotificationsContext = createContext({});

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotification] = useState([]);
  const [updateNotifications, setUpdateNotifications] = useState('');

  const { data: newNofifications } = useSubscription(MESSAGE_SUBSCRIPTIONS);

  const { data: allNotifications, refetch: refetchNotifications } = useQuery(
    GET_USER_NOTIFICATIONS,
    {
      // fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  );

  const [markMessageAsRead] = useMutation(MARK_MESSAGE_AS_READ);

  useEffect(() => {
    debugger;
    if (newNofifications?.newMessages) {
      setNotification([
        newNofifications.newMessages,
        ...notifications.slice(0, NOTIFICATION_LIMIT),
      ]);
    }
  }, [newNofifications]);

  useEffect(() => {
    debugger;
    if (allNotifications?.getUserNotifications.length) {
      setNotification([
        ...allNotifications.getUserNotifications.slice(0, NOTIFICATION_LIMIT),
      ]);
    } else {
      setNotification([]);
    }
  }, [allNotifications, updateNotifications]);

  console.log('allNotifications', allNotifications);

  const removeNotifications = (type) => {
    let notificationIds = [];

    if (type) {
      notificationIds = notifications
        .filter((notification) => notification?.meta.lesson.type === type)
        .map((notification) => {
          return notification.id;
        });
    } else {
      notificationIds = notifications.map((notification) => notification.id);
    }

    console.log('notificationIds', notificationIds);

    if (notificationIds.length) {
      markMessageAsRead({
        variables: {
          id: notificationIds,
        },
        onCompleted: () => {
          // debugger;
          refetchNotifications();
          setUpdateNotifications(Date.now()); //to update the list of notifications
        },
      });
    }
  };

  const getCountNotification = (type) => {
    const count = notifications.filter(
      (notification) => notification?.meta.lesson.type === type,
    );
    return count.length;
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, getCountNotification, removeNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};
