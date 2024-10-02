import { useCurrency } from '@/app/providers/currency-provider';
import Indicator from '@/components/indicator';
import { currencyFormat } from '@/shared/utils/currency-format';
import type { Maybe } from '@/types/types.generated';
/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';

interface SubscriptionCardProps {
  title: string;
  sessionsPerWeek?: Maybe<number>;
  price?: Maybe<number>;
  totalSessions?: Maybe<number>;
  currency?: Maybe<string>;
  months?: Maybe<number>;
  duration?: Maybe<number>;
  credits?: Maybe<number>;
  active?: Maybe<boolean>;
  isReferral?: Maybe<boolean>;
}

export const SubscriptionCard = ({
  title,
  sessionsPerWeek,
  totalSessions,
  price,
  currency,
  months,
  duration,
  credits,
  active,
  isReferral = false,
}: SubscriptionCardProps) => {
  const { findCurrency } = useCurrency();

  const curCurrency = findCurrency?.(currency ?? '');

  const [t] = useTranslation(['common', 'lessons']);
  return (
    <div className={'w-full p-4 rounded-[10px] border border-solid select-none'}>
      <div className="text-lg font-bold capitalize mb-3">
        {isReferral && '🎁 '}
        {title}
      </div>

      {!isReferral && (
        <div className="text-sm font-normal mb-4">
          {/* {price} */}
          {curCurrency &&
            currencyFormat({
              number: price ?? 0,
              currency: curCurrency.value,
              locales: curCurrency.locales,
            })}
        </div>
      )}
      {active && (credits ?? 0) > 0 && (
        <Indicator className="bg-[#02C97E] text-[#02C97E] mb-4 bg-opacity-10">
          <FaCheck /> {t('active_subscription')}
        </Indicator>
      )}
      <div className="flex">
        <div className="flex flex-wrap items-center text-sm font-light leading-5">
          <div className="text-[13px] text-gray-400">
            {months} {t('months', { ns: 'lessons' })}
          </div>
          <span className="w-1 h-1 bg-gray-300 rounded-full mx-[6px]" />
          <div className="text-[13px] text-gray-400">
            {sessionsPerWeek} {t('lesson_per_week').toLowerCase()}
          </div>
          <span className="w-1 h-1 bg-gray-300 rounded-full mx-[6px]" />
          <div className="text-[13px] text-gray-400">
            {duration} {t('minutes_full').toLowerCase()}
          </div>
          <span className="w-1 h-1 bg-gray-300 rounded-full mx-[6px]" />
          <div className="text-[13px] text-gray-400">
            {totalSessions} {t('lessons_total').toLowerCase()}
          </div>
          <span className="w-1 h-1 bg-gray-300 rounded-full mx-[6px]" />
          <div className="text-[13px] text-gray-400">
            {credits}/{totalSessions} {t('remaining_credits').toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
