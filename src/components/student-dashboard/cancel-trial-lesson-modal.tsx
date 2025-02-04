import Button from '@/components/form/button';
import Loader from '@/components/loader/loader';
import notify from '@/shared/utils/notify';
import type { CalendarEvent } from '@/types';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { CANCEL_APPOINTMENT } from '@/shared/apollo/mutations/lessons/cancelLessons';

interface CancelTrialLessonModalProps {
  data: CalendarEvent;
  fetchAppointments: () => void;
}

export const CancelTrialLessonModal: React.FC<CancelTrialLessonModalProps> = ({
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('An unknown error occurred', 'error');
      }
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

          <Button theme="destructive" className="w-1/2 h-14" onClick={onCancelLesson}>
            {t('confirm', { ns: 'common' })}
          </Button>
        </div>
      </div>
    </>
  );
};
