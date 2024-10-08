import {
  ScheduleContext,
  type ScheduleContextType,
} from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider/lib/schedule-context';
import { useContext } from 'react';

export const useSchedule = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);

  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
