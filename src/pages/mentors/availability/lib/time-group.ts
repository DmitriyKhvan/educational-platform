import type { TimeOption } from '@/types';

export const timeGroup = (timeGroups: TimeOption[][], time: number): TimeOption[] => {
  for (let i = 0; i < timeGroups.length; i++) {
    if (timeGroups[i].find((t) => t.value === time)) {
      return timeGroups[i];
    }
  }
  return [];
};
