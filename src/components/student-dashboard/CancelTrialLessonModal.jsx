import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Form/Button';
import { CANCEL_APPOINTMENT } from 'src/shared/apollo/graphql';
import { useMutation } from '@apollo/client';
import notify from 'src/shared/utils/notify';
import Loader from '../Loader/Loader';
import * as Dialog from '@radix-ui/react-dialog';

export const CancelTrialLessonModal = ({
  data,
  fetchAppointments,
}) => {
  const [t] = useTranslation(['modals', 'common']);

  const [isLoading, setIsLoading] = useState(false);

  const [cancelLesson] = useMutation(CANCEL_APPOINTMENT);

  const onCancelLesson = async () => {
    setIsLoading(true);
    try {
      await cancelLesson({
        variables: {
          id: data.id,
          isTrial: true,
        },
      });

      await fetchAppointments();
      notify('Your lesson has been cancelled successfully');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="w-[336px] mx-auto">
        <h2 className="mb-4 text-2xl font-bold text-center">
          {t('cancel_lesson', { ns: 'modals' })}
        </h2>

        <p className="text-base text-center mb-6">
          {t('are_you_sure_to_cancel_trial', { ns: 'modals' })}
        </p>

        <div className="flex gap-3">
          <Dialog.Close asChild>
            <Button
              theme="gray"
              className="w-1/2 h-14"
              // onClick={() => setIsOpen(false)}
            >
              {t('back', { ns: 'common' })}
            </Button>
          </Dialog.Close>

          <Button
            theme="destructive"
            className="w-1/2 h-14"
            onClick={onCancelLesson}
          >
            {t('confirm', { ns: 'common' })}
          </Button>
        </div>
      </div>
    </>
  );
};
