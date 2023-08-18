import { useState } from 'react';
import Vimeo from '@u-wave/react-vimeo';
import Modal from '../../components/Modal';
import '../../assets/styles/student.scss';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';
import Stars from '../../components/Stars';
import FavouriteIcon from '../../components/FavouriteIcon';
import { getAbbrName } from '../../constants/global';

const ModalTutorBrief = ({ visible, tutor, onSelect, onDismiss }) => {
  const [t] = useTranslation('translation');
  const [expand, setExpand] = useState(false);

  return (
    <Modal
      className={`tutor-detail-wrapper ${expand ? 'expanded' : 'collapsed'}`}
      visible={visible}
      onCancel={onDismiss}
    >
      {!expand ? (
        <div className="brief">
          <div className="info">
            <div>
              <Avatar avatar={tutor.avatar} />
              <div className="basic">
                <p>
                  {getAbbrName(tutor.first_name, tutor.last_name)}
                  <FavouriteIcon
                    isFavourite={tutor.favorite}
                    tutor_id={tutor.id}
                  />
                </p>
                <Stars points={tutor.average_review} />
                <p className="acceptance-rate">
                  {t('acceptanceRate')} {tutor.acceptance_rate}%
                </p>
              </div>
              <span className="divider" />
              <div className="advanced">
                <p className="university">{tutor.university}</p>
                <p className="location">{tutor.location}</p>
                <p className="major">{tutor.major}</p>
              </div>
            </div>
            <div>
              <div className="btn outlined" onClick={() => setExpand(true)}>
                {t('see_profile')}
              </div>
              {onSelect && (
                <div
                  className="btn"
                  onClick={() => {
                    onDismiss();
                    onSelect();
                  }}
                >
                  {t('select_tutor')}
                </div>
              )}
            </div>
          </div>
          {tutor.video_url ? (
            <Vimeo video={tutor.video_url} width={1032} height={582} />
          ) : (
            <iframe
              className="vimeo"
              width="1032"
              height="582"
              src={''}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
        </div>
      ) : (
        <div className="expand">
          <div className="title">{t('tutor_profile')}</div>
          <div className="profile-content">
            <Avatar avatar={tutor.avatar} />
            <div className="info">
              <p>
                {getAbbrName(tutor.first_name, tutor.last_name)}
                <FavouriteIcon
                  isFavourite={tutor.favorite}
                  tutor_id={tutor.id}
                />
              </p>
              <Stars points={tutor.points} />
              <p className="university">{tutor.university}</p>
              <p className="location">{tutor.location}</p>
              <p className="major">{tutor.major}</p>
              <p className="acceptance-rate">
                {t('acceptanceRate')} {tutor.acceptanceRate}%
              </p>
              {onSelect && (
                <div
                  className="btn"
                  onClick={() => {
                    onDismiss();
                    onSelect();
                  }}
                >
                  {t('select_tutor')}
                </div>
              )}
            </div>
            <span className="divider" />
            <div className="reviews">
              <p className="sub-title">
                {t('tutor_reviews_n', { n: tutor.reviews?.length })}
              </p>
              <div className="wrapper">
                {tutor.reviews?.map((review, ind) => (
                  <div className="review" key={`review-${ind}`}>
                    <div className="text">{review.review}</div>
                    <div className="provider">
                      <Stars points={review.points} />
                      <div className="provider-info">
                        <Avatar avatar={review.avatar} />
                        <p className="name">{review.from}</p>
                        <div className="divider" />
                        <p className="date">
                          {review.provided_at.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="sub-title">{t('tutor_self_introduction')}</p>
          <div className="separator" />
          {tutor.video_url ? (
            <Vimeo video={tutor.video_url} width={1032} height={582} />
          ) : (
            <iframe
              className="vimeo"
              width="1032"
              height="582"
              src={''}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ModalTutorBrief;
