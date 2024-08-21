import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Form/Button/Button';

import { StrikeMentor } from './StrikeMentor';
import { MENTOR_CONTRACT } from 'src/shared/apollo/queries/contract/mentorContract';
import { useQuery } from '@apollo/client';
import ReactLoader from 'src/components/common/Loader';

const MentorCancelWarningModal = ({ data, setTabIndex }) => {
  const [t] = useTranslation('modals');

  const {
    data: contractData,
    loading,
    error,
  } = useQuery(MENTOR_CONTRACT, {
    fetchPolicy: 'network-only',
  });

  return (
    <div className="w-full max-w-[416px] mx-auto">
      {loading ? (
        <ReactLoader className="relative w-[416px] h-[calc(100vh/2)] bg-transparent" />
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <>
          <div className="mb-5 text-2xl font-bold text-center">
            {t('cancel_lesson')}
          </div>

          <StrikeMentor data={data} contractData={contractData} />

          <Button
            className="h-[56px] px-[10px] w-full mt-6"
            theme="purple"
            onClick={() => setTabIndex(1)}
          >
            {t('continue_cancel')}
          </Button>

          <div className="flex items-center justify-center gap-x-8 mt-4">
            <button
              type="button"
              className="h-[38px] px-[10px] text-color-purple text-sm hover:underline"
              onClick={() => setTabIndex(10)}
            >
              {t('review_cancellation_policy')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MentorCancelWarningModal;
