import {
	NotificationContext,
	type NotificationContextType,
} from "@/app/providers/notification-provider/lib/notification-context";
import { useContext } from "react";

export const useNotifications = (): NotificationContextType => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider",
		);
	}
	return context;
};
