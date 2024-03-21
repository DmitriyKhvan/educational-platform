import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import { Courses } from 'src/components/BuyPackage/Courses';
import { SessionsPerWeek } from 'src/components/BuyPackage/SessionsPerWeek';
import { SessionsTime } from 'src/components/BuyPackage/SessionsTime';
import { Packages } from 'src/components/BuyPackage/Packages';
import { OrderSummary } from 'src/components/BuyPackage/OrderSummary';
import Loader from '../../components/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { COURSES } from 'src/modules/graphql/queries/courses/courses';
import { useCourseTranslation } from 'src/utils/useCourseTranslation';

export default function BuyPackage() {
  const { getTitleByCourseId } = useCourseTranslation();
  const [t] = useTranslation('purchase');

  const [courses, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [selectedSessionTime, setSelectedSessionTime] = useState(null);
  const [selectedSessionsPerWeek, setSelectedSessionsPerWeek] = useState(null);

  const [uniqueSessionsTime, setUniqueSessionsTime] = useState([]);
  const [uniqueSessionsPerWeek, setUniqueSessionsPerWeek] = useState([]);

  const [changeCourse, setChageCourse] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [promoPackage, setPromoPackage] = useState(null);
  // const [selectedProvider, setSelectedProvider] = useState('stripe');

  const { error, data, loading } = useQuery(COURSES, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      const coursesFiltered = data.courses
        .filter((course) => course.packages.length > 0 && course.active)
        .sort((a, b) => a.sequence - b.sequence)
        .map((course) => {
          return {
            ...course,
            title: getTitleByCourseId(course.id),
            packages: course.packages
              .filter((pkg) => pkg.period !== 1)
              .sort((a, b) => a.period - b.period),
          };
        });

      setCourse(coursesFiltered);

      // setCourse([coursesFiltered[2], coursesFiltered[0], coursesFiltered[1]]);
      setSelectedCourse(coursesFiltered[2]);
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

      return selectedCourse?.packages.filter((pkg) => {
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
      });
      // .sort((a, b) => a.period - b.period);
    }
  }, [changeCourse, selectedSessionTime, selectedSessionsPerWeek]);

  // For Nice Payment
  // const submitNice = () => {
  //   history.push(`/purchase/nice-payment`, {
  //     packageId: selectedPackage.id,
  //     courseTitle: courseData.title,
  //     amount: calculatePriceWithDiscount(selectedPackage),
  //   });
  // };

  if (loading) return <Loader height="100vh" />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <OnboardingLayout>
      <div className="flex flex-wrap lg:flex-nowrap w-full gap-8 sm:gap-10 xl:gap-12 px-5 sm:px-20 py-6 sm:py-8">
        {/* left block */}
        <div className="grow">
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
          <OrderSummary
            selectedPackage={selectedPackage}
            setPromoPackage={setPromoPackage}
            promoPackage={promoPackage}
          />
        </div>
      </div>
    </OnboardingLayout>
  );
}
