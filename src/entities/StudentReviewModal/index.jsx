import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import StarRatings from 'react-star-ratings';
import { REVIEW_TAGS_BY_TYPE } from 'src/shared/apollo/queries/review/reviewTagsByType';
import { CREATE_REVIEW } from 'src/shared/apollo/mutations/review/createReview';
import notify from 'src/shared/utils/notify';
import TagField from 'src/components/Form/TagField';
import Button from 'src/components/Form/Button';

const ratingTypes = [null, 'bad', 'bad', 'neutral', 'neutral', 'good'];

const StudentReviewModal = ({ studentId, lessonId, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [ratingType, setRatingType] = useState(null);
  const [tagsIds, setTagsIds] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 420 });

  const [getTags, { data, loading }] = useLazyQuery(REVIEW_TAGS_BY_TYPE);
  const [createReview, { loading: createLoading }] = useMutation(CREATE_REVIEW);

  useEffect(() => {
    setRatingType(ratingTypes[rating]);
  }, [rating]);

  useEffect(() => {
    if (ratingType) {
      getTags({ variables: { type: ratingType } });
      setTagsIds([]);
    }
  }, [ratingType]);

  const tagsLabel =
    ratingType === 'bad'
      ? 'What did you not like?'
      : ratingType === 'neutral'
        ? 'How can we improve?'
        : 'What did you love?';

  const onSubmit = () => {
    createReview({
      variables: {
        lessonId,
        studentId,
        tags: tagsIds,
        rating,
      },
      onCompleted: () => {
        notify('Review sent successfully!');
        closeModal();
      },
    });
  };

  return (
    <div className="mx-auto sm:w-[400px]">
      <h2 className="font-bold text-2xl text-color-dark-violet mb-6 md:text-2xl">
        Lesson Review
      </h2>

      <p className="text-color-light-grey text-[13px] mb-4 md:text-[14px]">
        Please submit your rating
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

      {ratingType && (
        <section>
          <p className="text-color-light-grey text-[13px] md:text-[14px] mb-4">
            {tagsLabel}
          </p>
          <div className="flex gap-2 flex-wrap">
            {data?.studentReviewTagsByType?.map((tag) => (
              <TagField
                key={tag.id}
                type="checkbox"
                name="reviewTag"
                label={tag.title}
                onChange={() =>
                  setTagsIds((val) =>
                    val.includes(tag.id)
                      ? val.filter((v) => v !== tag.id)
                      : [...val, tag.id],
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      <Button
        className="w-full mt-10"
        disabled={!ratingType || !tagsIds.length || createLoading || loading}
        onClick={() => onSubmit()}
      >
        Submit
      </Button>
    </div>
  );
};

export default StudentReviewModal;
