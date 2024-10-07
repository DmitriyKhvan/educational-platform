import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import CloseConfirmationModal from '@/entities/select-lesson-date-popover/ui/close-confirmation-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { addDays, format } from 'date-fns';
import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { FaAngleDown, FaXmark } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';

interface AvailabilitySlotType {
  date: string;
  from: string;
  to: string;
}

interface SelectLessonDatePopoverProps {
  slot?: AvailabilitySlotType;
  popoverOpen?: boolean;
  setPopoverOpen?: Dispatch<SetStateAction<boolean>>;
  setRepeat: Dispatch<SetStateAction<number | boolean | null>>;
  repeat: number | boolean | null;
  setSchedule: Dispatch<SetStateAction<AvailabilitySlotType | undefined>>;
  setChosenDates: Dispatch<SetStateAction<AvailabilitySlotType[]>>;
  btn: ReactNode;
}

function SelectLessonDatePopover({
  slot,
  popoverOpen,
  setPopoverOpen,
  setSchedule,
  setRepeat,
  repeat,
  setChosenDates,
  btn,
}: SelectLessonDatePopoverProps) {
  console.log('repeat', repeat);

  console.log('type repeat', typeof repeat);

  const isBoolean = typeof repeat === 'boolean';

  const isMobile = useMediaQuery({ maxWidth: 639 });

  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [repeatPeriod, setRepeatPeriod] = useState(0);
  const [isChosen, setIsChosen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [confirmCloseModal, setConfirmCloseModal] = useState(false);

  const closeModal = () => {
    setSchedule(undefined);
    setRepeatWeekly(false);
    setRepeatPeriod(0);
    setIsChosen(false);
    setConfirmCloseModal(false);
    setPopoverOpen?.(false);
  };

  useEffect(() => {
    if (repeatPeriod && repeatWeekly) {
      setChosenDates((v) => {
        let dateToIncrement = v?.[0] && new Date(`${v[0].date}T${v[0].from}:00Z`);
        const res = v?.[0]
          ? [
              v[0],
              ...Array.from(Array(repeatPeriod * 4 - 1)).map(() => {
                dateToIncrement = addDays(new Date(dateToIncrement), 7);

                const res = {
                  date: format(dateToIncrement, 'yyyy-MM-dd'),
                  from: slot?.from ?? format(dateToIncrement, 'HH:mm'),
                  to: slot?.to ?? format(dateToIncrement, 'HH:mm'),
                };

                return res;
              }),
            ]
          : [];
        return res;
      });
    } else if (!repeatWeekly && isChosen) {
      setChosenDates((v) => (v?.[0] ? [v[0]] : []));
    }
  }, [repeatPeriod, repeatWeekly]);

  return (
    <>
      {isChosen && (
        <CloseConfirmationModal
          open={confirmCloseModal}
          setOpen={setConfirmCloseModal}
          onCloseClick={() => {
            closeModal();
            setChosenDates([]);
          }}
        />
      )}
      <Popover
        open={isChosen}
        onOpenChange={(open) => {
          setPopoverOpen?.(open);
          if (open) {
            setRepeat(isBoolean ? isBoolean : null);
          }
          if (!open) {
            setConfirmCloseModal(true);
          }
        }}
      >
        <PopoverTrigger
          asChild
          className="w-full"
          disabled={popoverOpen}
          onClick={() => {
            setIsChosen(true);
            setChosenDates(slot ? [slot] : []);
          }}
        >
          {btn}
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] bg-white"
          side={isMobile ? 'bottom' : 'left'}
          sideOffset={10}
          avoidCollisions={true}
        >
          <div className="grid gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-3 mb-1">
                <h4 className="font-semibold leading-none">
                  {format(new Date(slot?.date ?? ''), 'eeee, MMMM do')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {slot && format(new Date(`${slot.date}T${slot.from}:00`), 'HH:mmaa')} -{' '}
                  {slot && format(new Date(`${slot.date}T${slot.to}:00`), 'HH:mmaa')}
                </p>
              </div>
              <PopoverClose>
                <FaXmark />
              </PopoverClose>
            </div>
            {typeof repeat !== 'boolean' && (
              <div className="grid gap-2 mb-4">
                <label className="flex items-center gap-3 mb-4">
                  <CheckboxField
                    square
                    checked={repeatWeekly}
                    onChange={(e) => {
                      setRepeatWeekly(e.target.checked);
                      if (e.target.checked) setRepeatPeriod(1);
                      else setRepeatPeriod(0);
                    }}
                  />
                  Repeat weekly
                </label>

                {repeatWeekly && (
                  <MyDropdownMenu
                    open={dropdownOpen}
                    setOpen={setDropdownOpen}
                    contentClassName="z-50 w-full"
                    button={
                      <Button
                        theme="clear"
                        className={
                          'flex mb-4 justify-between items-center gap-3 w-full border border-gray-200'
                        }
                      >
                        <span className="grow text-left">
                          {repeatPeriod &&
                            `For ${repeatPeriod} month${repeatPeriod > 1 ? 's' : ''}`}
                        </span>
                        <FaAngleDown />
                      </Button>
                    }
                  >
                    <ul className={'w-[252px] z-50'}>
                      <li
                        key={'1month'}
                        className={'border-b border-color-border-grey last:border-b-0'}
                      >
                        <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                          <span className={'text-sm font-medium text-color-dark-purple'}>
                            For 1 month
                          </span>
                          <CheckboxField
                            onChange={() => {
                              setRepeatPeriod(1);
                              setDropdownOpen(false);
                            }}
                            type="radio"
                            name="period"
                            checked={repeatPeriod === 1}
                          />
                        </label>
                      </li>
                      <li
                        key={'3month'}
                        className={'border-b border-color-border-grey last:border-b-0'}
                      >
                        <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                          <span className={'text-sm font-medium text-color-dark-purple'}>
                            For 3 months
                          </span>
                          <CheckboxField
                            onChange={() => {
                              setRepeatPeriod(3);
                              setDropdownOpen(false);
                            }}
                            type="radio"
                            name="period"
                            checked={repeatPeriod === 3}
                          />
                        </label>
                      </li>
                    </ul>
                  </MyDropdownMenu>
                )}
              </div>
            )}
            <Button
              onClick={() => {
                setSchedule(slot);
                if (repeatWeekly) setRepeat(repeatPeriod);
                setIsChosen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default SelectLessonDatePopover;
