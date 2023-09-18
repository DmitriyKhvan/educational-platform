import { useTranslation } from 'react-i18next';
import icon from '../../../../assets/images/white-checkmark.png';

export const SubscriptionCard = ({
  title,
  sessionsPerWeek,
  totalSessions,
  price,
  costPerClass,
  credits,
  active,
}) => {
  const [t] = useTranslation('common');
  return (
    <div
      className={`${
        credits > 0 && active
          ? 'text-white bg-color-purple'
          : 'text-color-purple bg-white border border-solid select-none opacity-50 brightness-75'
      } relative w-full py-2 px-[10px] rounded-[10px]`}
    >
      <div className="absolute -right-1 -top-2">
        {credits > 0 && active && (
          <div
            style={{ background: `url('${icon}')` }}
            className={` bg-[size:100%_100%] bg-center bg-no-repeat rounded-full w-8 h-8 bg-[rgb(22_236_22)]`}
          ></div>
        )}
      </div>
      <div>
        <div className="text-lg font-semibold capitalize mb-2">{title}</div>
        <div className="flex justify-between">
          <div className="text-sm font-light leading-5">
            <div>
              {t('cost_per_class')}:{' '}
              {new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW',
              }).format(costPerClass)}
            </div>
            <div>
              {sessionsPerWeek} {t('lesson_per_week')}
            </div>
            <div>
              {totalSessions} {t('lesson_per_package')}
            </div>
            <div>
              {credits} {t('remaining_credits')}
            </div>
          </div>
          <div className="text-lg font-semibold">
            {new Intl.NumberFormat('ko-KR', {
              style: 'currency',
              currency: 'KRW',
            }).format(price)}
          </div>
        </div>
      </div>
    </div>
  );
};
