import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import '../../assets/styles/student.scss';
import { Checkbox } from '../../components/Checkbox';

import { useTranslation } from 'react-i18next';

import { renderFormField } from '../../components/Global';
import { Avatar } from '../../components/Avatar';
import Stars from '../../components/Stars';
import ImgStarOutline from '../../assets/images/star_outline.svg';
import ImgStarFill from '../../assets/images/star_fill.svg';
import FavouriteIcon from '../../components/FavouriteIcon';
import { getAbbrName } from '../../constants/global';

const tutor_attendance = [
  { label: 'Tutor was on time', value: 'in_time' },
  { label: 'Tutor was late', value: 'late' },
  { label: 'No show', value: 'not_show' },
];

const ModalFeedback = ({ visible, onDismiss, appointment }) => {
  const [t] = useTranslation('translation');
  const [starIndex, setStarIndex] = useState(-1);
  const [attendance, setAttendance] = useState(null);

  const [tutorReviewData, setTutorReviewData] = useState();
  const [formData, setFormData] = useState({
    review: '',
  });
  const [formDataError] = useState({
    review: '',
  });
  const handleChange = (option) => {
    setFormData({ review: option });
  };

  const { mentor } = appointment;

  useEffect(() => {
    // replace with proper review graphql query later
  }, [mentor, setTutorReviewData]);

  const onSubmit = async () => {
    // replace with proper review graphql query later
    onDismiss();
  };

  return (
    <Modal
      className="modal-write-review"
      visible={visible}
      onCancel={onDismiss}
    >
      <p className="title">{t('after_lesson')}</p>
      <div className="tutor-info">
        <div>
          <Avatar avatar={mentor?.user?.avatar} />
          <div className="basic-info">
            <div className="name-heart">
              <p>{getAbbrName(mentor.first_name, mentor.last_name)}</p>
              <FavouriteIcon
                isFavourite={mentor.favorite}
                tutor_id={mentor.id}
              />
            </div>
            <div className="ratings">
              <Stars points={tutorReviewData?.average_review} />
              <span>({t('overall_ratings')})</span>
            </div>
            <p className="major">{mentor.major}</p>
          </div>
        </div>
        <div className="btn outlined">{t('see_profile')}</div>
      </div>
      <p className="description">{t('fill_items_below')}</p>

      <p className="p-write-review">1) {t('tutor_attendnace')}</p>
      <div className="feedback-content">
        {tutor_attendance.map((opt, idx) => (
          <Checkbox
            key={`checkbox-${idx}`}
            label={tutor_attendance[idx].label}
            checked={attendance === tutor_attendance[idx].value}
            onChange={() => setAttendance(tutor_attendance[idx].value)}
          />
        ))}
      </div>

      <p className="p-write-review">{t('rate_tutor')}</p>
      <div className="feedback-content">
        <div className="stars">
          {[0, 1, 2, 3, 4].map((value, index) => (
            <img
              key={`img-${index}`}
              src={starIndex >= index ? ImgStarFill : ImgStarOutline}
              alt=""
              onClick={() => setStarIndex(index)}
            />
          ))}
        </div>
      </div>

      <p className="p-write-review">3) {t('write_tutor_review')}</p>
      <div className="feedback-content">
        {renderFormField(
          'review',
          t(''),
          handleChange,
          formData,
          formDataError,
          'textfield',
          t('your_review_goes_here'),
        )}
      </div>

      <div className="btn" onClick={onSubmit}>
        {t('submit')}
      </div>
    </Modal>
  );
};

export default ModalFeedback;
