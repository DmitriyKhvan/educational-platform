import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';

import Button from '@/components/form/button';
import { ModalConfirm } from '@/entities/modal-confirm';
import { AvailabilityExceptionModal } from '@/pages/mentors/availability-exceptions/availability-exception-modal';
import type { Exception } from '@/types';
import * as Dialog from '@radix-ui/react-dialog';
import { FaXmark } from 'react-icons/fa6';
import type { ExceptionDateSlot } from '@/types/types.generated';

export const AvailabilityException = ({
  exception,
  disabledDates,
  onSubmit,
}: {
  exception: Exception;
  disabledDates: Date[];
  onSubmit: (exception: Exception) => void;
}) => {
  const removeAvailabilityExceptionSlot = (exception: Exception, slot: ExceptionDateSlot) => {
    const date = exception.slots.length === 1 ? slot.date : '';
    const removeSlot = {
      ...slot,
      date,
      from: '',
      to: '',
    };

    const newSlots = exception.slots.map((sl: ExceptionDateSlot) =>
      sl.id === slot.id ? removeSlot : sl,
    );

    const newException = { ...exception, slots: newSlots };

    onSubmit(newException);
  };

  const removeAvailabilityException = (exception: Exception) => {
    const newSlots = exception.slots.map((slot: ExceptionDateSlot) => ({
      ...slot,
      date: '',
      from: '',
      to: '',
    }));

    const newException = { ...exception, date: '', slots: newSlots };

    onSubmit(newException);
  };

  return (
    <li key={exception.id} className="text-sm">
      <div className="flex items-center justify-between p-2">
        <AvailabilityExceptionModal
          exception={exception}
          onSubmit={onSubmit}
          disabledDates={disabledDates}
        />

        <AdaptiveDialog
          button={
            <button type="button">
              <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
            </button>
          }
        >
          <ModalConfirm
            title="Delete date override"
            text="Are you sure you want to delete this date override?"
            btns={
              <div className="flex gap-3">
                <Button
                  theme="destructive"
                  className="basis-1/2"
                  onClick={() => removeAvailabilityException(exception)}
                >
                  Yes, delete
                </Button>

                <Dialog.Close asChild>
                  <Button theme="gray" className="basis-1/2">
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            }
          />
        </AdaptiveDialog>
      </div>

      <ul>
        {exception.slots.map((slot) => {
          return (
            <li key={slot.id} className="flex items-center justify-between p-2">
              <AvailabilityExceptionModal
                exception={exception}
                slot={slot}
                onSubmit={onSubmit}
                disabledDates={disabledDates}
              />

              <AdaptiveDialog
                button={
                  <button type="button">
                    <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
                  </button>
                }
              >
                <ModalConfirm
                  title="Delete date override slot"
                  text="Are you sure you want to delete this date override slot?"
                  btns={
                    <div className="flex gap-3">
                      <Button
                        theme="destructive"
                        className="basis-1/2"
                        // onClick={() =>
                        //   exception.slots.length > 1
                        //     ? removeAvailabilityExceptionSlot(exception, slot)
                        //     : removeAvailabilityException(exception)
                        // }
                        onClick={() => removeAvailabilityExceptionSlot(exception, slot)}
                      >
                        Yes, delete
                      </Button>

                      <Dialog.Close asChild>
                        <Button theme="gray" className="basis-1/2">
                          Cancel
                        </Button>
                      </Dialog.Close>
                    </div>
                  }
                />
              </AdaptiveDialog>
            </li>
          );
        })}
      </ul>
    </li>
  );
};
