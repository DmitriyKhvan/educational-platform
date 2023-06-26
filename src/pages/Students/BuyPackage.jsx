import React, { useEffect, useState } from 'react';
import { ReactComponent as ArrowBack } from '../../assets/images/arrow_back.svg';
import Loader from '../../components/Loader/Loader';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

const GET_COURSES = gql`
  query GetCourse($id: Int!) {
    course(id: $id) {
      id
      title
      description
      packages {
        period
        discount
        id
        totalSessions
        sessionsPerWeek
        sessionTime
        price
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
  const { packageId: courseId } = useParams();

  const { error, data } = useQuery(GET_COURSES, {
    variables: {
      id: parseInt(courseId),
    },
  });

  const [getSecret] = useMutation(CREATE_PAYMENT_INTENT, {
    variables: {
      id: parseInt(courseId),
    },
  });

  const [courseData, setCourseData] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [uniqueLength, setUniqueLength] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (!data?.course) return;
    setCourseData(data.course);
    setUniqueLength([
      ...new Set(data.course?.packages?.map((item) => item.sessionTime) ?? []),
    ]);
    setSelectedLength(data?.course?.packages[0]?.sessionTime);
  }, [data]);

  const handleSubmit = async (e) => {
    if (selectedPackage) {
      e.preventDefault();
      const response = await getSecret({
        variables: {
          id: parseInt(selectedPackage.id),
        },
      });
      if (response?.errors) {
        toast.error(response.errors[0].message);
      } else if (response?.data) {
        const { clientSecret } = response.data.createPaymentIntent;
        history.replace(
          `/purchase/${selectedPackage.id}/payment/${clientSecret}`,
        );
      }
    }
  };

  if (!courseData) return <Loader />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <main className="bg-[url(https://dev.naonow.com/img/20210605-NAONOW-FINAL-2%202.png)] bg-cover h-screen overflow-auto">
      <div className="flex flex-col justify-center items-center p-4 transition-all duration-300">
        <div
          className="bg-gray-200/90 backdrop-blur-md backdrop-saturate-200 border-gray-100/40 border p-4 rounded-xl max-w-5xl w-full cool-shadow flex flex-col gap-8 md:gap-6 md:flex-row bg-center transition-transform duration-300"
          ref={parent}
        >
          <div
            className={`rounded-lg bg-cover aspect-square w-full h-full p-3 flex flex-col justify-between`}
            style={{
              background: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)),url(${courseData?.coverImage})`,
            }}
          >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-2xl bg-white">
              {courseData.title}
            </h1>
            <p className="text-gray-300 bg-gray-900/80 rounded-md p-2 text-sm max-w-4xl mt-auto">
              {courseData.description}
            </p>
          </div>
          <hr className="border-gray-400/50 rounded-full border md:hidden" />
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="w-full flex flex-col gap-3"
          >
            <p className="text-lg font-bold text-gray-700/90">
              Choose the duration:
            </p>
            <div className="flex gap-2">
              {uniqueLength?.map((length) => (
                <div key={length}>
                  <input
                    type="radio"
                    id={'length' + length}
                    name="duration"
                    value={'length' + length}
                    defaultChecked={selectedLength === length}
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
                      <p className="text-lg font-bold">{length} minutes</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-lg font-bold text-gray-700/90">
              Choose number of lessons per week:
            </p>
            <div className="flex flex-col gap-2" ref={parent}>
              {courseData?.packages?.map(
                (pkg) =>
                  pkg.sessionTime === selectedLength && (
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
                        className="flex flex-row justify-between items-center bg-gray-100/80 backdrop-blur-md text-gray-700/90 backdrop-saturate-200 border-gray-100/40 border-2 py-2 px-4 rounded-xl hover:border-purple-300 duration-300 peer-checked:border-purple-600 hover:shadow-gray-900/5 hover:shadow-xl"
                        htmlFor={'package' + pkg.id}
                      >
                        {pkg.discount > 0 && (
                          <span className="absolute text-xs -right-4 -top-2 bg-purple-600 p-1 rounded-full aspect-square flex items-center justify-center text-white font-bold">
                            {' '}
                            -{pkg.discount}%
                          </span>
                        )}
                        <div className="flex sm:flex-row flex-wrap justify-between w-full sm:items-center gap-1">
                          <div>
                            <p className="text-2xl font-bold w-full flex-grow">
                              {pkg.period}{' '}
                              {pkg.period === 1 ? 'month' : 'months'}
                            </p>
                            <p className="text-sm opacity-75">
                              {pkg.sessionsPerWeek}{' '}
                              {pkg.sessionsPerWeek === 1 ? 'time' : 'times'} a
                              week
                            </p>
                            <p className="text-sm opacity-75">
                              {pkg.totalSessions} lessons
                            </p>
                            <p className="text-sm opacity-75">
                              {new Intl.NumberFormat('ko-KR', {
                                style: 'currency',
                                currency: 'KRW',
                              }).format(
                                Math.round(
                                  (pkg.price * (1 - pkg.discount / 100)) /
                                    pkg.totalSessions,
                                ),
                              )}{' '}
                              per lesson
                            </p>
                          </div>
                          {pkg?.discount ? (
                            <div className="flex flex-col items-center">
                              <div className="text-lg opacity-80 font-bold line-through">
                                {new Intl.NumberFormat('ko-KR', {
                                  style: 'currency',
                                  currency: 'KRW',
                                }).format(pkg.price)}
                              </div>
                              <div className="text-2xl font-bold">
                                {new Intl.NumberFormat('ko-KR', {
                                  style: 'currency',
                                  currency: 'KRW',
                                }).format(pkg.price * (1 - pkg.discount / 100))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold">
                              {new Intl.NumberFormat('ko-KR', {
                                style: 'currency',
                                currency: 'KRW',
                              }).format(pkg.price * (1 - pkg.discount / 100))}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ),
              )}
            </div>
            <button
              className="bg-purple-600 cursor-pointer rounded-xl font-bold text-white py-2 max-w-[16rem] justify-center self-end w-full flex flex-row gap-2 items-center hover:brightness-75 duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={selectedPackage === null}
            >
              Proceed to checkout
              <ArrowBack className="brightness-0 invert rotate-180 scale-125" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
