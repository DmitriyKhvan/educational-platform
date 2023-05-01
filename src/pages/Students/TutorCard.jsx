import '../../assets/styles/tutor.scss';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';
import ImgSelected from '../../assets/images/checked_sm.svg';
import Vimeo from '@u-wave/react-vimeo';
import Stars from '../../components/Stars';
import { getAbbrName, getAvatarName } from '../../constants/global';
import FavouriteIcon from '../../components/FavouriteIcon';

const TutorCard = ({
  tutor,
  onCreateAppointment,
  selected,
  onSelect,
  onShowTutorBrief,
}) => {
  const [t, i18n] = useTranslation('translation');
  return (
    <div className={`tutor-card ${selected ? 'selected' : ''}`}>
      <div>
        <div>
          <div className="basic-info">
            <Avatar
              avatar={tutor.avatar}
              name={getAvatarName(tutor.first_name, tutor.last_name)}
            />
            <div className="name-stars">
              <p>{getAbbrName(tutor.first_name, tutor.last_name)}</p>
              <Stars points={tutor.review} />
            </div>
            <FavouriteIcon isFavourite={tutor.favorite} tutor_id={tutor.id} />
          </div>
          <p className="university">{tutor.university}</p>
          {/* <p className="location">{tutor.location}</p> */}
          <p className="major">{tutor.major}</p>
          <p className="acceptance-rate">
            {t('acceptanceRate')} {tutor.acceptance_rate}%
          </p>
        </div>
        <div>
          <div>
            {tutor.video_url ? (
              <Vimeo video={tutor.video_url} width={187} height={105} />
            ) : (
              <iframe
                className="vimeo"
                width="187"
                height="105"
                src={''}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            )}
          </div>
          <div>
            <div className="btn" onClick={onSelect}>
              {selected ? t('tutor_selected') : t('select_tutor')}
            </div>
            <div className="btn outlined" onClick={onShowTutorBrief}>
              {t('see_profile')}
            </div>
            {selected && <img src={ImgSelected} alt="" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
