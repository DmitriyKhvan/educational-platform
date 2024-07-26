import { useContext } from "react";
import { NotificationContext } from "@/app/providers/notification-provider/lib/notification-context";

export const useNotifications = () => {
	return useContext(NotificationContext);
};
