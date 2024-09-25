import { WEEKS_IN_MONTH } from '@/shared/constants/global';
import type { Maybe } from '@/types/types.generated';

export function notEnoughCredits(credits: Maybe<number> | undefined, repeat = 1) {
  return credits ?? 0 < repeat * WEEKS_IN_MONTH;
}
