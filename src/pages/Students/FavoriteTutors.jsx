import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from 'react-loader-spinner';

import Layout from '../../components/Layout';
import '../../assets/styles/dashboard.scss';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';

import Stars from '../../components/Stars';
import ModalTutorBrief from './ModalTutorBrief';
import { fetchFavoriteTutors } from '../../actions/students';
import FavouriteIcon from '../../components/FavouriteIcon';

const FavoriateTutor = (props) => {
  const { tutor, onSelect, t } = props;
  return (
    <div className="favorite-tutor-card">
      <div className="info">
        <Avatar avatar={tutor.avatar} />
        <div className="detail">
          <p>
            {tutor.first_name} {tutor.last_name}
            <FavouriteIcon isFavourite={true} tutor_id={tutor.id} />
          </p>
          <Stars points={tutor.average_review} />
          <p className="university">{tutor.university}</p>
          <p className="location">{tutor.location}</p>
          <p className="major">{tutor.major}</p>
        </div>
      </div>
      <div className="right">
        <div className="divider" />
        <div className="intro-video">
          <iframe
            className="vimeo"
            width="258"
            height="144"
            src={tutor.video_url}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        <div className="btn" onClick={onSelect}>
          {t('see_profile')}
        </div>
      </div>
    </div>
  );
};

const FavouriteTutors = () => {
  const [t] = useTranslation('translation');
  const [selectedTutor, setSelectedTutor] = useState(false);
  const onDismiss = () => setSelectedTutor(null);

  const favoriteTutors = useSelector((state) => state.students.favoriteTutors);
  const user = useSelector((state) => state.users.user);

  const loading = useSelector((state) => state.students.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.student_profile) {
      dispatch(fetchFavoriteTutors({ student_id: user.student_profile.id }));
    }
  }, [user]);

  return (
    <Layout>
      <div className="favourite-tutors-layout">
        <h4 className="main-title">{t('favorite_tutors')}</h4>
        <div className="divider" />
        <div className="scroll-layout">
          <div className="tutors-wrapper">
            {favoriteTutors &&
              favoriteTutors.map((tutor) => (
                <FavoriateTutor
                  key={tutor.id}
                  tutor={tutor}
                  onSelect={() => setSelectedTutor(tutor)}
                  t={t}
                />
              ))}
          </div>
        </div>
      </div>

      {!!selectedTutor && (
        <ModalTutorBrief
          tutor={selectedTutor}
          visible={selectedTutor}
          onDismiss={onDismiss}
        />
      )}
      {loading && (
        <div className="loading">
          <div className="trans-bg" />
          <Loader
            className="align-center"
            type="Audio"
            color="#00BFFF"
            height={50}
            width={50}
          />
        </div>
      )}
    </Layout>
  );
};

export default FavouriteTutors;
