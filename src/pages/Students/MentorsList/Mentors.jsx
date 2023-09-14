import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import { MENTORS_QUERY } from '../../../modules/auth/graphql';

import Layout from '../../../components/Layout';
import MentorsModal from './MentorsModal';
import Loader from '../../../components/Loader/Loader';
import InputField from '../../../components/Form/InputField';
import Button from '../../../components/Form/Button/Button';
import { Avatar } from '../../../widgets/Avatar/Avatar';

import FavIcon from '../../../assets/images/Favorite.png';
import ModalWrapper from '../../../components/ModalWrapper/ModalWrapper';

const Mentors = () => {
  const [showMentorModal, setShowMentorModal] = React.useState(false);
  const [mentor, setMentor] = React.useState({});

  const [mentors, setMentors] = React.useState([]);
  const [t] = useTranslation(['studentMentor', 'common']);
  const { data, loading } = useQuery(MENTORS_QUERY, {
    errorPolicy: 'ignore',
  });

  React.useEffect(() => {
    setMentors(data?.mentors);
  }, [data]);

  const handleStatusTutor = () => {};

  const handleMoreMentor = (mentor) => {
    setMentor(mentor);
    setShowMentorModal(true);
  };

  const handleFilter = (value) => {
    let newMentors = data?.mentors;

    if (value) {
      newMentors = data?.mentors.filter((i) =>
        i?.user?.fullName?.toLowerCase().includes(value.toLowerCase()),
      );
    }

    setMentors(newMentors);
  };

  function resizerUsername(name) {
    return name && name.length > 9 ? name.slice(0, 9 - 1) + '...' : name;
  }

  return (
    <Layout>
      <div className="p-5 sm:py-[55px] sm:px-[66px]">
        <div>
          <h1 className="text-3xl sm:text-[40px] tracking-[-1px] text-color-dark-purple mb-[10px]">
            {t('mentor_list', { ns: 'studentMentor' })}
          </h1>
          <p className="text-base sm:text-xl leading-6 tracking-[-0.6px] text-color-light-grey">
            {t('mentor_list_desc', { ns: 'studentMentor' })}
          </p>
        </div>

        <div className="mt-3">
          <InputField
            className="w-[420px]"
            placeholder="Search..."
            onChange={(e) => handleFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap mt-10 gap-x-8 gap-y-5">
          {mentors?.length === 0 && <p>{t('cannot_find_mentors')}</p>}

          {loading && <Loader height={'50vh'} />}

          {mentors &&
            mentors?.map((item) => (
              <div key={item.id} className="w-full sm:w-[300px]">
                <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
                  <Avatar avatarUrl={item.avatar?.url} />
                  {item.isFavourite && (
                    <img
                      className="absolute top-[5%] right-[5%] w-10 h-10 object-cover"
                      src={FavIcon}
                      alt=""
                    />
                  )}
                </div>

                <div className="flex justify-between items-start mt-[30px] h-[120px] overflow-hidden">
                  <div>
                    <h2 className="text-2xl sm:text-[30px] text-color-purple tracking-[-0.6px] mb-4 ">
                      {resizerUsername(item?.user?.firstName)}
                    </h2>

                    <h4 className="font-semibold text-[15px] text-color-light-grey leading-[18px] tracking-[-0.2px]">
                      {item.university}
                    </h4>

                    <span className="text-[15px] text-color-light-grey leading-[18px] tracking-[-0.2px]">
                      {item.degree} {item.major ? '/ ' + item.major : null}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <Button
                      theme="outline"
                      className="w-[115px]"
                      onClick={() => handleMoreMentor(item)}
                    >
                      {t('learn_more', { ns: 'common' })}
                    </Button>

                    <Button
                      theme="outline"
                      className="w-[115px]"
                      disabled={item.availabilities.length === 0}
                    >
                      <Link
                        to={{
                          pathname: `/student/schedule-lesson/select`,
                          state: {
                            tutor: {
                              id: item.id,
                              firstName: item.user?.firstName,
                              lastName: item.user?.lastName,
                              avatar: item.avatar?.url,
                            },
                          },
                        }}
                        style={{
                          all: 'unset',
                          width: '100%',
                          height: '100%',
                          pointerEvents:
                            item.availabilities.length > 0 ? 'auto' : 'none',
                        }}
                      >
                        {t('schedule', { ns: 'common' })}
                      </Link>
                    </Button>
                    {/* <button onClick={() => handleStatusTutor(item.id)}>
                      {item?.isFavourite ? 'Remove' : 'Favorite'}
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* {showMentorModal && (
        <MentorsModal
          mentor={mentor}
          handleStatusTutor={handleStatusTutor}
          setShowMentorModal={setShowMentorModal}
        />
      )} */}

      <ModalWrapper
        isOpen={showMentorModal}
        closeModal={setShowMentorModal}
        widthContent="70%"
        heightContent="80vh"
        paddingContent="0"
      >
        <MentorsModal
          mentor={mentor}
          setShowMentorModal={setShowMentorModal}
          handleStatusTutor={handleStatusTutor}
        />
      </ModalWrapper>
    </Layout>
  );
};

export default Mentors;
