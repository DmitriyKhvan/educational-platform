import type { Message } from '@/types/types.generated';
import { createContext } from 'react';

export interface Notification {
  id: string;
  createdAt: string;
  meta?: {
    lesson?: {
      type: string;
    };
    bonusLessonsCount?: number;
    dashboard?: string;
  };
  body?: string;
}

export interface NotificationContextType {
  notifications: Message[];
  getCountNotification: (type: string, type2?: string) => number;
  removeNotifications: (type: string, type2?: string) => void;
  getAllNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
