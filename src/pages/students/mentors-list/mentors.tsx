import { MENTORS } from '@/shared/apollo/queries/mentors/mentors';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import Loader from '@/components/loader/loader';

import { getItemToLocalStorage } from '@/shared/constants/global';

import { MentorsView } from '@/pages/students/mentors-list/mentors-view';

const Mentors = () => {
  const studentId = getItemToLocalStorage('studentId', '');

  const [t] = useTranslation(['studentMentor', 'common']);
  const { data, loading } = useQuery(MENTORS, {
    variables: { studentId },
    errorPolicy: 'ignore',
  });

  return (
    <div className="h-full">
      <div className="flex flex-col md:items-center">
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-[-1px] text-color-dark-purple mb-[10px]">
          {t('mentor_list', { ns: 'studentMentor' })}
        </h1>
        <p className="text-base leading-6 tracking-[-0.6px] text-color-light-grey">
          {t('mentor_list_desc', { ns: 'studentMentor' })}
        </p>
      </div>

      {loading ? (
        <Loader height={'50vh'} />
      ) : data.mentors.length ? (
        <MentorsView mentorList={data.mentors} />
      ) : (
        <p className="w-full text-center text-gray-500 uppercase">{t('no_mentors_available')}</p>
      )}
    </div>
  );
};

export default Mentors;
