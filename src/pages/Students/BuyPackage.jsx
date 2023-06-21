import React, { useEffect, useState } from 'react';
import { ReactComponent as ArrowBack } from '../../assets/images/arrow_back.svg';
import Loader from '../../components/Loader/Loader';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useHistory, useParams } from 'react-router-dom';

const getPricing = async () => {
  const data = new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: 2,
          name: 'Private English',
          coverImage: 'https://dev.naonow.com/cad124f3c9d1255e33ca.png',
          description:
            'Learn the foundations of the English language. Speaking, Reading, and Writing skills developed with your mentor while learning about meaningful cultural topics designed to help students immerse themselves and “think” in English.',
          types: [
            {
              id: 1,
              name: '1 Lesson per week',
              lessons_per_week: 1,
              weeks: 4,
              price: 50000,
              length: 25,
            },
            {
              id: 2,
              name: '2 Lessons per week',
              lessons_per_week: 2,
              weeks: 4,
              price: 90000,
              length: 25,
            },
            {
              id: 4,
              name: '2 Lessons per week',
              lessons_per_week: 2,
              weeks: 4,
              price: 90000,
              length: 25,
            },
            {
              id: 5,
              name: '2 Lessons per week',
              lessons_per_week: 2,
              weeks: 4,
              price: 90000,
              length: 25,
            },
            {
              id: 6,
              name: '2 Lessons per week',
              lessons_per_week: 2,
              weeks: 4,
              price: 90000,
              length: 25,
            },
            {
              id: 3,
              name: '3 Lessons per week',
              lessons_per_week: 3,
              weeks: 4,
              price: 120000,
              length: 50,
            },
          ],
        }),
      500,
    ),
  );
  return data;
};

export default function BuyPackage() {
  const [lessonPackage, setLessonPackage] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [uniqueLength, setUniqueLength] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const [parent] = useAutoAnimate({
    duration: 450,
    easing: 'ease-in-out',
  });

  const history = useHistory();
  const { packageId } = useParams();

  useEffect(() => {
    getPricing().then((data) => {
      setLessonPackage(data);
      setSelectedLength(data?.types[0]?.length);
      setUniqueLength([
        ...new Set(data?.types?.map((item) => item.length) ?? []),
      ]);
    });
  }, []);

  const handleSubmit = async (e) => {
    if (selectedType) {
      e.preventDefault();
      const response = await fetch(`http://localhost:3000/secret`);
      const data = await response.json();

      if (response?.ok) {
        history.replace(`${packageId}/payment/${data.client_secret}`);
      }
    }
  };

  if (!lessonPackage) return <Loader />;

  return (
    <main className="bg-[url(https://dev.naonow.com/img/20210605-NAONOW-FINAL-2%202.png)] bg-cover min-h-screen flex flex-col justify-center items-center p-4 transition-all duration-300">
      <div
        className="bg-gray-200/90 backdrop-blur-md backdrop-saturate-200 border-gray-100/40 border p-4 rounded-xl max-w-5xl w-full cool-shadow flex flex-col gap-8 md:gap-6 md:flex-row bg-center transition-transform duration-300"
        ref={parent}
      >
        <div
          className={`rounded-lg bg-cover aspect-square w-full h-full p-3 flex flex-col justify-between`}
          style={{
            background: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)),url(${lessonPackage?.coverImage})`,
          }}
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text drop-shadow-2xl bg-white">
            {lessonPackage.name}
          </h1>
          <p className="text-gray-300 bg-gray-900/80 rounded-md p-2 text-sm max-w-4xl mt-auto">
            {lessonPackage.description}
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
                  id={length}
                  name="duration"
                  value={length}
                  defaultChecked={length === selectedLength}
                  className="hidden peer"
                  onChange={(e) => {
                    setSelectedLength(parseInt(e.currentTarget.value));
                  }}
                />
                <label
                  className="flex flex-row justify-between items-center bg-gray-100/80 backdrop-blur-md text-gray-700/90 backdrop-saturate-200 border-gray-100/40 border-2 py-2 px-4 rounded-xl hover:border-purple-300 duration-300 peer-checked:border-purple-600 hover:shadow-gray-900/5 hover:shadow-xl"
                  htmlFor={length}
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
            {lessonPackage?.types?.map(
              (lessonPackageType) =>
                lessonPackageType.length === selectedLength && (
                  <div key={lessonPackageType.id}>
                    <input
                      type="radio"
                      id={lessonPackageType.id}
                      name="package"
                      value={lessonPackageType.id}
                      onChange={() => setSelectedType(lessonPackageType)}
                      className="hidden peer"
                    />
                    <label
                      className="flex flex-row justify-between items-center bg-gray-100/80 backdrop-blur-md text-gray-700/90 backdrop-saturate-200 border-gray-100/40 border-2 py-2 px-4 rounded-xl hover:border-purple-300 duration-300 peer-checked:border-purple-600 hover:shadow-gray-900/5 hover:shadow-xl"
                      htmlFor={lessonPackageType.id}
                    >
                      <div className="flex flex-col sm:flex-row flex-wrap justify-between w-full sm:items-center gap-1">
                        <div className="w-full">
                          <p className="text-lg font-bold w-full flex-grow">
                            {lessonPackageType.name}
                          </p>
                          <p className="text-sm opacity-75">
                            Total:{' '}
                            {new Intl.NumberFormat('ko-KR', {
                              style: 'currency',
                              currency: 'KRW',
                            }).format(lessonPackageType.price)}
                          </p>
                        </div>
                        <div className="flex flex-row gap-1 leading-7 justify-end items-end">
                          <span className="text-2xl font-bold">
                            {new Intl.NumberFormat('ko-KR', {
                              style: 'currency',
                              currency: 'KRW',
                            }).format(
                              Math.round(
                                lessonPackageType.price /
                                  lessonPackageType.lessons_per_week,
                              ),
                            )}
                          </span>
                          / <span>Lesson</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ),
            )}
          </div>
          <button className="bg-purple-600 cursor-pointer rounded-xl font-bold text-white py-2 max-w-[16rem] justify-center self-end w-full flex flex-row gap-2 items-center hover:brightness-75 duration-200">
            Proceed to checkout
            <ArrowBack className="brightness-0 invert rotate-180 scale-125" />
          </button>
        </form>
      </div>
    </main>
  );
}
