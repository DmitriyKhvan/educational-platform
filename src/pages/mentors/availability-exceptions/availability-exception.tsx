import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';

import Button from '@/components/form/button';
import { ModalConfirm } from '@/entities/modal-confirm';
import { AvailabilityExceptionModal } from '@/pages/mentors/availability-exceptions/availability-exception-modal';
import type { AvailabilitySlot, Slot } from '@/types';
import * as Dialog from '@radix-ui/react-dialog';
import { FaXmark } from 'react-icons/fa6';
import type { ExceptionDateSlot } from '@/types/types.generated';

export const AvailabilityException = ({
  exception,
  disabledDates,
  onSubmit,
  availabilityExceptions,
}: {
  exception: AvailabilitySlot;
  disabledDates: Date[];
  onSubmit: (exception: AvailabilitySlot[]) => void;
  availabilityExceptions: AvailabilitySlot[];
}) => {
  const removeAvailabilityExceptionSlot = (
    exception: AvailabilitySlot,
    slot: ExceptionDateSlot,
  ) => {
    // const newSlots = exception.slots.filter((sl) => sl.id !== slot.id);
    const removeSlot = {
      ...slot,
      from: '',
      to: '',
    };

    const newSlots = exception.slots.map((sl: Slot) => (sl.id === slot.id ? removeSlot : sl));

    const newException = { ...exception, slots: newSlots };

    const newAvailabilityExceptions = availabilityExceptions.map((aval) =>
      aval.id === newException.id ? newException : aval,
    );

    onSubmit(newAvailabilityExceptions);
  };

  const removeAvailabilityException = (exception: AvailabilitySlot) => {
    // const newAvailabilityExceptions = availabilityExceptions.filter(
    //   (aval) => aval.id !== exception.id,
    // );

    const newSlots = exception.slots.map((slot: Slot) => ({
      ...slot,
      from: '',
      to: '',
    }));

    const newException = { ...exception, slots: newSlots };

    const newAvailabilityExceptions = availabilityExceptions.map((aval) =>
      aval.id === newException.id ? newException : aval,
    );

    onSubmit(newAvailabilityExceptions);
  };

  return (
    <li key={exception.id} className="text-sm">
      {(exception.slots.length === 0 || exception.slots.length > 1) && (
        <div className="flex items-center justify-between p-2">
          <AvailabilityExceptionModal
            availabilityExceptions={availabilityExceptions}
            exception={exception}
            onSubmit={onSubmit}
            disabledDates={disabledDates}
          />

          <AdaptiveDialog
            button={
              <button>
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
      )}

      <ul>
        {exception.slots.map((slot) => {
          return (
            <li key={slot.id} className="flex items-center justify-between p-2">
              <AvailabilityExceptionModal
                availabilityExceptions={availabilityExceptions}
                exception={exception}
                slot={slot}
                onSubmit={onSubmit}
                disabledDates={disabledDates}
              />

              <AdaptiveDialog
                button={
                  <button>
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
                        onClick={() =>
                          exception.slots.length > 1
                            ? removeAvailabilityExceptionSlot(exception, slot)
                            : removeAvailabilityException(exception)
                        }
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
