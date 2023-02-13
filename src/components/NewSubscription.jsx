import React, { useEffect, useState } from 'react'
import ImgDiscount from '../assets/images/discount.svg'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'

const NewSubscription = ({
  plans,
  currency,
  selected,
  hasDiscount,
  onClick,
  loading
}) => {
  const [planIndex, setPlanIndex] = useState(-1)
  const [t, i18n] = useTranslation('translation')
  const [currencySymbol, setCurrencySymbol] = useState('$')

  const [coupon, setCoupon] = useState([])

  useEffect(() => {
    if (selected === null) {
      setPlanIndex(-1)
      return
    }
    for (let i = 0; i < plans.length; i++) {
      if (plans[i].payment_id === selected) setPlanIndex(i)
    }
  }, [selected])

  useEffect(() => {
    setCurrencySymbol(currency === 0 ? '$' : '₩')
  }, [currency])

  return (
    <div className='subscription'>
      {plans
        .filter(plan =>
          currency === 0
            ? plan.price.currency === 'usd'
            : plan.price.currency === 'krw'
        )
        .map((subscription, index) => {
          const weeks =
            parseInt(subscription.period) *
            (subscription.period.indexOf('year') > -1 ? 12 : 4)
          const wi_classes = (subscription.total_classes / weeks).toFixed(0)
          const price_per_class = (
            subscription.price.origin / subscription.total_classes
          ).toFixed(2)
          return (
            <div
              key={`subscribe-card-${index}`}
              className={`card ${
                subscription.plan === selected ? 'active' : ''
              }`}
            >
              <div>
                <div className='body'>
                  {hasDiscount && (
                    <div className='discount-info'>
                      <img src={ImgDiscount} alt='' />
                      <span>{t('summer_discount')}</span>
                      <span>-25% off</span>
                    </div>
                  )}
                  <div className='inner'>
                    <div className='top-part'>
                      <p className='name'>{subscription.lesson_type}</p>
                      <div className='lessons'>
                        <div>
                          <span>{wi_classes * weeks}</span>
                          <span>{t('classes')}</span>
                        </div>
                      </div>
                      <div className='classes-week'>
                        <span>
                          {wi_classes} {t('class')}
                        </span>
                        <svg
                          width='12'
                          height='36'
                          viewBox='0 0 12 36'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path d='M11.5 1L0.5 35' stroke='#C4C4C4' />
                        </svg>
                        <span>{t('week')}</span>
                      </div>
                      {hasDiscount && (
                        <div className='origin-price'>
                          <span>
                            {currencySymbol}
                            {(price_per_class * wi_classes * weeks).toFixed(2)}
                          </span>
                          <span>
                            {currencySymbol}
                            {price_per_class}/{t('class')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='middle-part'>
                      <span>
                        {currencySymbol}
                        {(
                          price_per_class *
                          wi_classes *
                          weeks *
                          (hasDiscount ? 0.75 : 1)
                        ).toFixed(2)}
                      </span>
                      <span>
                        {currencySymbol}
                        {price_per_class}/{t('class')}
                      </span>
                    </div>
                    <div className='bottom-part'>
                      <span>
                        {t('weeks_classes_each', {
                          weeks: wi_classes * weeks,
                          duration: subscription.duration
                        })}
                      </span>
                      <span>{t('pay_every_weeks', { weeks })}</span>
                    </div>
                  </div>
                </div>
              </div>
              {hasDiscount && (
                <div className='coupons'>
                  <input
                    type='text'
                    placeholder='Your discount code here...'
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                  />
                </div>
              )}
              <div className='bottom'>
                <div
                  className='btn'
                  onClick={
                    subscription.payment_id !== selected
                      ? () => onClick(subscription.payment_id, coupon)
                      : () => {}
                  }
                >
                  {!selected
                    ? t('select')
                    : subscription.payment_id === selected
                    ? t('selected')
                    : index < planIndex
                    ? t('downgrade')
                    : t('upgrade')}
                </div>
              </div>
            </div>
          )
        })}
      {loading && (
        <div className='loading'>
          <div className='trans-bg' />
          <Loader
            className='align-center'
            type='Audio'
            color='#00BFFF'
            height={50}
            width={50}
          />
        </div>
      )}
    </div>
  )
}

export default NewSubscription
