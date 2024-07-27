import { ScheduleContext } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider/lib/schedule-context';
import { useContext } from 'react';

export const useSchedule = () => {
  return useContext(ScheduleContext);
};
