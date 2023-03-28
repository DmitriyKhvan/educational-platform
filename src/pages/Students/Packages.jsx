import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/Layout'
import '../../assets/styles/student.scss'
import ImgChecked from '../../assets/images/checked.svg'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Modal from '../../components/Modal'
import NotificationManager from '../../components/NotificationManager'
import { Checkbox } from '../../components/Checkbox'
import {
  getPlan,
  createPlan,
  updatePlan,
  getSubscriptions
} from '../../actions/subscription'
import SubscriptionApi from '../../api/SubscriptionApi'
import { useTranslation } from 'react-i18next'
import {
  class_durations,
  class_types,
  courses,
  currencies
} from '../../constants/global'
import MultipleToggle from '../../components/MultipleToggle'
import {
  // CardElement,
  // Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  // useStripe,
  useElements
} from '@stripe/react-stripe-js'
import NewSubscription from '../../components/NewSubscription'

/**
 * Constants
 */

export const PackagesView = () => {
  const [t, i18n] = useTranslation('translation')
  const subscription_plan = useSelector(state => state.students.subscription)
  const loading = useSelector(state => state.students.loading)
  const dispatch = useDispatch()
  // const stripe = useStripe()
  const stripe = null
  const elements = useElements()

  const [courseIndex, setCourseIndex] = useState(0)
  const [durationIndex, setDurationIndex] = useState(0) // 0: 30min, 1: 60min
  const [classTypeIndex, setClassTypeIndex] = useState(0) // 0: 1-on-1, 1: group
  const [subDurations, setSubDurations] = useState([])
  const [subDurIndex, setSubDurIndex] = useState(0)
  const [currencyIndex, setCurrencyIndex] = useState(0)
  const [hasDiscount, setHasDiscount] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isFetchPlan, setIsFetchPlan] = useState(false)
  const subscriptionsList = useSelector(
    state => state.subscription.subscriptions
  )
  const loadingSubscriptions = useSelector(state => state.subscription.loading)

  const [localloading, setLocalloading] = useState(false)

  useEffect(() => {
    let data = {
      group_type: class_types[classTypeIndex],
      lesson_type: courses[courseIndex].package,
      duration: class_durations[durationIndex]
    }
    dispatch(getSubscriptions(data))
  }, [courseIndex, durationIndex, classTypeIndex])

  useEffect(() => {
    if (subscriptionsList && subscriptionsList.length > 0) {
      if (subscriptionsList[0].data.length > 2) {
        setSubDurations(subscriptionsList.map(sub => sub.period))
        setSubDurIndex(0)
        setSubscriptions(subscriptionsList[0].data)
      } else {
        setSubDurations([])
        const subscriptons = subscriptionsList.map(sub => sub.data).flat()
        setSubscriptions(subscriptons)
      }
    } else {
      setSubscriptions([])
      setSubDurations([])
      setSubDurIndex(0)
    }
    setIsFetchPlan(true)
  }, [subscriptionsList])

  useEffect(() => {
    setIsFetchPlan(true)
  }, [subDurIndex])

  useEffect(() => {
    if (isFetchPlan) {
      let data = {
        group_type: class_types[classTypeIndex],
        lesson_type: courses[courseIndex].package,
        duration: class_durations[durationIndex]
      }
      if (subDurations && subDurations.length > 0) {
        const period =
          subDurations[subDurIndex].indexOf('year') > -1
            ? 12
            : parseInt(subDurations[subDurIndex])
        data = {
          ...data,
          period
        }
      }
      setIsFetchPlan(false)
      dispatch(getPlan(data))
    }
  }, [isFetchPlan])

  useEffect(() => {
    if (subscription_plan && subscription_plan.length > 0) {
      setSelectedPlan(subscription_plan[0].payment_id)
    } else {
      setSelectedPlan(null)
    }
  }, [subscription_plan])

  useEffect(() => {
    if (subDurations.length > 0) {
      setSubscriptions(subscriptionsList[subDurIndex].data)
    }
  }, [subDurIndex])

  const addCardOnStripe = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }
    const card = elements.getElement(CardNumberElement)
    return await stripe.createPaymentMethod({
      type: 'card',
      card: card
    })
  }

  const onSaveCreditCard = async () => {
    setLocalloading(true)
    const { paymentMethod, error } = await addCardOnStripe()
    if (error) {
      NotificationManager.error(error.message, t)
      return
    }

    try {
      await SubscriptionApi.addCreditCard(paymentMethod)
      
    } catch (e) {
      NotificationManager.error(
        e?.response?.data?.error?.message || t('server_issue'),
        t
      )
    }
    setLocalloading(false)
  }

  const onClickPlan = async (plan, promoCode) => {
    try {
      setLocalloading(true)
      if (selectedPlan === null) {
        if (promoCode && promoCode.length) {
          try {
            const { data: couponData } = await SubscriptionApi.validCoupon(
              promoCode
            )
          } catch (error) {
            NotificationManager.error(
              error?.response?.data?.error?.message ||
                t('invalided_couponcode'),
              t
            )
          }
        }

        await SubscriptionApi.createPlan(plan)
      } else {
        await SubscriptionApi.updatePlan(plan)
      }
      setSelectedPlan(plan)
      
      setLocalloading(false)
    } catch (e) {
      setLocalloading(false)
      NotificationManager.error(
        e?.response?.data?.error?.message || t('server_issue'),
        t
      )
    }
  }

  const onChangeCourseIndex = index => {
    setCourseIndex(index)
    onChangeDurationIndex(0)
  }

  const onChangeDurationIndex = index => {
    setDurationIndex(index)
    // onChangeClassTypeIndex(0);
  }

  const onChangeClassTypeIndex = index => {
    setClassTypeIndex(index)
    setSubDurations(0)
  }

  const onChangeSubDuration = index => {
    setSubDurIndex(index)
  }

  const onChangeCurrencyIndex = index => {
    setCurrencyIndex(index)
  }

  const onChangeHasDiscount = () => {
    setHasDiscount(!hasDiscount)
  }

  return (
    <>
      <p className='sub-title'>1) {t('choose_course')}</p>
      <div className='course-wrapper'>
        {courses.map((course, index) => (
          <div
            key={`course-${index}`}
            className={`course ${index === courseIndex ? 'active' : ''}`}
            onClick={() => onChangeCourseIndex(index)}
          >
            <div>{t(course.label)}</div>
          </div>
        ))}
      </div>

      <p className='sub-title'>{t('credit_card_details')}</p>
      <div className='card-info'>
        <label htmlFor='card_number' className='card-label'>
          {t('card_number')}
        </label>
        <CardNumberElement id='card_number' />
        <div className='exp_cvc'>
          <div>
            <label htmlFor='card_expire' className='card-label'>
              {t('expiration_date')}
            </label>
            <CardExpiryElement id='card_expire' />
          </div>
          <div>
            <label htmlFor='card_cvc' className='card-label'>
              {t('cvc')}
            </label>
            <CardCvcElement id='card_cvc' />
          </div>
        </div>
        <button
          className='btn'
          onClick={onSaveCreditCard}
          disabled={!stripe || !elements}
        >
          {t('save_changes')}
        </button>
      </div>

      <p className='sub-title'>2) {t('your_plan')}</p>
      <div className='plan-wrapper'>
        <div>
          <MultipleToggle
            label={t('class_duration')}
            items={class_durations}
            onChange={onChangeDurationIndex}
            defaultActiveIndex={durationIndex}
          />
          <MultipleToggle
            label={t('class_type')}
            items={courses[courseIndex].options.map(idx => class_types[idx])}
            onChange={onChangeClassTypeIndex}
            defaultActiveIndex={classTypeIndex}
          />
          <MultipleToggle
            label={t('currency')}
            items={currencies}
            onChange={onChangeCurrencyIndex}
            defaultActiveIndex={currencyIndex}
          />
        </div>
        {subDurations.length > 0 && <p className='divider' />}
        {subDurations.length > 0 && (
          <div>
            <MultipleToggle
              label={'Subscription'}
              items={subDurations}
              onChange={onChangeSubDuration}
              defaultActiveIndex={0}
            />
            {/* <Checkbox label={t('have_discount_code')} onChange={onChangeHasDiscount} checked={hasDiscount} /> */}
          </div>
        )}
      </div>
      {loadingSubscriptions || loading || localloading ? (
        <Loader
          className='align-center'
          type='Audio'
          color='#00BFFF'
          height={50}
          width={50}
        />
      ) : (
        <>
          {classTypeIndex === 1 && (
            <div className='group'>
              <Checkbox
                label={t('have_discount_code')}
                onChange={onChangeHasDiscount}
                checked={hasDiscount}
              />
            </div>
          )}
          <p className='selected-plan-detail'>
            Showing our{' '}
            <strong>
              {class_durations[durationIndex].replace('min', ' mins')}{' '}
              {class_types[classTypeIndex]} plans
            </strong>
            {classTypeIndex === 0
              ? `, subscribed for ${subDurations[subDurIndex]}`
              : ''}{' '}
            :
          </p>
          <div className='subscription-wrapper'>
            <NewSubscription
              currency={currencyIndex}
              plans={subscriptions}
              selected={selectedPlan}
              hasDiscount={hasDiscount}
              onClick={onClickPlan}
              loading={loading}
            />
            {/* <div className="btn-select-another-program">
              + {t("select_another_program")}
            </div> */}
          </div>
        </>
      )}
    </>
  )
}

export const Packages = () => {
  const [t, i18n] = useTranslation('translation')
  return (
    <Layout>
      <div className='packages-layout'>
        <h4 className='main-title'>{t('purchase_package')}</h4>
        <div className='scroll-layout'>
          <PackagesView />
        </div>
      </div>
    </Layout>
  )
}
