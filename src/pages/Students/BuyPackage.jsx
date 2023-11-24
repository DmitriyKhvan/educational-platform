import React, { useEffect, useState } from 'react';
import { ReactComponent as ArrowBack } from '../../assets/images/arrow_back.svg';
import Loader from '../../components/Loader/Loader';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/AlertDialog';
import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../modules/auth';

import purchaseBack from '../../assets/images/purchase/purchaseBack.png';
import course0 from '../../assets/images/purchase/0.png';
import course1 from '../../assets/images/purchase/1.png';
import course2 from '../../assets/images/purchase/2.png';
import course3 from '../../assets/images/purchase/3.png';
// import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  // SelectValue,
} from '../../components/SelectAction';
import BuyPackageDiscountForm from 'src/components/BuyPackageDiscountForm';
import { calculatePriceWithDiscount } from 'src/utils/calculatePriceWithDiscount';
import { currencyFormat } from 'src/utils/currencyFormat';
import { DiscountType } from 'src/constants/global';

// const CREATE_PAYMENT = gql`
//   mutation CreatePayment(
//     $userId: ID!
//     $packageId: ID!
//     $provider: String
//     $metadata: JSON
//   ) {
//     createPayment(
//       userId: $userId
//       packageId: $packageId
//       provider: $provider
//       metadata: $metadata
//     ) {
//       id
//       status
//       provider
//       cancelReason
//       metadata
//     }
//   }
// `;

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
  const [parent] = useAutoAnimate();
  const { courseId } = useParams();
  // const { user } = useAuth();

  // const [createPayment] = useMutation(CREATE_PAYMENT);

  const [t] = useTranslation(['purchase', 'minutes', 'translations']);

  const {
    error,
    data: allCourses,
    loading,
  } = useQuery(GET_COURSES, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setData(data.courses.find((course) => course?.packages?.length > 0));
    },
  });

  const [data, setData] = useState(null);

  const [getSecret] = useMutation(CREATE_PAYMENT_INTENT, {
    variables: {
      id: parseInt(courseId),
    },
  });

  const [courseData, setCourseData] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedSessionsPerWeek, setSelectedSessionsPerWeek] = useState(null);
  const [uniqueLength, setUniqueLength] = useState([]);
  const [uniqueSessionsPerWeek, setUniqueSessionsPerWeek] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('stripe');

  const history = useHistory();

  const courses = [course0, course1, course2, course3];

  useEffect(() => {
    //I had to copy it otherwise it won’t sort
    if (data) {
      const cloneSortData = structuredClone(data);
      cloneSortData.packages.sort((a, b) => a.period - b.period);
      setCourseData(cloneSortData);
    }

    setUniqueLength([
      ...new Set(data?.packages?.map((item) => item.sessionTime) ?? []),
    ]);
    setUniqueSessionsPerWeek(
      [
        ...new Set(data?.packages?.map((item) => item.sessionsPerWeek) ?? []),
      ].sort((a, b) => a - b),
    );

    setSelectedLength(data?.packages[0]?.sessionTime);
    setSelectedSessionsPerWeek(data?.packages[0]?.sessionsPerWeek);
  }, [data]);

  if (loading) return <Loader />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  const submitStripe = async () => {
    if (selectedPackage) {
      const response = await getSecret({
        variables: {
          id: parseInt(selectedPackage.id),
        },
      });
      if (response?.errors) {
        toast.error(response.errors[0].message);
      } else if (response?.data) {
        const { clientSecret } = response.data.createPaymentIntent;
        if (clientSecret) {
          history.push(
            `/purchase/${selectedPackage.id}/payment/${clientSecret}`,
          );
        }
      }
    }
  };

  const submitNice = () => {
    history.push(`/purchase/nice-payment`, {
      packageId: selectedPackage.id,
      courseTitle: courseData.title,
      amount: calculatePriceWithDiscount(selectedPackage),
    });
  };

  return (
    <main
      style={{ background: `url('${purchaseBack}')` }}
      className={`bg-cover h-screen overflow-auto`}
    >
      <div className="flex flex-col justify-center items-center p-4 transition-all duration-300">
        <div
          className="bg-gray-200/90 backdrop-blur-md backdrop-saturate-200 border-gray-100/40 border p-4 rounded-xl max-w-5xl w-full cool-shadow flex flex-col gap-8 md:gap-6 md:flex-row bg-center transition-transform duration-300"
          ref={parent}
        >
          <div className="flex flex-col gap-8 h-fit max-w-xs">
            {allCourses?.courses?.map((course, index) => {
              return (
                <div
                  key={course.id}
                  className={`rounded-lg bg-cover aspect-square w-full h-full p-3 flex flex-col justify-between ${
                    course.packages.length < 1 &&
                    'opacity-50 cursor-not-allowed'
                  } ${data?.id === course.id && 'border-2 border-purple-600'}`}
                  style={{
                    // background: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)),url(${course?.coverImage})`,
                    background: `url(${courses[index]})`,
                  }}
                  onClick={() => {
                    if (course.packages.length > 0) setData(course);
                    setSelectedPackage(null);
                  }}
                  aria-disabled={course.packages.length < 1}
                >
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-2xl bg-white">
                    {course.title}
                  </h1>
                  <p className="text-gray-300 bg-gray-900/80 rounded-md p-2 text-sm max-w-4xl mt-auto">
                    {course.description}
                  </p>
                </div>
              );
            })}
          </div>
          <hr className="border-gray-400/50 rounded-full border md:hidden" />
          <form className="w-full flex flex-col gap-3">
            <p className="text-lg font-bold text-gray-700/90">
              {t('duration')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              {uniqueLength?.map((length) => (
                <div key={length}>
                  <input
                    type="radio"
                    id={'length' + length}
                    name="duration"
                    value={'length' + length}
                    checked={selectedLength === length}
                    className="hidden peer"
                    onChange={() => {
                      setSelectedLength(length);
                      setSelectedPackage(null);
                    }}
                  />
                  <label
                    className="flex flex-row justify-between items-center bg-gray-100/80 backdrop-blur-md text-gray-700/90 backdrop-saturate-200 border-gray-100/40 border-2 py-2 px-4 rounded-xl hover:border-purple-300 duration-300 peer-checked:border-purple-600 hover:shadow-gray-900/5 hover:shadow-xl"
                    htmlFor={'length' + length}
                  >
                    <div className="flex flex-col">
                      <p className="text-lg font-bold">
                        {length}{' '}
                        {t('minutes', {
                          ns: 'common',
                        })}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {uniqueSessionsPerWeek?.map((sessionsPerWeek) => (
                <div key={'sessionsPerWeekKey' + sessionsPerWeek}>
                  <input
                    type="radio"
                    id={'sessionsPerWeek' + sessionsPerWeek}
                    name="sessionsPerWeekInput"
                    value={'sessionsPerWeek' + sessionsPerWeek}
                    checked={selectedSessionsPerWeek === sessionsPerWeek}
                    className="hidden peer"
                    onChange={() => {
                      setSelectedSessionsPerWeek(sessionsPerWeek);
                      setSelectedPackage(null);
                    }}
                  />
                  <label
                    className="flex flex-row justify-between items-center bg-gray-100/80 backdrop-blur-md text-gray-700/90 backdrop-saturate-200 border-gray-100/40 border-2 py-2 px-4 rounded-xl hover:border-purple-300 duration-300 peer-checked:border-purple-600 hover:shadow-gray-900/5 hover:shadow-xl"
                    htmlFor={'sessionsPerWeek' + sessionsPerWeek}
                  >
                    <div className="flex flex-col">
                      <p className="text-lg font-bold">
                        {t('times_per_week', {
                          count: sessionsPerWeek,
                          interpolation: {},
                        })}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-lg font-bold text-gray-700/90">{t('length')}</p>
            <div className="flex flex-col gap-2" ref={parent}>
              {/* <pre>{JSON.stringify(courseData, null, 2)}</pre> */}
              {courseData?.packages.map(
                (pkg) =>
                  pkg.period !== 1 &&
                  pkg.sessionTime === selectedLength &&
                  pkg.sessionsPerWeek === selectedSessionsPerWeek && (
                    <div key={pkg.id}>
                      <input
                        type="radio"
                        id={'package' + pkg.id}
                        name="package"
                        value={'package' + pkg.id}
                        onChange={() => {
                          setSelectedPackage(pkg);
                        }}
                        defaultChecked={selectedPackage === pkg}
                        className="hidden peer"
                      />
                      <label
                        className="relative sflex flex-row justify-between items-center bg-gray-100/80 backdrop-blur-md text-gray-700/90 backdrop-saturate-200 border-gray-100/40 border-2 py-2 px-4 rounded-xl hover:border-purple-300 duration-300 peer-checked:border-purple-600 hover:shadow-gray-900/5 hover:shadow-xl cursor-pointer"
                        htmlFor={'package' + pkg.id}
                      >
                        {pkg.discount > 0 && (
                          <span className="absolute text-xs -right-4 -top-2 bg-purple-600 p-1 rounded-full aspect-square flex items-center justify-center text-white font-bold">
                            {' '}
                            -{pkg.discount}%
                          </span>
                        )}
                        <div className="flex sm:flex-row flex-wrap justify-between  w-full items-center gap-1">
                          <div>
                            <p className="text-2xl font-bold w-full flex-grow">
                              {pkg.period}{' '}
                              {t('months', {
                                count: pkg.period,
                              })}
                            </p>
                            <p className="text-sm opacity-75">
                              {t('times_per_week', {
                                count: pkg.sessionsPerWeek,
                                interpolation: {},
                              })}
                            </p>
                            <p className="text-sm opacity-75">
                              {pkg.totalSessions}{' '}
                              {t('lessons', {
                                ns: 'common',
                              })}
                            </p>
                            <p className="text-sm opacity-75">
                              {`${currencyFormat({
                                number: Math.round(
                                  calculatePriceWithDiscount(pkg) /
                                    pkg.totalSessions,
                                ),
                              })} / ${t('lesson', {
                                ns: 'translations',
                              })}`}
                            </p>
                          </div>

                          {pkg?.promotionCode?.discountType ===
                          DiscountType.FIXED ? (
                            <div className="flex flex-col items-center">
                              <div className="text-lg opacity-80 font-bold line-through">
                                {currencyFormat({ number: pkg.price })}
                              </div>
                              <div className="text-2xl font-bold">
                                {currencyFormat({
                                  number: calculatePriceWithDiscount(pkg),
                                })}
                              </div>
                            </div>
                          ) : pkg?.discount ? (
                            <div className="flex flex-col items-center">
                              <div className="text-lg opacity-80 font-bold line-through">
                                {currencyFormat({ number: pkg.price })}
                              </div>
                              <div className="text-2xl font-bold">
                                {currencyFormat({
                                  number: calculatePriceWithDiscount(pkg),
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-right">
                              <div>{currencyFormat({ number: pkg.price })}</div>
                              <div className="text-sm opacity-75 font-normal">
                                {`${currencyFormat({
                                  number:
                                    calculatePriceWithDiscount(pkg) /
                                    pkg.period,
                                })} / month`}
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ),
              )}
              {/* {selectedPackage !== null && (
                <button
                  className="bg-purple-600 cursor-pointer rounded-xl font-bold text-white py-2 max-w-[16rem] justify-center self-end w-full flex flex-row gap-2 items-center hover:brightness-75 duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  type="button"
                  onClick={submitStripe}
                >
                  Proceed to checkout
                </button>
              )} */}
              {selectedPackage !== null && (
                <div className="flex flex-col justify-end">
                  <BuyPackageDiscountForm
                    selectedPackage={selectedPackage}
                    setCourseData={setCourseData}
                    setSelectedPackage={setSelectedPackage}
                    courseData={data}
                  ></BuyPackageDiscountForm>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="bg-purple-600 cursor-pointer rounded-xl font-bold text-white py-2 max-w-[16rem] justify-center self-end w-full flex flex-row gap-2 items-center hover:brightness-75 duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        type="button"
                      >
                        {t('proceed_checkout')}
                        <ArrowBack className="brightness-0 invert rotate-180 scale-125" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('agreement')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('clicking')}{' '}
                          <a
                            href="https://www.naonow.com/terms-and-conditions"
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            {t('terms')}
                          </a>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="mr-4">
                          {t('cancel', {
                            ns: 'common',
                          })}
                        </AlertDialogCancel>
                        <Select
                          defaultValue={selectedProvider}
                          onValueChange={setSelectedProvider}
                        >
                          <div className="flex flex-row bg-purple-400 rounded-md">
                            <AlertDialogAction
                              onClick={() => {
                                if (selectedProvider === 'nice') submitNice();
                                else submitStripe();
                              }}
                              asChild
                            >
                              <button className="rounded-tl-md rounded-bl-md h-full font-semibold bg-purple-600 text-white text-sm py-1 px-4 min-w-[9rem]">
                                Pay
                                {/* with <SelectValue /> */}
                              </button>
                            </AlertDialogAction>
                            <SelectTrigger className="rounded-tr-md rounded-br-md ml-[1px]"></SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectGroup>
                                <SelectItem value="stripe">Stripe</SelectItem>
                                {/* <SelectItem value="nice">NICE</SelectItem> */}
                              </SelectGroup>
                            </SelectContent>
                          </div>
                        </Select>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
