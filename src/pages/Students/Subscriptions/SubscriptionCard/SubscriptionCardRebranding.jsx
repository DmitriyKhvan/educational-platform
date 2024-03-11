import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';

export const SubscriptionCard = ({
  title,
  sessionsPerWeek,
  totalSessions,
  price,
  months,
  duration,
  credits,
  active,
}) => {
  const [t] = useTranslation(['common', 'lessons']);
  return (
    <div
      className={`w-full p-4 rounded-[10px] border border-solid select-none`}
    >
      <div className="text-lg font-bold capitalize mb-3">{title}</div>

      <div className="text-sm font-normal mb-4">
        {new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW',
        }).format(price)}
      </div>
      {active && credits > 0 && (
        <span className="inline-block mb-4 self-start bg-[#02C97E] text-[#02C97E] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">
            <FaCheck /> Active subscription
          </div>
        </span>
      )}
      <div className="flex">
        <div className="flex flex-wrap items-center text-sm font-light leading-5">
          <div className="text-[13px] text-gray-400">
            {months} {t('months')}
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
