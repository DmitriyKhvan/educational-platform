import React from 'react';
// import '../../../../assets/styles/student.scss';
import '../style/GeneralProfile.scss';
import { useAuth } from '../../../../modules/auth';
import { useMutation, useQuery } from '@apollo/client';
import {
  MUTATION_UPDATE_STUDENT,
  PACKAGE_QUERY,
} from '../../../../modules/auth/graphql';
import { toast } from 'react-toastify';
import femaleAvatar from '../../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../../assets/images/avatars/img_avatar_male.png';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Introduction from './Introduction';

const StudentProfile = () => {
  const [t] = useTranslation(['profile', 'common', 'lessons']);

  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);

  const [profileImage, setProfileImage] = React.useState('');
  const navigate = useHistory();

  const { user, refetchUser } = useAuth();
  const avatar = user?.student?.avatar?.url;

  const { data: { packageSubscriptions: planStatus } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      variables: {
        userId: user?.id,
      },
    },
  );

  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar);
    } else if (user?.gender === 'female') {
      setProfileImage(femaleAvatar);
    } else if (user?.gender === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [user, avatar]);

  const saveIntroduction = async (text) => {
    if (text !== '') {
      const { data } = await updateStudent({
        variables: {
          id: parseInt(user?.student?.id),
          data: {
            about: text,
          },
        },
      });

      if (data) {
        toast('Introduction is changed!');
      }

      await refetchUser();
    }
  };

  return (
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
                      {user?.firstName + ' '}
                      {user?.lastName}
                    </h2>
                    {/* <p>
                            {t('student_level', {
                              level: 3,
                            })}
                          </p> */}
                    <span>
                      {user?.timeZone ? user?.timeZone : 'PST (GMT-8)'}
                    </span>
                  </div>
                  <div className="main_info-right">
                    <button
                      onClick={() => {
                        navigate.push('/student/profile/edit-information');
                      }}
                    >
                      {t('edit_profile')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Introduction
              text={user?.student?.about}
              onChange={saveIntroduction}
            />

            <div className="enrolled_course">
              <h2>{t('enrolled_courses')}</h2>
              {planStatus &&
                planStatus.map((item) => (
                  <div key={item.id} className="enrolled_col">
                    <div className="course_card">
                      <h3>{item.package.course.title}</h3>
                      <button className="lesson_button">
                        {t('lesson_type')}
                      </button>
                      <button className="time_button">
                        {item.package.sessionTime}{' '}
                        {t('minutes', { ns: 'common' })}
                      </button>
                      <button className="remaining_button">
                        {t('lessons_remaining', {
                          ns: 'lessons',
                          count: item.credits,
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
                <p>{user?.email}</p>
              </div>

              {user?.koreanEquivalent && (
                <div className="details_list">
                  <h4>{t('korean_name')}</h4>
                  <p>{user?.koreanEquivalent}</p>
                </div>
              )}

              {user?.gender && (
                <div className="details_list">
                  <h4>{t('gender')}</h4>
                  <p>{user?.gender}</p>
                </div>
              )}

              {user?.country && (
                <div className="details_list">
                  <h4>{t('country', { ns: 'common' })}</h4>
                  <p>{user?.country ? user?.country : 'Korea'}</p>
                </div>
              )}

              {user?.address && (
                <div className="details_list">
                  <h4>{t('address', { ns: 'common' })}</h4>
                  <p>{user?.address}</p>
                </div>
              )}

              {user?.phoneNumber && (
                <div className="details_list">
                  <h4>{t('phone_number', { ns: 'common' })}</h4>
                  <p>{user?.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentProfile;
