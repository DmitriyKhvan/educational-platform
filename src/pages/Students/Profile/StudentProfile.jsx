import React from 'react';
import '../../../assets/styles/student.scss';
import './style/StudentProfile.scss';
import './style/GeneralProfile.scss';
import { useAuth } from '../../../modules/auth';
import { useMutation } from '@apollo/client';
import {
  MUTATION_UPDATE_STUDENT,
} from '../../../modules/auth/graphql';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png';
import { getPlanStatus } from '../../../actions/subscription';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StudentProfile = () => {
  const [t] = useTranslation(['profile', 'common', 'lessons']);

  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);
  const [summary, setSummary] = React.useState(false);
  const [about, setAbout] = React.useState('');
  const [save, setSave] = React.useState(false);
  const notify = () => toast('Summary information is changed!');
  const planStatus = useSelector((state) => state.students.planStatus);
  const [profileImage, setProfileImage] = React.useState('');
  const dispatch = useDispatch();
  const navigate = useHistory();

  const actions = useAuth();
  const avatar = actions?.user?.student?.avatar?.url;

  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar);
    } else if (actions.user?.gender === 'female') {
      setProfileImage(femaleAvatar);
    } else if (actions.user?.gender === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [actions, avatar]);

  const saveSummary = async () => {
    if (about !== '') {
      const { data } = await updateStudent({
        variables: {
          data: {
            about: about,
          },
          where: {
            id: parseInt(actions?.user?.student?.id),
          },
        },
      });

      if (data) {
        setSave(false);
        setSummary(false);
        setAbout('');
        notify();
      }

      await actions.refetchUser();
    }
  };

  const cancelSummary = () => {
    setSummary(false);
    setSave(false);
    setAbout('');
  };

  const editSummary = () => {
    setSummary(true);
    setSave(true);
  };

  React.useEffect(() => {
    dispatch(getPlanStatus());
  }, [dispatch]);

  const defaultAbout = actions?.user?.student?.about;

  return (
    <div>
      <div className="main-dashboard scroll-layout">
        <div className="flex-container">
          <div className="flex-left children-wrapper flex-change ">
            <div className="profile_section">
              <div className="profile_banner">
                <div className="profile_banner-top">
                  <img
                    style={{ objectPosition: 'top' }}
                    src={profileImage}
                    alt=""
                  />
                </div>
                <div className="profile_banner-bottom">
                  <div className="profile_main-info">
                    <div className="main_info-left">
                      <h2>
                        {actions.user?.firstName + ' '}
                        {actions.user?.lastName}
                      </h2>
                      {/* <p>
                        {t('student_level', {
                          level: 3,
                        })}
                      </p> */}
                      <span>
                        {actions.user?.timeZone
                          ? actions.user?.timeZone
                          : 'PST (GMT-8)'}
                      </span>
                    </div>
                    <div className="main_info-right">
                      <button
                        onClick={() => {
                          navigate.push('/student/profiles/edit-information');
                        }}
                      >
                        {t('edit_profile')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit_summary">
                <header>
                  <h2>{t('summary')}</h2>
                  {save ? (
                    <div>
                      <button onClick={saveSummary}>
                        {t('save', { ns: 'common' })}
                      </button>
                      <button onClick={cancelSummary}>
                        {t('cancel', { ns: 'common' })}
                      </button>
                    </div>
                  ) : (
                    <button onClick={editSummary}>
                      {t('edit', { ns: 'common' })}
                    </button>
                  )}
                </header>

                {summary ? (
                  <textarea
                    onChange={(e) => setAbout(e.target.value)}
                    className="edit_summary_textarea"
                    defaultValue={!defaultAbout ? about : defaultAbout}
                  ></textarea>
                ) : !defaultAbout ? (
                  <React.Fragment>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Maecenas pharetra eu leo a dignissim. Nunc et maximus
                      urna.
                    </p>

                    <p>
                      Vestibulum sed leo ultrices, hendrerit tortor et,
                      efficitur quam. Phasellus purus purus, sollicitudin et
                      pulvinar vel, vehicula ac dolor
                    </p>
                  </React.Fragment>
                ) : (
                  <p>{defaultAbout}</p>
                )}
              </div>
              <div className="enrolled_course">
                <h2>{t('enrolled_courses')}</h2>
                {planStatus &&
                  planStatus.map((item) => (
                    <div key={item.id} className="enrolled_col">
                      <div className="course_card">
                        <h3>{item.lesson_type}</h3>
                        <button className="lesson_button">
                          {t('lesson_type')}
                        </button>
                        <button className="time_button">
                          {item.duration} {t('minutes', { ns: 'common' })}
                        </button>
                        <button className="remaining_button">
                          {t('lessons_remaining', {
                            ns: 'lessons',
                            count: item.total_lessons,
                          })}
                        </button>
                      </div>
                    </div>
                  ))}

                {planStatus?.length === 0 && (
                  <p>{t('no_lessons', { ns: 'lessons' })}</p>
                )}
              </div>
            </div>
          </div>
          <div className="student-list-appointments-wrapper flex-right changes-container">
            <div className="details">
              <h2>{t('add_details')}</h2>
              <div className="details_col">
                <div className="details_list">
                  <h4>{t('email')}</h4>
                  <p>{actions.user?.email}</p>
                </div>

                {actions.user?.koreanEquivalent && (
                  <div className="details_list">
                    <h4>{t('korean_name')}</h4>
                    <p>{actions.user?.koreanEquivalent}</p>
                  </div>
                )}

                {actions.user?.gender && (
                  <div className="details_list">
                    <h4>{t('gender')}</h4>
                    <p>{actions.user?.gender}</p>
                  </div>
                )}

                {actions.user?.country && (
                  <div className="details_list">
                    <h4>{t('country', { ns: 'common' })}</h4>
                    <p>
                      {actions.user?.country ? actions.user?.country : 'Korea'}
                    </p>
                  </div>
                )}

                {actions?.user?.address && (
                  <div className="details_list">
                    <h4>{t('address', { ns: 'common' })}</h4>
                    <p>{actions.user?.address}</p>
                  </div>
                )}

                {actions?.user?.phoneNumber && (
                  <div className="details_list">
                    <h4>{t('phone_number', { ns: 'common' })}</h4>
                    <p>{actions.user?.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentProfile;
