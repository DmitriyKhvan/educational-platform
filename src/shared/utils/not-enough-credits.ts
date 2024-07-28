import { WEEKS_IN_MONTH } from '@/shared/constants/global';

export function notEnoughCredits(credits: number, repeat = 1) {
  return credits < repeat * WEEKS_IN_MONTH;
}
