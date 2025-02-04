import { overviewFieldsDic } from '@/shared/constants/global';
import type { Lesson } from '@/types/types.generated';
import { Avatar } from '@/widgets/avatar/avatar';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import StarRatings from 'react-star-ratings';

interface FeedbackInfoProps {
  data: Lesson;
}

const FeedbackInfo: React.FC<FeedbackInfoProps> = ({ data }) => {
  const [t] = useTranslation(['feedback']);
  const isMobile = useMediaQuery({ maxWidth: 420 });

  return (
    <div className="mt-6 p-6 border border-color-dashboard-bg rounded-xl shadow-[0px_0px_16px_0px_#00000014]">
      <section className="flex items-center mb-6 text-color-dark-violet font-bold">
        <div className="w-[48px] h-[48px] rounded-full overflow-hidden mr-3">
          <Avatar avatarUrl={data?.mentor?.avatar?.url ?? undefined} />
        </div>
        {data?.mentor?.firstName} {data?.mentor?.lastName && `${data?.mentor?.lastName[0]}.`}
      </section>

      <section className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">{t('improvement')}</p>
        <p className="text-[15px] text-color-dark-violet">{data?.mentorReview?.improvement}</p>
      </section>

      <section>
        <p className="text-color-light-grey text-sm mb-2">{t('mastered')}</p>
        <p className="text-[15px] text-color-dark-violet">{data?.mentorReview?.mastered}</p>
      </section>

      <section className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">{t('summary_lesson')}</p>
        <p>{data?.topic?.description}</p>
      </section>

      <section className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">{t('vocabulary')}</p>
        <ul className="list-disc pl-6">
          {data?.mentorReview?.vocabularies?.map((w) => (
            <li key={w?.id}>{w?.word}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">{t('homework')}</p>
        <ul className="list-inside">
          {data?.mentorReview?.homeworks?.map((w) => (
            <li key={w?.id}>
              <h6 className="font-semibold">{w?.title}</h6>
              <p>{w?.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">{t('english_skills')}</p>
        <ul className="list-inside">
          {overviewFieldsDic?.map(({ value, label }) => {
            if (data?.mentorReview?.[value]) {
              return (
                <li key={value} className="flex justify-between">
                  <p className="text-color-dark-violet font-semibold text-[15px]">{t(label)}</p>
                  <span className="grow border-b border-dashed" />
                  <p className="text-color-purple first-letter:uppercase">
                    {t(data?.mentorReview?.[value] as string)}
                  </p>
                </li>
              );
            }
            return undefined;
          })}
        </ul>
      </section>

      <section className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">{t('overall_assessment')}</p>
        <div className="border border-color-border-grey p-5 rounded-lg shadow-[0px_0px_8px_0px_#00000014] flex justify-center mb-6">
          <StarRatings
            rating={data?.mentorReview?.rating || 0}
            starEmptyColor="#EDEEF0"
            numberOfStars={5}
            starSpacing={isMobile ? '3px' : '10px'}
            starDimension={isMobile ? '35px' : '40px'}
            starRatedColor="#862EE7"
            svgIconPath="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
          />
        </div>
      </section>
    </div>
  );
};

export default FeedbackInfo;
