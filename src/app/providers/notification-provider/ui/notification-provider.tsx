import { MARK_MESSAGE_AS_READ } from "@/shared/apollo/mutations/notifications";
import { GET_USER_NOTIFICATIONS } from "@/shared/apollo/queries/notifications";
import { NEW_MESSAGES } from "@/shared/apollo/subscriptions/new-messages";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { NotificationContext } from "@/app/providers/notification-provider/lib/notification-context";

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotification] = useState([]);
	const [updateNotifications, setUpdateNotifications] = useState("");

	const { data: newNotifications } = useSubscription(NEW_MESSAGES, {
		variables: { authToken: `Bearer ${localStorage.getItem("token")}` },
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
			setNotification(
				[newNotifications.newMessages, ...notifications].sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
				),
			);
		}
	}, [newNotifications]);

	useEffect(() => {
		if (allNotifications?.getUserNotifications.length) {
			setNotification(
				[...allNotifications.getUserNotifications].sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
				),
			);
		} else {
			setNotification([]);
		}
	}, [allNotifications, updateNotifications]);

	const removeNotifications = (type) => {
		if (!notifications.length) return;

		let notificationIds = [];

		if (type) {
			notificationIds = notifications
				.filter(
					(notification) =>
						notification?.meta?.lesson?.type === type ||
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
					setUpdateNotifications(Date.now()); //to update the list of notifications
				},
			});
		}
	};

	const getCountNotification = (type) => {
		const count = notifications.filter(
			(notification) => notification?.meta?.lesson?.type === type,
		);
		return count.length;
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				getCountNotification,
				removeNotifications,
				getAllNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};
