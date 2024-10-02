import { useTranslation } from 'react-i18next';
import Button from '@/components/form/button/button';

import { StrikeMentor } from './strike-mentor';
import { MENTOR_CONTRACT } from '@/shared/apollo/queries/contract/mentor-contract';
import { useQuery } from '@apollo/client';
import ReactLoader from '@/components/common/loader';
import type { Lesson } from '@/types/types.generated';

interface CancelWarningModalProps {
  data: Lesson;
  setTabIndex: (index: number) => void;
}

const MentorCancelWarningModal: React.FC<CancelWarningModalProps> = ({ data, setTabIndex }) => {
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
          <div className="mb-5 text-2xl font-bold text-center">{t('cancel_lesson')}</div>

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
