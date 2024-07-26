import { createContext } from "react";

export interface Notification {
	id: string;
	createdAt: string;
	meta?: {
		lesson?: {
			type: string;
		};
		bonusLessonsCount?: number;
	};
	body?: string;
}

export interface NotificationContextType {
	notifications: Notification[];
	getCountNotification: (type: string) => number;
	removeNotifications: (type?: string) => void;
	getAllNotifications: () => void;
}

export const NotificationContext = createContext<
	NotificationContextType | undefined
>(undefined);
