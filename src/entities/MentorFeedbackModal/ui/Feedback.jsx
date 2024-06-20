import { useMutation, useQuery } from '@apollo/client';
import { GET_VOCABULARY } from 'src/shared/apollo/queries/vocabulary/vocabulary';
import { GET_HOMEWORK } from 'src/shared/apollo/queries/homework/homework';
import { cn } from 'src/shared/utils/functions';
import { FaAngleDown } from 'react-icons/fa6';
import { overviewFields, overviewGrade } from 'src/shared/constants/global';
import { useForm } from 'react-hook-form';
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

function Feedback({
  choosenTopic,
  choosenSection,
  setStep,
  closeModal,
  lessonId,
}) {
  const { user } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 420 });
  const [rating, setRating] = useState(0);

  const [overviews, setOverviews] = useState(
    overviewFields
      .map((o) => o.key)
      .reduce((ac, a) => ({ ...ac, [a]: false }), {}),
  );

  const [createReview, { loading: createLoading }] =
    useMutation(CREATE_MENTOR_REVIEW);

  const { data: vocabData } = useQuery(GET_VOCABULARY, {
    variables: {
      topicId: choosenTopic?.value,
    },
  });

  const { data: homeworkData } = useQuery(GET_HOMEWORK, {
    variables: {
      topicId: choosenTopic?.value,
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const onSubmit = (data) => {
    createReview({
      variables: {
        data: {
          ...data,
          rating,
          topicId: choosenTopic?.value,
          lessonSectionId: choosenSection?.value,
          mentorId: user?.mentor?.id,
          lessonId,
        },
      },
      onCompleted: () => {
        notify('Review created successfully!');
        closeModal();
      },
    });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold">Feedback</h2>

      <section>
        <p className="text-sm text-color-light-grey mb-4">Vocabulary</p>

        <div className="flex gap-2">
          {vocabData?.vocabulary?.map((vocab) => (
            <TagField
              className="bg-[#F7F8FA] rounded-lg font-medium text-color-dark-violet border-none"
              key={vocab.id}
              type="checkbox"
              {...register('vocabularyIds', {
                required: 'Vocabulary is required',
              })}
              value={vocab.id}
              label={vocab.word}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">Homework</p>

        <div className="flex gap-4 flex-col ">
          {homeworkData?.homework?.map((hw, idx) => (
            <CheckboxField
              className="flex-row-reverse w-full justify-between border border-color-border-grey p-4 rounded-lg has-[:checked]:border-color-purple shadow-[0px_0px_8px_0px_#0000000A]"
              key={hw.id}
              square
              type="checkbox"
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
                    Homework {idx + 1}
                  </span>
                </span>
              }
            />
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">
          Overview of English language skills
        </p>

        {overviewFields.map((field) => (
          <div
            key={field.key}
            className="flex gap-2 justify-between pb-3 border-b mt-3 last:border-none"
          >
            <p className="text-color-dark-violet font-semibold">
              {field.label}
            </p>
            <MyDropdownMenu
              open={overviews[field.key]}
              setOpen={(val) => {
                setOverviews((ov) => ({
                  ...ov,
                  [field.key]: val,
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
                      [field.key]: true,
                    }))
                  }
                >
                  <span className="grow text-left text-[15px]">
                    {watch(field.key) ? (
                      <span className="text-color-purple">
                        {watch(field.key)?.toLocaleUpperCase()}
                      </span>
                    ) : (
                      <span className="text-[#C0C0C3]">Select a rating</span>
                    )}
                  </span>
                  <FaAngleDown />
                </button>
              }
            >
              <ul className={cn('overflow-y-auto')}>
                {Object.entries(overviewGrade).map(([key, value]) => (
                  <li
                    key={key}
                    className={cn(
                      'w-[200px] p-4 border-b border-color-border-grey last:border-b-0 overflow-hidden',
                    )}
                  >
                    <CheckboxField
                      className="flex-row-reverse justify-between w-full"
                      type="radio"
                      value={key.toLocaleLowerCase()}
                      label={value}
                      {...register(field.key, {
                        required: `${field.label} overview is required`,
                      })}
                      onClick={() =>
                        setOverviews((ov) => ({
                          ...ov,
                          [field.key]: false,
                        }))
                      }
                    />
                  </li>
                ))}
              </ul>
            </MyDropdownMenu>
          </div>
        ))}
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">
          Overall assesment of class participation
        </p>
        <div className="border border-color-border-grey p-5 rounded-lg shadow-[0px_0px_8px_0px_#00000014] flex justify-center mb-6">
          <StarRatings
            changeRating={(rating) => setRating(rating)}
            rating={rating}
            starHoverColor="#862EE7"
            starEmptyColor="#EDEEF0"
            numberOfStars={5}
            starDimension="40px"
            starSpacing={isMobile ? '6px' : '14px'}
            starRatedColor="#862EE7"
            svgIconPath="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
          />
        </div>
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">
          Opportunity for improvement
        </p>
        <TextareaField
          {...register('improvement', {
            required: 'Opportunity for improvement is required',
          })}
          className="w-full h-[120px] font-inter text-sm font-normal resize-none rounded-none"
        />
      </section>

      <section>
        <p className="text-sm text-color-light-grey mb-4">Area mastered</p>

        <TextareaField
          {...register('mastered', {
            required: 'Area mastered is required',
          })}
          className="w-full h-[120px] font-inter text-sm font-normal resize-none rounded-none"
        />
      </section>

      <section>
        {Object.values(errors)?.map((err) => (
          <span key={err.message} className="block text-red-400">
            {err.message}
          </span>
        ))}
        {!rating && (
          <span className="block text-red-400">
            Overall assesment is required
          </span>
        )}
      </section>

      <section className="flex gap-3">
        <Button
          className="basis-1/2"
          theme="dark_purple"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button
          className="basis-1/2"
          type="submit"
          disabled={Object.values(errors)?.length || !rating || createLoading}
        >
          Submit Feedback
        </Button>
      </section>
    </form>
  );
}

export default Feedback;
