import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Courses } from 'src/components/BuyPackage/Courses';
import { OrderSummary } from 'src/components/BuyPackage/OrderSummary';
import { Packages } from 'src/components/BuyPackage/Packages';
import { SessionsPerWeek } from 'src/components/BuyPackage/SessionsPerWeek';
import { SessionsTime } from 'src/components/BuyPackage/SessionsTime';
import { COURSES } from 'src/shared/apollo/queries/courses/courses';
import { getTranslatedTitle } from 'src/shared/utils/getTranslatedTitle';
import Loader from '../../components/Loader/Loader';
import { FaCheck } from 'react-icons/fa6';
import { useAuth } from 'src/app/providers/AuthProvider';
import { PromoBanner } from 'src/components/BuyPackage/PromoBanner';

import { DiscountType } from 'src/shared/constants/global';
import { currencyFormat } from 'src/shared/utils/currencyFormat';
import { useMediaQuery } from 'react-responsive';
import { useCurrency } from 'src/app/providers/CurrencyProvider';

export default function BuyPackage() {
  const isTablet = useMediaQuery({ minWidth: 1280 });
  const { user } = useAuth();
  const { curCurrency } = useCurrency();
  const [t, i18n] = useTranslation('purchase');

  const [courses, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [selectedSessionTime, setSelectedSessionTime] = useState(null);
  const [selectedSessionsPerWeek, setSelectedSessionsPerWeek] = useState(null);

  const [uniqueSessionsTime, setUniqueSessionsTime] = useState([]);
  const [uniqueSessionsPerWeek, setUniqueSessionsPerWeek] = useState([]);

  const [changeCourse, setChageCourse] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [promoPackage, setPromoPackage] = useState(null);

  const discount = useMemo(() => {
    if (user?.personalPromotionCodes?.length > 0) {
      return user.personalPromotionCodes[0]?.discountType ===
        DiscountType.PERCENT
        ? `${user.personalPromotionCodes[0].value}%`
        : currencyFormat({ number: user.personalPromotionCodes[0].value });
    }
  }, [user]);

  const { error, data, loading } = useQuery(COURSES, {
    fetchPolicy: 'network-only',
    variables: {
      trialFilter: 'only_regular',
      ...(user.personalPromotionCodes.length && {
        applyPersonalDiscountCode: true,
      }),
    },
  });

  useEffect(() => {
    if (data) {
      const coursesFiltered = data.courses
        .filter((course) => course.packages.length > 0 && course.active)
        .sort((a, b) => a.sequence - b.sequence)
        .map((course) => ({
          ...course,
          title: getTranslatedTitle(course, i18n.language),
          packages: course.packages
            .filter((pkg) => pkg.period !== 1)
            .sort((a, b) => a.period - b.period),
        }));

      setCourse(coursesFiltered);

      setSelectedCourse(coursesFiltered[0]);
    }
  }, [data, t]);

  useEffect(() => {
    if (selectedCourse) {
      const uniqueSessionsTime = [
        ...new Set(
          selectedCourse?.packages?.map((item) => item.sessionTime) ?? [],
        ),
      ].sort((a, b) => a - b);

      const uniqueSessionsPerWeek = [
        ...new Set(
          selectedCourse?.packages?.map((item) => item.sessionsPerWeek) ?? [],
        ),
      ].sort((a, b) => a - b);

      setUniqueSessionsTime(uniqueSessionsTime);
      setUniqueSessionsPerWeek(uniqueSessionsPerWeek);

      setSelectedSessionTime(uniqueSessionsTime[0]);
      setSelectedSessionsPerWeek(uniqueSessionsPerWeek[0]);

      setChageCourse(selectedCourse); //so that filtering always occurs after changing sessionTime and selectedSessionsPerWeek
    }
  }, [selectedCourse]);

  const filteredPackage = useMemo(() => {
    if (selectedSessionTime && selectedSessionsPerWeek) {
      setSelectedPackage(null);

      // debugger;

      return selectedCourse?.packages
        .filter((pkg) => {
          const conditions = [true];

          // conditions.push(pkg.period !== 1);

          if (!selectedSessionTime) {
            conditions.push(true);
          } else {
            conditions.push(pkg.sessionTime === selectedSessionTime);
          }

          if (!selectedSessionsPerWeek) {
            conditions.push(true);
          } else {
            conditions.push(pkg.sessionsPerWeek === selectedSessionsPerWeek);
          }

          return conditions.every((condition) => condition);
        })
        .map((pkg) => ({
          ...pkg,
          price: pkg.prices.find(
            (price) => price.currency === curCurrency.value.toLocaleLowerCase(),
          )?.price,
        }));
      // .sort((a, b) => a.period - b.period);
    }
  }, [changeCourse, selectedSessionTime, selectedSessionsPerWeek, curCurrency]);

  if (loading) return <Loader height="100vh" />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-wrap lg:flex-nowrap w-full gap-8 sm:gap-10 xl:gap-12">
      {/* left block */}
      <div className="grow">
        {!isTablet && (
          <>
            {user.personalPromotionCodes.length > 0 && !promoPackage && (
              <PromoBanner
                icon={<span className="text-xl">🎁</span>}
                title={`You received a ${discount} discount`}
                text="Purchase a package to use it now!"
                className="flex bg-[#F14E1C]"
              />
            )}

            {promoPackage && (
              <PromoBanner
                icon={<FaCheck />}
                title={`${discount} discount is activated`}
                text="Please complete purchase the form below"
                className="flex bg-[#00D986]"
              />
            )}
          </>
        )}

        <h2 className="text-3xl sm:text-4xl font-bold sm:leading-[52px] mb-10">
          {t('choose_package')}
        </h2>

        <div className="space-y-8">
          <Courses
            courses={courses}
            setSelectedCourse={setSelectedCourse}
            selectedCourse={selectedCourse}
          />

          <SessionsPerWeek
            uniqueSessionsPerWeek={uniqueSessionsPerWeek}
            setSelectedSessionsPerWeek={setSelectedSessionsPerWeek}
            selectedSessionsPerWeek={selectedSessionsPerWeek}
          />

          <SessionsTime
            uniqueSessionsTime={uniqueSessionsTime}
            setSelectedSessionTime={setSelectedSessionTime}
            selectedSessionTime={selectedSessionTime}
          />

          <Packages
            filteredPackage={filteredPackage}
            setSelectedPackage={setSelectedPackage}
            selectedPackage={selectedPackage}
            setPromoPackage={setPromoPackage}
          />
        </div>
      </div>

      {/* right block */}
      <div className="w-full md:min-w-[414px] md:max-w-[414px]">
        {isTablet && (
          <>
            {user.personalPromotionCodes.length > 0 && !promoPackage && (
              <PromoBanner
                icon={<span className="text-xl">🎁</span>}
                title={`You received a ${discount} discount`}
                text="Purchase a package to use it now!"
                className="flex bg-[#F14E1C]"
              />
            )}

            {promoPackage && (
              <PromoBanner
                icon={<FaCheck />}
                title={`${discount} discount is activated`}
                text="Please complete purchase the form below"
                className="flex bg-[#00D986]"
              />
            )}
          </>
        )}
        <OrderSummary
          selectedPackage={selectedPackage}
          setPromoPackage={setPromoPackage}
          promoPackage={promoPackage}
        />
      </div>
    </div>
  );
}
