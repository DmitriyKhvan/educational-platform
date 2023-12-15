import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import CheckboxField from 'src/components/Form/CheckboxField';
import { currencyFormat } from 'src/utils/currencyFormat';
import { calculatePriceWithDiscount } from 'src/utils/calculatePriceWithDiscount';
import Button from 'src/components/Form/Button';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';
import ModalWrapper from 'src/components/ModalWrapper/ModalWrapper';
import { PromoModal } from 'src/components/onboarding/PromoModal';
import { TermsConditionsModal } from 'src/components/onboarding/TermsConditionsModal';

import notify from 'src/utils/notify';
import Loader from '../../components/Loader/Loader';
import { RiErrorWarningFill } from 'react-icons/ri';
import { BsPlus } from 'react-icons/bs';

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

const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($id: Int!) {
    createPaymentIntent(packageId: $id) {
      clientSecret
    }
  }
`;

export default function BuyPackage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTermsConditions, setIsOpenTermsConditions] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [selectedSessionTime, setSelectedSessionTime] = useState(null);
  const [selectedSessionsPerWeek, setSelectedSessionsPerWeek] = useState(null);

  const [uniqueSessionTime, setUniqueSessionTime] = useState([]);
  const [uniqueSessionsPerWeek, setUniqueSessionsPerWeek] = useState([]);

  const [changeCourse, setChageCourse] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [promoPackage, setPromoPackage] = useState(null);
  // const [selectedProvider, setSelectedProvider] = useState('stripe');

  const history = useHistory();

  const [parent] = useAutoAnimate();

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

  const [getSecret, { loading: paymentIntentLoading }] = useMutation(
    CREATE_PAYMENT_INTENT,
  );

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

  const discount = useMemo(() => {
    if (promoPackage) {
      return (
        calculatePriceWithDiscount(selectedPackage) -
        calculatePriceWithDiscount(promoPackage)
      );
    }
  }, [promoPackage]);

  const submitStripe = () => {
    if (selectedPackage) {
      getSecret({
        variables: {
          id: parseInt(selectedPackage.id),
        },
        onCompleted: (data) => {
          const { clientSecret } = data.createPaymentIntent;
          if (clientSecret) {
            history.push(
              `/purchase/${selectedPackage.id}/payment/${clientSecret}`,
            );
          }
        },
        onError: (error) => {
          notify(error.message);
        },
      });
    }
  };

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
      {paymentIntentLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="flex flex-wrap lg:flex-nowrap w-full gap-8 sm:gap-10 xl:gap-12 px-5 sm:px-20 py-6 sm:py-8">
        {/* left block */}
        <div className="grow">
          <h2 className="text-4xl font-bold leading-[52px] mb-10">
            Choose your package
          </h2>

          <div className="space-y-8">
            <div>
              <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
                1. Choose your course
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-3">
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

                      <div className="flex justify-center w-full md:w-[188px] p-4 rounded-lg border border-color-border-grey peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] transition duration-300 ease-in-out cursor-pointer ">
                        <span className="text-sm truncate">{course.title}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
                2. Choose your schedule
              </h4>

              <div
                className="grid grid-cols-2 md:flex md:flex-wrap gap-3"
                ref={parent}
              >
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

                      <div className="flex justify-center md:w-[188px] p-4 rounded-lg border border-color-border-grey peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] transition duration-300 ease-in-out cursor-pointer ">
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

            <div>
              <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
                3. Choose your class duration
              </h4>

              <div className="grid grid-cols-2 md:flex gap-3" ref={parent}>
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

                      <div className="flex justify-center md:w-[188px] p-4 rounded-lg border border-color-border-grey peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] transition duration-300 ease-in-out cursor-pointer">
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

            <div>
              <h4 className="text-[15px] font-semibold leading-[18px] mb-4">
                4. Choose the length of your package
              </h4>

              <div
                className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3"
                ref={parent}
              >
                {filteredPackage?.map((pkg) => {
                  return (
                    <label
                      key={pkg.id}
                      className={`flex items-center justify-between w-full md:w-[387px] p-5 rounded-lg border border-color-border-grey transition duration-300 ease-in-out cursor-pointer ${
                        selectedPackage === pkg && 'border-color-purple/50'
                      }`}
                    >
                      <div className="flex items-center gap-4 sm:gap-5">
                        <CheckboxField
                          type="radio"
                          name="package"
                          onChange={() => {
                            setSelectedPackage(pkg);
                            setPromoPackage(pkg);
                          }}
                        />
                        <div className="grow flex flex-col gap-2">
                          <p className="text-xl font-bold">
                            {`${pkg.period} ${t('months', {
                              count: pkg.period,
                            })}`}
                          </p>

                          <p className="text-[15px]">
                            {pkg?.discount ? (
                              <>
                                <span>
                                  {currencyFormat({
                                    number: calculatePriceWithDiscount(pkg),
                                  })}
                                </span>
                                <span className="ml-[6px] text-color-red line-through">
                                  {currencyFormat({ number: pkg.price })}
                                </span>
                              </>
                            ) : (
                              <span>
                                {currencyFormat({ number: pkg.price })}
                              </span>
                            )}
                          </p>

                          <p className="text-sm opacity-75">
                            {`${pkg.totalSessions} ${t('lessons', {
                              ns: 'common',
                            })}, ${currencyFormat({
                              number: Math.round(
                                calculatePriceWithDiscount(pkg) /
                                  pkg.totalSessions,
                              ),
                            })}/${t('lesson', {
                              ns: 'translations',
                            })}`}
                          </p>
                        </div>
                      </div>

                      {pkg?.discount > 0 && (
                        <span className="text-[11px] font-semibold text-white bg-color-red px-[10px] py-[5px] rounded-lg whitespace-nowrap">
                          {pkg?.discount}% OFF
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* right block */}
        <div className="w-full md:min-w-[414px] md:max-w-[414px]">
          <div
            className="w-full p-6 rounded-lg bg-[#F7F8FA] space-y-6"
            ref={parent}
          >
            <h3 className="text-2xl font-bold">Order Summary</h3>

            {selectedPackage && (
              <>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-color-purple/10">
                    <BsPlus className="text-color-purple" />
                  </span>
                  <span className="text-[13px] font-medium text-color-purple">
                    Add promo code (optional)
                  </span>
                </button>

                <div className="space-y-3" ref={parent}>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {`${selectedPackage.period} ${t('months', {
                        count: selectedPackage.period,
                      })}`}
                    </span>
                    <span className="font-semibold">
                      {currencyFormat({
                        number: calculatePriceWithDiscount(selectedPackage),
                      })}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Promo code</span>
                      <span className="font-semibold text-color-purple">
                        {`- ${currencyFormat({
                          number: discount,
                        })}`}
                      </span>
                    </div>
                  )}

                  <div className="divider"></div>

                  <div className="flex items-center justify-between font-bold text-base">
                    <span>Total</span>
                    <span>
                      {currencyFormat({
                        number: calculatePriceWithDiscount(promoPackage),
                      })}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-4 w-full bg-[#EAECF0] rounded-md px-4 py-3">
              <RiErrorWarningFill className="w-5 h-5 text-[#908E97]" />
              <div className="text-[#908E97] space-y-1">
                <p className="">Monthly interest-free installments</p>
                <p className="">available at checkout</p>
              </div>
            </div>

            <Button
              disabled={!selectedPackage}
              className="w-full h-auto py-5 px-10"
              onClick={() => setIsOpenTermsConditions(true)}
            >
              Proceed to payment
            </Button>
          </div>
        </div>
      </div>

      <ModalWrapper
        isOpen={isOpen}
        closeModal={setIsOpen}
        widthContent="400px"
        paddingContent="40px 32px"
      >
        <PromoModal
          selectedPackage={selectedPackage}
          setPromoPackage={setPromoPackage}
          setIsOpen={setIsOpen}
        />
      </ModalWrapper>

      <ModalWrapper
        isOpen={isOpenTermsConditions}
        closeModal={setIsOpenTermsConditions}
        widthContent="400px"
        paddingContent="40px 32px"
      >
        <TermsConditionsModal
          submitStripe={submitStripe}
          setIsOpenTermsConditions={setIsOpenTermsConditions}
        />
      </ModalWrapper>
    </OnboardingLayout>
  );
}
