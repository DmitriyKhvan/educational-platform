import { lowerCase } from 'lodash-es';
import '../../../../assets/styles/subscription-card.scss';
import { useTranslation } from 'react-i18next';

export const SubscriptionCard = ({ title, sessionsPerWeek, totalSessions, price, costPerClass }) => {
    const [t] = useTranslation('common');
    return <div className='subscription-card relative'>
        <div className='active absolute -right-1 -top-2 flag-content text-sm flex items-center justify-center'>
        </div>
        <div>
            <div className='text-lg font-semibold capitalize mb-2'>{lowerCase(title)}</div>
            <div className='flex justify-between'>
                <div className='text-sm font-light leading-5'>
                    <div>{t('cost_per_class')}: {new Intl.NumberFormat('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                    }).format(costPerClass)}</div>
                    <div>{sessionsPerWeek} {t('lesson_per_week')}</div>
                    <div>{totalSessions} {t('lesson_per_package')}</div>
                    <div>{t('payment_without_renewal')}</div>
                </div>
                <div className='text-lg font-semibold'>
                    {new Intl.NumberFormat('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                    }).format(price)}</div>
            </div>
        </div>
    </div>
}