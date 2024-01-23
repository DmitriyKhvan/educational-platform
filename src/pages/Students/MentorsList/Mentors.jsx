import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { MENTORS_QUERY } from '../../../modules/auth/graphql';

import Layout from '../../../components/Layout';
import Loader from '../../../components/Loader/Loader';

import { getItemToLocalStorage } from 'src/constants/global';

import { MentorsView } from './MentorsView';

const Mentors = () => {
  const studentId = getItemToLocalStorage('studentId');

  const [t] = useTranslation(['studentMentor', 'common']);
  const { data, loading } = useQuery(MENTORS_QUERY, {
    variables: { studentId },
    errorPolicy: 'ignore',
  });

  return (
    <Layout>
      <div className="p-5 md:p-8 lg:p-10">
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
          <div className="no_mentors">{t('no_mentors_available')}</div>
        )}
      </div>
    </Layout>
  );
};

export default Mentors;
