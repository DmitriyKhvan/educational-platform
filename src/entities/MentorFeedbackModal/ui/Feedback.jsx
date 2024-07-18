import { useMutation, useQuery } from '@apollo/client';
import { GET_VOCABULARY } from 'src/shared/apollo/queries/vocabulary/vocabulary';
import { GET_HOMEWORK } from 'src/shared/apollo/queries/homework/homework';
import { cn } from 'src/shared/utils/functions';
import { FaAngleDown } from 'react-icons/fa6';
import {
  overviewFieldsDic,
  overviewGradeDic,
} from 'src/shared/constants/global';
import { Controller, useForm } from 'react-hook-form';
import StarRatings from 'react-star-ratings';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CREATE_MENTOR_REVIEW } from 'src/shared/apollo/mutations/review/createMentorReview';
import notify from 'src/shared/utils/notify';
import { useAuth } from 'src/app/providers/AuthProvider';
import TagField from 'src/components/Form/TagField';
import CheckboxField from 'src/components/Form/CheckboxField';
import MyDropdownMenu from 'src/components/DropdownMenu';
import { TextareaField } from 'src/components/Form/TextareaField';
import Button from 'src/components/Form/Button';
import InputWithError from 'src/components/Form/InputWithError';
import { useTranslation } from 'react-i18next';

function Feedback({
  choosenTopic,
  choosenSection,
  setStep,
  closeModal,
  lessonId,
}) {
  const [t] = useTranslation(['feedback', 'common']);
  const { user } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 420 });

  const [overviews, setOverviews] = useState(
    overviewFieldsDic.reduce((ac, a) => ({ ...ac, [a.key]: false }), {}),
  );

  const [loading, setLoading] = useState(false);

  const [createReview] = useMutation(CREATE_MENTOR_REVIEW);

  const { data: vocabData } = useQuery(GET_VOCABULARY, {
    variables: {
      topicId: choosenTopic?.id,
    },
  });

  const { data: homeworkData } = useQuery(GET_HOMEWORK, {
    variables: {
      topicId: choosenTopic?.id,
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      vocabularyIds: [],
      homeworkIds: [],
      fluency: '',
      pronunciation: '',
      vocabulary: '',
      reading: '',
      confidence: '',
      expressions: '',
      listening: '',
      rating: 0,
      improvement: '',
      mastered: '',
    },
    values: {
      vocabularyIds: vocabData?.vocabulary?.map((vocab) => vocab.id),
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    createReview({
      variables: {
        data: {
          ...data,
          topicId: choosenTopic?.id,
          lessonSectionId: choosenSection?.value,
          mentorId: user?.mentor?.id,
          lessonId,
        },
      },
      onCompleted: () => {
        notify('Review created successfully!');
        closeModal();
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });

    setLoading(false);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold">{t('lesson_feedback')}</h2>

      <section>
        <p className="text-sm text-color-light-grey mb-4">
          {t('summary_lesson')}
        </p>

        <TextareaField
          className="w-full h-[120px]"
          readOnly
          value={choosenTopic?.description}
        ></TextareaField>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">{t('vocabulary')}</p>

        <InputWithError errorsField={errors?.vocabularyIds}>
          <div className="flex gap-2">
            {vocabData?.vocabulary?.map((vocab) => (
              <TagField
                className="bg-[#F7F8FA] rounded-lg font-medium text-color-dark-violet border-none"
                key={vocab.id}
                type="checkbox"
                {...register(
                  'vocabularyIds',
                  //   {
                  //   required: 'Vocabulary is required',
                  // }
                )}
                disabled
                value={vocab.id}
                label={vocab.word}
              />
            ))}
          </div>
        </InputWithError>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">{t('homework')}</p>

        <InputWithError errorsField={errors?.homeworkIds}>
          <div className="flex gap-4 flex-col ">
            {homeworkData?.homework?.map((hw, idx) => (
              <CheckboxField
                key={hw.id}
                className="flex-row-reverse w-full justify-between border border-color-border-grey p-4 rounded-lg has-[:checked]:border-color-purple shadow-[0px_0px_8px_0px_#0000000A]"
                square
                type="radio"
                {...register('homeworkIds', {
                  required: 'Homework is required',
                })}
                value={hw.id}
                label={
                  <span className="block">
                    <span className="block font-semibold text-base mb-3">
                      {hw.title}
                    </span>
                    <span className="bg-color-purple text-[13px] bg-opacity-10 rounded-md px-3 py-[6px] text-color-purple">
                      {t('homework')} {idx + 1}
                    </span>
                  </span>
                }
              />
            ))}
          </div>
        </InputWithError>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">
          {t('english_skills')}
        </p>

        {overviewFieldsDic.map((field) => (
          <div
            key={field.value}
            className="pb-3 border-b mt-3 last:border-none"
          >
            <InputWithError errorsField={errors?.[field.value]}>
              <div className="flex gap-2 justify-between">
                <p className="text-color-dark-violet font-semibold">
                  {t(field.label)}
                </p>
                <MyDropdownMenu
                  open={overviews[field.value]}
                  setOpen={(val) => {
                    setOverviews((ov) => ({
                      ...ov,
                      [field.value]: val,
                    }));
                  }}
                  align="end"
                  button={
                    <button
                      type="button"
                      className="flex items-center gap-3"
                      onClick={() =>
                        setOverviews((ov) => ({
                          ...ov,
                          [field.value]: true,
                        }))
                      }
                    >
                      <span className="grow text-left text-[15px]">
                        {watch(field.value) ? (
                          <span className="text-color-purple font-medium">
                            {
                              overviewGradeDic.find(
                                (item) => item.value === watch(field.value),
                              ).label
                            }
                          </span>
                        ) : (
                          <span className="text-[#C0C0C3]">
                            Select a rating
                          </span>
                        )}
                      </span>
                      <FaAngleDown />
                    </button>
                  }
                >
                  <ul className={cn('overflow-y-auto')}>
                    {overviewGradeDic.map(({ label, value }) => (
                      <li
                        key={value}
                        className={cn(
                          'w-[200px] border-b border-color-border-grey last:border-b-0',
                        )}
                      >
                        <CheckboxField
                          className="flex-row-reverse justify-between w-full p-4"
                          type="radio"
                          value={value}
                          label={t(label)}
                          {...register(field.value, {
                            required: `${field.label} overview is required`,
                          })}
                          onClick={() =>
                            setOverviews((ov) => ({
                              ...ov,
                              [field.value]: false,
                            }))
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </MyDropdownMenu>
              </div>
            </InputWithError>
          </div>
        ))}
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">
          {t('overall_assessment')}
        </p>
        <InputWithError errorsField={errors?.rating}>
          <div className="border border-color-border-grey p-5 rounded-lg shadow-[0px_0px_8px_0px_#00000014] flex justify-center">
            <Controller
              control={control}
              rules={{
                required: 'Rating is required',
              }}
              name="rating"
              render={({ field: { value, onChange } }) => (
                <StarRatings
                  changeRating={(rating) => onChange(rating)}
                  rating={value}
                  starHoverColor="#862EE7"
                  starEmptyColor="#EDEEF0"
                  numberOfStars={5}
                  starDimension="40px"
                  starSpacing={isMobile ? '6px' : '14px'}
                  starRatedColor="#862EE7"
                  svgIconPath="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
                />
              )}
            />
          </div>
        </InputWithError>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">{t('improvement')}</p>
        <InputWithError errorsField={errors?.improvement}>
          <TextareaField
            {...register('improvement', {
              required: 'Opportunity for improvement is required',
              minLength: {
                message: 'Text is too short',
                value: 280,
              },
              maxLength: {
                message: 'Text is too long',
                value: 5000,
              },
            })}
            className="w-full h-[120px]"
          />
        </InputWithError>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">{t('mastered')}</p>

        <InputWithError errorsField={errors?.mastered}>
          <TextareaField
            {...register('mastered', {
              required: 'Area mastered is required',
              minLength: {
                message: 'Text is too short',
                value: 280,
              },
              maxLength: {
                message: 'Text is too long',
                value: 5000,
              },
            })}
            className="w-full h-[120px] resize-none"
          />
        </InputWithError>
      </section>

      <section className="flex gap-3">
        <Button
          className="basis-1/2"
          theme="dark_purple"
          onClick={() => setStep(1)}
        >
          {t('back', { ns: 'common' })}
        </Button>
        <Button
          className="basis-1/2"
          type="submit"
          disabled={!isValid || loading}
        >
          {t('submit', { ns: 'common' })}
        </Button>
      </section>
    </form>
  );
}

export default Feedback;
