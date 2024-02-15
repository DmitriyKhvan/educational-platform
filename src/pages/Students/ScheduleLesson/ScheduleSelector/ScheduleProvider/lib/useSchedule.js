import { useContext } from 'react';
import { ScheduleContext } from './ScheduleContext';

export const useSchedule = () => {
  return useContext(ScheduleContext);
};
