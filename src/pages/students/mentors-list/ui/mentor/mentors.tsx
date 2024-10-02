import { MENTORS } from '@/shared/apollo/queries/mentors/mentors';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import Loader from '@/components/loader/loader';

import { getItemToLocalStorage } from '@/shared/constants/global';

import { MentorsView } from '@/pages/students/mentors-list/ui/mentor/mentors-view';

const Mentors = () => {
  const studentId = getItemToLocalStorage('studentId', '');

  const [t] = useTranslation(['studentMentor', 'common']);
  const { data, loading } = useQuery(MENTORS, {
    fetchPolicy: 'no-cache',
    variables: { studentId },
    errorPolicy: 'ignore',
  });

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-base sm:text-4xl text-color-dark-purple font-bold leading-normal tracking-tight">
          {t('mentor_list', { ns: 'studentMentor' })}
        </h1>
      </div>

      <p className="text-base leading-6 tracking-[-0.6px] text-color-light-grey">
        {t('mentor_list_desc', { ns: 'studentMentor' })}
      </p>

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
