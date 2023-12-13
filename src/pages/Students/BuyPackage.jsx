import React, { useEffect, useMemo, useState } from 'react';
import Loader from '../../components/Loader/Loader';
// eslint-disable-next-line import/no-unresolved
// import { useAutoAnimate } from '@formkit/auto-animate/react';
// import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
// import { toast } from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

import // Select,
// SelectItem,
// SelectTrigger,
// SelectContent,
// SelectGroup,
// SelectValue,
'../../components/SelectAction';
// import BuyPackageDiscountForm from 'src/components/BuyPackageDiscountForm';
// import { calculatePriceWithDiscount } from 'src/utils/calculatePriceWithDiscount';
// import { currencyFormat } from 'src/utils/currencyFormat';
// import { DiscountType } from 'src/constants/global';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import CheckboxField from 'src/components/Form/CheckboxField';

const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      packages {
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
        period
        discount
        courseId
      }
    }
  }
`;

// const CREATE_PAYMENT_INTENT = gql`
//   mutation CreatePaymentIntent($id: Int!) {
//     createPaymentIntent(packageId: $id) {
//       clientSecret
//     }
//   }
// `;

export default function BuyPackage() {
  // const [parent] = useAutoAnimate();
  // const { courseId } = useParams();

  const [t] = useTranslation(['purchase', 'minutes', 'translations']);

  const {
    error,
    data: courses,
    loading,
  } = useQuery(GET_COURSES, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const course = data.courses.find(
        (course) => course?.packages?.length > 0,
      );

      setSelectedCourse(course);
    },
  });

  // const [getSecret] = useMutation(CREATE_PAYMENT_INTENT, {
  //   variables: {
  //     id: parseInt(courseId),
  //   },
  // });

  const [selectedCourse, setSelectedCourse] = useState(null);
  console.log('selectedCourse', selectedCourse);

  const [selectedSessionTime, setSelectedSessionTime] = useState(null);
  const [selectedSessionsPerWeek, setSelectedSessionsPerWeek] = useState(null);

  const [uniqueSessionTime, setUniqueSessionTime] = useState([]);
  const [uniqueSessionsPerWeek, setUniqueSessionsPerWeek] = useState([]);

  const [changeCourse, setChageCourse] = useState(null);

  const [, /*selectedPackage*/ setSelectedPackage] = useState(null);
  // const [selectedProvider, setSelectedProvider] = useState('stripe');

  // const history = useHistory();

  useEffect(() => {
    if (selectedCourse) {
      const uniqueSessionTime = [
        ...new Set(
          selectedCourse?.packages?.map((item) => item.sessionTime) ?? [],
        ),
      ];

      const uniqueSessionsPerWeek = [
        ...new Set(
          selectedCourse?.packages?.map((item) => item.sessionsPerWeek) ?? [],
        ),
      ].sort((a, b) => a - b);

      setUniqueSessionTime(uniqueSessionTime);
      setUniqueSessionsPerWeek(uniqueSessionsPerWeek);

      setSelectedSessionTime(uniqueSessionTime[0]);
      setSelectedSessionsPerWeek(uniqueSessionsPerWeek[0]);

      setChageCourse(selectedCourse); //so that filtering always occurs after changing sessionTime and selectedSessionsPerWeek
    }
  }, [selectedCourse]);

  const filteredPackage = useMemo(() => {
    if (selectedSessionTime && selectedSessionsPerWeek) {
      return selectedCourse?.packages
        .filter((pkg) => {
          const conditions = [true];

          conditions.push(pkg.period !== 1);

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
        .sort((a, b) => a.period - b.period);
    }
  }, [changeCourse, selectedSessionTime, selectedSessionsPerWeek]);

  if (loading) return <Loader />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  // const submitStripe = async () => {
  //   if (selectedPackage) {
  //     const response = await getSecret({
  //       variables: {
  //         id: parseInt(selectedPackage.id),
  //       },
  //     });
  //     if (response?.errors) {
  //       toast.error(response.errors[0].message);
  //     } else if (response?.data) {
  //       const { clientSecret } = response.data.createPaymentIntent;
  //       if (clientSecret) {
  //         history.push(
  //           `/purchase/${selectedPackage.id}/payment/${clientSecret}`,
  //         );
  //       }
  //     }
  //   }
  // };

  // const submitNice = () => {
  //   history.push(`/purchase/nice-payment`, {
  //     packageId: selectedPackage.id,
  //     courseTitle: courseData.title,
  //     amount: calculatePriceWithDiscount(selectedPackage),
  //   });
  // };

  return (
    <OnboardingLayout>
      <div className="flex flex-wrap w-full px-5 sm:px-20 py-6 sm:py-10">
        {/* left block */}
        <div className="w-full">
          <h2 className="text-4xl font-bold leading-[52px] mb-10">
            Choose your package
          </h2>

          <div className="mb-8">
            <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
              1. Choose your course
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3">
              {courses.courses.map((course) => {
                return (
                  <label key={course.id}>
                    <input
                      type="radio"
                      name="course"
                      checked={course.id === selectedCourse?.id}
                      className="hidden peer"
                      onChange={() => {
                        setSelectedCourse(course);
                        setSelectedPackage(null);
                      }}
                    />

                    <div className="flex justify-center w-full md:w-[188px] p-4 rounded-lg border border-color-[#DEDEE1] peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] transition duration-300 ease-in-out cursor-pointer ">
                      <span className="text-sm truncate">{course.title}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
              2. Choose your schedule
            </h4>

            <div className="grid grid-cols-2 md:flex gap-3">
              {uniqueSessionsPerWeek.map((sessionsPerWeek) => {
                return (
                  <label key={sessionsPerWeek}>
                    <input
                      type="radio"
                      name="sessionsPerWeek"
                      checked={sessionsPerWeek === selectedSessionsPerWeek}
                      className="hidden peer"
                      onChange={() => {
                        setSelectedSessionsPerWeek(sessionsPerWeek);
                        setSelectedPackage(null);
                      }}
                    />

                    <div className="flex justify-center md:w-[188px] p-4 rounded-lg border border-color-[#DEDEE1] peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] transition duration-300 ease-in-out cursor-pointer ">
                      <span className="text-sm truncate">
                        {t('times_per_week', {
                          count: sessionsPerWeek,
                          interpolation: {},
                        })}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
              3. Choose your class duration
            </h4>

            <div className="grid grid-cols-2 md:flex gap-3">
              {uniqueSessionTime.map((sessionTime) => {
                return (
                  <label key={sessionTime}>
                    <input
                      type="radio"
                      name="sessionTime"
                      checked={sessionTime === selectedSessionTime}
                      className="hidden peer"
                      onChange={() => {
                        setSelectedSessionTime(sessionTime);
                        setSelectedPackage(null);
                      }}
                    />

                    <div className="flex justify-center md:w-[188px] p-4 rounded-lg border border-color-[#DEDEE1] peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] transition duration-300 ease-in-out cursor-pointer ">
                      <span className="text-sm truncate">
                        {sessionTime}{' '}
                        {t('minutes', {
                          ns: 'common',
                        })}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
              4. Choose the length of your package
            </h4>

            {filteredPackage?.map((pkg) => {
              return (
                <label key={pkg.id}>
                  <CheckboxField type="radio" />
                  <div className="">{pkg.period}</div>
                </label>
              );
            })}
          </div>
        </div>

        {/* right block */}
        <div className="w-full"></div>
      </div>
    </OnboardingLayout>
  );
}
