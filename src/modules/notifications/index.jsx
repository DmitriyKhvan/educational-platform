import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { MESSAGE_SUBSCRIPTIONS } from 'src/utils/subscriptions';
import { GET_USER_NOTIFICATIONS } from '../graphql/queries/notifications';

import {
  // getItemToLocalStorage,
  NOTIFICATION_LIMIT,
} from 'src/constants/global';
import { MARK_MESSAGE_AS_READ } from '../graphql/mutations/notifications';

export const NotificationsContext = createContext({});

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotification] = useState([]);
  const [updateNotifications, setUpdateNotifications] = useState('');

  const { data: newNotifications } = useSubscription(MESSAGE_SUBSCRIPTIONS, {
    variables: { authToken: `Bearer ${localStorage.getItem('token')}` },
  });

  const [
    getAllNotifications,

    { data: allNotifications, refetch: refetchNotifications },
  ] = useLazyQuery(GET_USER_NOTIFICATIONS, {
    // fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });

  const [markMessageAsRead] = useMutation(MARK_MESSAGE_AS_READ);

  useEffect(() => {
    // debugger;
    if (newNotifications?.newMessages) {
      setNotification([
        newNotifications.newMessages,
        ...notifications.slice(0, NOTIFICATION_LIMIT),
      ]);
    }
  }, [newNotifications]);

  useEffect(() => {
    // debugger;
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
    // debugger;
    if (!notifications.length) return;

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
      value={{
        notifications,
        getCountNotification,
        removeNotifications,
        getAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};
