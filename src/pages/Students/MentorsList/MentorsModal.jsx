import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Avatar } from '../../../widgets/Avatar/Avatar';
import Button from '../../../components/Form/Button/Button';
import StarRatings from 'react-star-ratings';
import { useMediaQuery } from 'react-responsive';
// import { EmblaCarousel } from 'src/components/Carousel';

const MentorsModal = ({ mentor }) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const [t] = useTranslation(['common', 'profile']);

  // const SLIDE_COUNT = 5;
  // const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div className="flex flex-col gap-8 w-full sm:w-[calc(100vw-120px)] max-w-[880px] sm:h-full sm:min-h-[415px]">
      <div className="flex flex-col-reverse sm:flex-row bg-white gap-10">
        <div className="w-full sm:w-7/12 lg:w-2/3 break-word hyphens-auto">
          <h1 className="mb-3 text-[22px] md:text-[28px] leading-[34px] tracking-[-1px] text-color-dark-purple font-bold">{`${
            mentor?.fullName || mentor?.user?.fullName
          }`}</h1>

          <div className="flex items-end gap-3">
            <StarRatings
              rating={5}
              starDimension="20px"
              starSpacing="2px"
              starRatedColor="#862EE7"
              svgIconPath="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
            />
            {/* <span className="text-sm text-gray-400">(24 reviews)</span> */}
          </div>

          <div className="flex flex-col gap-8 mt-6">
            {!isMobile && (
              <Link
                to={
                  mentor?.availabilities?.length > 0
                    ? {
                        pathname: `/student/schedule-lesson/select`,
                        state: {
                          tutor: {
                            ...mentor,
                          },
                        },
                      }
                    : '#'
                }
              >
                <Button
                  theme="purple"
                  className="px-[48px] h-[50px]"
                  disabled={mentor?.availabilities?.length === 0}
                >
                  {t('schedule')}
                </Button>
              </Link>
            )}

            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="font-medium text-gray-300 text-[13px] leading-[15px] tracking-[-0.2px]">
                  {t('university', { ns: 'profile' })}
                </h3>
                <p className="mt-2 font-medium text-color-dark-purple text-[15px] leading-[24px] tracking-[-0.2px]">
                  {mentor?.university}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-300 text-[13px] leading-[15px] tracking-[-0.2px]">
                  {t('university_degree', { ns: 'profile' })} /{' '}
                  {t('university_major', { ns: 'profile' })}
                </h3>
                <p className="mt-2 font-medium text-color-dark-purple text-[15px] leading-[24px] tracking-[-0.2px]">
                  {mentor?.degree} {mentor?.major ? '/ ' + mentor?.major : null}
                </p>
              </div>
            </div>
          </div>
        </div>
        {mentor?.videoUrl ? (
          <iframe
            className="w-full sm:w-5/12 lg:w-1/3 max-h-[220px]"
            src={mentor?.videoUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 0 }}
          ></iframe>
        ) : (
          <div className="w-full sm:w-5/12 lg:w-1/3 h-[185px] sm:h-auto max-h-[220px] rounded-lg overflow-hidden">
            <Avatar
              avatarUrl={mentor?.avatar?.url}
              gender={mentor?.gender}
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {mentor?.uniqueFacts && (
          <div>
            <h3 className="font-medium text-gray-300 text-[13px] leading-[15px] tracking-[-0.2px] mb-2">
              {t('bio_facts_label', { ns: 'profile' })}
            </h3>
            <p className="font-medium text-color-dark-purple text-[15px] leading-[21px] tracking-[-0.6px]">
              {mentor?.uniqueFacts}
            </p>
          </div>
        )}

        {mentor?.introduction && (
          <div>
            <h3 className="font-medium text-gray-300 text-[13px] leading-[15px] tracking-[-0.2px] mb-2">
              {t('biography', { ns: 'profile' })}
            </h3>
            <p className="font-medium text-color-dark-purple text-[15px] leading-[24px] tracking-[-0.2px]">
              {mentor?.introduction}
            </p>
          </div>
        )}

        {mentor?.relevantExperience && (
          <div>
            <h3 className="font-medium text-gray-300 text-[13px] leading-[15px] tracking-[-0.2px] mb-2">
              {t('bio_experience_label', { ns: 'profile' })}
            </h3>
            <p className="font-medium text-color-dark-purple text-[15px] leading-[21px] tracking-[-0.6px]">
              {mentor?.relevantExperience}
            </p>
          </div>
        )}

        {/* <div>
          <h3 className="font-medium text-gray-300 text-[13px] leading-[15px] tracking-[-0.2px] mb-2">
            Reviews
          </h3>
          <EmblaCarousel
            slides={SLIDES}
            // options={{ align: 'start', loop: true }}
            options={{ align: 'start' }}
          />
        </div> */}
      </div>

      {isMobile && (
        <div className="sticky -bottom-6 w-full pb-6 bg-white z-10">
          <Link
            to={
              mentor?.availabilities?.length > 0
                ? {
                    pathname: `/student/schedule-lesson/select`,
                    state: {
                      tutor: {
                        ...mentor,
                      },
                    },
                  }
                : '#'
            }
          >
            <Button
              theme="purple"
              className="w-full px-[48px] h-[50px]"
              disabled={mentor?.availabilities?.length === 0}
            >
              {t('schedule')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MentorsModal;
