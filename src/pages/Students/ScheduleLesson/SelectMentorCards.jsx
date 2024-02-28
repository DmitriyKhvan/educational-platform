import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { AVAILABLE_MENTORS } from 'src/modules/graphql/queries/mentors/availableMentors';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';

import Layout from '../../../components/Layout';
import { MentorsView } from '../MentorsList/MentorsView';
import Loader from 'src/components/Loader/Loader';
import Button from 'src/components/Form/Button';
import { getItemToLocalStorage } from 'src/constants/global';
import { HiMiniChevronLeft } from 'react-icons/hi2';

const useAvailableMentors = (isoTime, duration, studentId) => {
  const { data: { availableMentors } = {}, loading } = useQuery(
    AVAILABLE_MENTORS,
    {
      variables: {
        time: isoTime,
        duration: duration,
        studentId: studentId,
      },
      fetchPolicy: 'network-only',
    },
  );
  return {
    availableMentors: availableMentors?.mentors || [],
    loading: loading,
  };
};

const SelectMentorCards = ({ setTabIndex, setSelectTutor, schedule, step }) => {
  const [t] = useTranslation(['lessons', 'common']);

  const { availableMentors, loading } = useAvailableMentors(
    format(utcToZonedTime(new Date(schedule), 'UTC'), "yyyy-MM-dd'T'HH:mm:ss", {
      timeZone: 'UTC',
    }),
    step,
    getItemToLocalStorage('studentId'),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [availableMentors]);

  const onClick = (mentor) => {
    setSelectTutor(mentor);
    setTabIndex(4);
  };

  return (
    <Layout>
      <div className="p-5 md:p-8 lg:p-10">
        <Button className="p-0" theme="clear" onClick={() => setTabIndex(1)}>
          <HiMiniChevronLeft className="text-2xl mr-2" />
          <span className="text-[15px] font-semibold">
            {t('back', { ns: 'common' })}
          </span>
        </Button>

        <div className="flex flex-col md:items-center">
          <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-[-1px] text-color-dark-purple mb-[10px]">
            {t('select_mentor')}
          </h1>
          <p className="text-base leading-6 tracking-[-0.6px] text-color-light-grey">
            {t('select_mentor_subtitle')}
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : availableMentors?.length ? (
          <MentorsView
            mentorList={availableMentors}
            handleSelectMentor={onClick}
          />
        ) : (
          <p className="w-full text-center text-gray-500 uppercase">
            {t('no_mentors_available')}
          </p>
        )}
      </div>
    </Layout>
  );
};

export default SelectMentorCards;
