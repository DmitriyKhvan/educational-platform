import React from 'react';
import { useTranslation } from 'react-i18next';
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png';
import Loader from '../common/Loader';

const ReschedulingTutorModal = ({
  setTabIndex,
  tutors,
  setSelectTutor,
  isLoading,
}) => {
  const [t] = useTranslation();
  const onClick = (tutor) => {
    setSelectTutor(tutor);
    setTabIndex(4);
  };
  const SelectTutors = ({ tutor }) => {
    const name = tutor.first_name + ' ' + tutor.last_name.charAt(0) + '.';

    return (
      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 pe-3 mb-3">
        <div className="text-center mb-1">
          <img
            src={
              tutor.avatar
                ? tutor.avatar
                : tutor.gender === 'female'
                ? femaleAvatar
                : maleAvatar
            }
            className="img-fluid"
            alt=""
          />
        </div>
        <div className="text-center">
          <div className="row">
            <h4 className="text-purple justify-content-center">{name}</h4>
          </div>

          <div className="row">
            <h5 className="text-light-grey justify-content-center">
              <strong>{tutor.university}</strong>
            </h5>
          </div>

          <div className="row">
            <h5 className="text-light-grey justify-content-center">
              {tutor.major || '-'}
            </h5>
          </div>

          <div className="row px-4 mx-1">
            <button
              className="bg-color-purple text-white btn"
              onClick={() => onClick(tutor)}
            >
              {t('select_tutor')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '65vw' }}>
      <h2 className="mt-0">{t('select_a_tutor')}</h2>
      <p className="welcome-subtitle mt-[30px] mb-2">
        {t('select_a_tutor_subtitle')}
      </p>
      <div className="row">
        <div className="col">
          <button
            className="enter-btn btn-dash-return px-4"
            onClick={() => setTabIndex(2)}
          >
            {t('back')}
          </button>
        </div>
      </div>
      <div className="row mt-2 ps-2 modal-scroll">
        {tutors
          .sort((a, b) =>
            a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1,
          )
          .map((x, i) => (
            <SelectTutors tutor={x} key={i} />
          ))}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ReschedulingTutorModal;
