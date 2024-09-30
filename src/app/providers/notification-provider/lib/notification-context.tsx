import type { AuthenticatedUser } from '@/types/types.generated';
import { createContext } from 'react';

export interface Notification {
  id: string;
  createdAt: string;
  meta?: {
    lesson?: {
      type: string;
      date: Date;
    };
    bonusLessonsCount?: number;
    dashboard?: string;
    user: Partial<AuthenticatedUser>;
  };
  body?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  getCountNotification: (type: string) => number;
  removeNotifications: (type?: string) => void;
  getAllNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
