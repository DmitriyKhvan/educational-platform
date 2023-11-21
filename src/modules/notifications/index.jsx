import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { MESSAGE_SUBSCRIPTIONS } from 'src/utils/subscriptions';
import { GET_USER_NOTIFICATIONS } from '../graphql/queries/notifications';

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
    if (newNotifications?.newMessages) {
      setNotification([newNotifications.newMessages, ...notifications]);
    }
  }, [newNotifications]);

  useEffect(() => {
    if (allNotifications?.getUserNotifications.length) {
      setNotification([...allNotifications.getUserNotifications]);
    } else {
      setNotification([]);
    }
  }, [allNotifications, updateNotifications]);

  const removeNotifications = (type) => {
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
