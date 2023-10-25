import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { MENTORS_QUERY } from '../../../modules/auth/graphql';

import Layout from '../../../components/Layout';
import MentorsModal from './MentorsModal';
import Loader from '../../../components/Loader/Loader';
import InputField from '../../../components/Form/InputField';
import ModalWrapper from '../../../components/ModalWrapper/ModalWrapper';
import { MentorCard } from './MentorCard';

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

  const searchMentors = (value) => {
    let newMentors = data?.mentors;

    if (value) {
      newMentors = data?.mentors.filter((mentor) =>
        mentor?.fullName?.toLowerCase().includes(value.toLowerCase()),
      );
    }

    setMentors(newMentors);
  };

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
            onChange={(e) => searchMentors(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap mt-10 gap-x-8 gap-y-11">
          {mentors?.length === 0 && <p>{t('cannot_find_mentors')}</p>}

          {loading && <Loader height={'50vh'} />}

          {mentors &&
            mentors?.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                handleMoreMentor={handleMoreMentor}
              />
            ))}
        </div>
      </div>

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
