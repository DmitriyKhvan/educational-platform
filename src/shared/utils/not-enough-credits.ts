import { WEEKS_IN_MONTH } from '@/shared/constants/global';

export function notEnoughCredits(credits, repeat = 1) {
  return credits < repeat * WEEKS_IN_MONTH;
}
