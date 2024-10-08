import {
  NotificationContext,
  type NotificationContextType,
} from '@/app/providers/notification-provider/lib/notification-context';
import { MARK_MESSAGE_AS_READ } from '@/shared/apollo/mutations/notifications';
import { GET_USER_NOTIFICATIONS } from '@/shared/apollo/queries/notifications';
import { NEW_MESSAGES } from '@/shared/apollo/subscriptions/new-messages';
import type { Message } from '@/types/types.generated';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import { type ReactNode, useEffect, useState } from 'react';

interface NewMessagesData {
  newMessages: Message;
}

interface GetUserNotificationsData {
  getUserNotifications: Message[];
}

interface MarkMessageAsReadData {
  markMessageAsRead: boolean;
}

interface MarkMessageAsReadVars {
  id: string[];
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotification] = useState<Message[]>([]);
  const [updateNotifications, setUpdateNotifications] = useState<string>('');

  const { data: newNotifications } = useSubscription<NewMessagesData>(NEW_MESSAGES, {
    variables: { authToken: `Bearer ${localStorage.getItem('token')}` },
  });

  const [getAllNotifications, { data: allNotifications, refetch: refetchNotifications }] =
    useLazyQuery<GetUserNotificationsData>(GET_USER_NOTIFICATIONS, {
      notifyOnNetworkStatusChange: true,
    });

  const [markMessageAsRead] = useMutation<MarkMessageAsReadData, MarkMessageAsReadVars>(
    MARK_MESSAGE_AS_READ,
  );

  useEffect(() => {
    if (newNotifications?.newMessages) {
      setNotification(
        [newNotifications.newMessages, ...notifications].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    }
  }, [newNotifications]);

  useEffect(() => {
    if (allNotifications?.getUserNotifications.length) {
      setNotification(
        [...allNotifications.getUserNotifications].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } else {
      setNotification([]);
    }
  }, [allNotifications, updateNotifications]);

  const removeNotifications = (type?: string, type2 = '') => {
    if (!notifications.length) return;

    let notificationIds = [];

    if (type) {
      notificationIds = notifications
        .filter(
          (notification) =>
            notification?.meta?.lesson?.type === type ||
            notification?.meta?.lesson?.type === type2 ||
            notification?.body === type,
        )
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
          setUpdateNotifications(Date.now().toString()); //to update the list of notifications
        },
      });
    }
  };

  const getCountNotification = (type?: string, type2 = ''): number => {
    const count = notifications.filter(
      (notification) =>
        notification?.meta?.lesson?.type === type || notification?.meta?.lesson?.type === type2,
    );
    return count.length;
  };

  const contextValue: NotificationContextType = {
    notifications,
    getCountNotification,
    removeNotifications,
    getAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
};
