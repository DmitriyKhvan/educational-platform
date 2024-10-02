import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/app/providers/auth-provider';
import { Courses } from '@/components/buy-package/courses';
import { OrderSummary } from '@/components/buy-package/order-summary';
import { Packages } from '@/components/buy-package/packages';
import { PromoBanner } from '@/components/buy-package/promo-banner';
import { SessionsPerWeek } from '@/components/buy-package/sessions-per-week';
import { SessionsTime } from '@/components/buy-package/sessions-time';
import Loader from '@/components/loader/loader';
import { COURSES } from '@/shared/apollo/queries/courses/courses';
import { getTranslatedTitle } from '@/shared/utils/get-translated-title';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';

import { useCurrency } from '@/app/providers/currency-provider';
import { Currencies, DiscountType } from '@/shared/constants/global';
import { currencyFormat } from '@/shared/utils/currency-format';
import type { Course, Package, Query } from '@/types/types.generated';
import { useMediaQuery } from 'react-responsive';

export default function BuyPackage() {
  const isTablet = useMediaQuery({ minWidth: 1280 });
  const { user } = useAuth();
  const { curCurrency } = useCurrency();
  const [t, i18n] = useTranslation('purchase');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [selectedSessionTime, setSelectedSessionTime] = useState<number | null>(null);
  const [selectedSessionsPerWeek, setSelectedSessionsPerWeek] = useState<number | null>(null);

  const [uniqueSessionsTime, setUniqueSessionsTime] = useState<number[]>([]);
  const [uniqueSessionsPerWeek, setUniqueSessionsPerWeek] = useState<number[]>([]);

  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const [promoPackage, setPromoPackage] = useState<Package>();

  const discount = useMemo(() => {
    if (user?.personalPromotionCodes?.length) {
      return user.personalPromotionCodes[0]?.discountType === DiscountType.PERCENT
        ? `${user.personalPromotionCodes[0].value}%`
        : user?.personalPromotionCodes?.[0]?.value &&
            currencyFormat({
              number: user?.personalPromotionCodes?.[0]?.value,
            });
    }
  }, [user]);

  const { error, data, loading } = useQuery<Query>(COURSES, {
    fetchPolicy: 'no-cache',
    variables: {
      trialFilter: 'only_regular',
      ...(user?.personalPromotionCodes?.length && {
        applyPersonalDiscountCode: true,
      }),
    },
  });

  useEffect(() => {
    if (data) {
      const coursesFiltered = data.courses
        .filter((course): course is Course => !!course?.active && !!course?.packages?.length)
        .map((course) => ({
          ...course,
          title: getTranslatedTitle(course, i18n.language),
          packages: course.packages
            ?.filter((pkg) => pkg?.period !== 1)
            ?.sort((a, b) => (a?.period ?? 0) - (b?.period ?? 0)),
        }))
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

      setCourses(coursesFiltered);

      setSelectedCourse(coursesFiltered[0] || null);
    }
  }, [data, i18n.language]);

  useEffect(() => {
    if (selectedCourse) {
      const uniqueSessionsTime = [
        ...new Set(
          selectedCourse?.packages
            ?.map((item) => item?.sessionTime)
            .filter((time) => time !== null && time !== undefined) ?? [],
        ),
      ].sort((a, b) => (a ?? 0) - (b ?? 0));

      const uniqueSessionsPerWeek = [
        ...new Set(
          selectedCourse?.packages
            ?.map((item) => item?.sessionsPerWeek)
            .filter((sessions) => sessions !== null && sessions !== undefined) ?? [],
        ),
      ].sort((a, b) => (a ?? 0) - (b ?? 0));

      setUniqueSessionsTime(uniqueSessionsTime);
      setUniqueSessionsPerWeek(uniqueSessionsPerWeek);

      setSelectedSessionTime(uniqueSessionsTime[0] ?? null);
      setSelectedSessionsPerWeek(uniqueSessionsPerWeek[0] ?? null);
    }
  }, [selectedCourse]);

  const filteredPackage = useMemo(() => {
    if (selectedSessionTime && selectedSessionsPerWeek) {
      const packages = selectedCourse?.packages
        ?.filter((pkg) => {
          const conditions = [true];

          if (!selectedSessionTime) {
            conditions.push(true);
          } else {
            conditions.push(pkg?.sessionTime === selectedSessionTime);
          }

          if (!selectedSessionsPerWeek) {
            conditions.push(true);
          } else {
            conditions.push(pkg?.sessionsPerWeek === selectedSessionsPerWeek);
          }

          return conditions.every((condition) => condition);
        })
        .map((pkg) => ({
          ...pkg,
          price: pkg?.prices?.find(
            (price) => price?.currency === curCurrency?.value?.toLocaleLowerCase(),
          )?.price,
        }));

      setSelectedPackage(undefined);
      return packages;
    }
  }, [selectedSessionTime, selectedSessionsPerWeek, curCurrency, selectedCourse?.packages]);

  if (loading) return <Loader height="100vh" />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap w-full gap-8 sm:gap-10 xl:gap-12">
        {/* left block */}
        <div className="grow">
          {!isTablet && (
            <>
              {user?.personalPromotionCodes?.length && !promoPackage && (
                <PromoBanner
                  icon={<span className="text-xl">🎁</span>}
                  title={`You received a ${discount} discount`}
                  text="Purchase a package to use it now!"
                  className="flex bg-[#F14E1C]"
                />
              )}

              {promoPackage && discount && (
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
              filteredPackage={
                filteredPackage as unknown as (Omit<Package, 'prices'> & {
                  price: number;
                })[]
              }
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
              {user?.personalPromotionCodes?.length && !promoPackage && (
                <PromoBanner
                  icon={<span className="text-xl">🎁</span>}
                  title={`You received a ${discount} discount`}
                  text="Purchase a package to use it now!"
                  className="flex bg-[#F14E1C]"
                />
              )}

              {promoPackage && discount && (
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

      {curCurrency?.value === Currencies.TWD && (
        <div className="mt-10">
          <p className="text-sm">
            請注意：結帳時的最終費用可能略有不同。不用擔心，只需繼續付款即可，結帳時看到的金額將是最終費用。
          </p>
        </div>
      )}
    </>
  );
}
