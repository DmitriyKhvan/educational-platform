import { lowerCase } from 'lodash-es';
import '../../../../assets/styles/subscription-card.scss';
import flag from '../../../../assets/images/off-bg.svg';
import { useTranslation } from 'react-i18next';

export const SubscriptionCard = ({ title, sessionsPerWeek, totalSessions, price, costPerClass }) => {
    const [t] = useTranslation('common');
    return <div className='subscription-card relative'>
        <div className='flag absolute right-2 -top-2'>
            <img src={flag} width={42}/>
        </div>
        <div>
            <div className='text-lg font-semibold capitalize'>{lowerCase(title)}</div>
            <div className='flex justify-between'>
                <div className='text-sm font-light'>
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