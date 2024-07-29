import {
  type Notification,
  NotificationContext,
  type NotificationContextType,
} from '@/app/providers/notification-provider/lib/notification-context';
import { MARK_MESSAGE_AS_READ } from '@/shared/apollo/mutations/notifications';
import { GET_USER_NOTIFICATIONS } from '@/shared/apollo/queries/notifications';
import { NEW_MESSAGES } from '@/shared/apollo/subscriptions/new-messages';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import { type ReactNode, useEffect, useState } from 'react';

interface NewMessagesData {
  newMessages: Notification;
}

interface GetUserNotificationsData {
  getUserNotifications: Notification[];
}

interface MarkMessageAsReadData {
  markMessageAsRead: boolean;
}

interface MarkMessageAsReadVars {
  id: string[];
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotification] = useState<Notification[]>([]);
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
  }, [newNotifications, notifications]);

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
  }, [allNotifications]);

  const removeNotifications = (type?: string) => {
    if (!notifications.length) return;

    let notificationIds: string[] = [];

    if (type) {
      notificationIds = notifications
        .filter(
          (notification) =>
            notification?.meta?.lesson?.type === type || notification?.body === type,
        )
        .map((notification) => notification.id);
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
          setUpdateNotifications(Date.now().toString());
        },
      });
    }
  };

  const getCountNotification = (type: string): number => {
    const count = notifications.filter((notification) => notification?.meta?.lesson?.type === type);
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
