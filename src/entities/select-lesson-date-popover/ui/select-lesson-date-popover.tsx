import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import CloseConfirmationModal from '@/entities/select-lesson-date-popover/ui/close-confirmation-modal';
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { type ReactNode, useState } from 'react';
import { FaAngleDown, FaXmark } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';

interface AvailabilitySlotType {
  date: string;
  from: string;
  to: string;
}

interface SelectLessonDatePopoverProps {
  slot?: AvailabilitySlotType;
  setRepeat: React.Dispatch<React.SetStateAction<number | null>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlotType | undefined>>;
  btn: ReactNode;
}

function SelectLessonDatePopover({
  slot,
  setSchedule,
  setRepeat,
  btn,
}: SelectLessonDatePopoverProps) {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [repeatPeriod, setRepeatPeriod] = useState(0);
  const [isChosen, setIsChosen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [confirmCloseModal, setConfirmCloseModal] = useState(false);

  const closeModal = () => {
    setRepeatWeekly(false);
    setRepeatPeriod(0);
    setIsChosen(false);
    setConfirmCloseModal(false);
  };

  return (
    <>
      {isChosen && (
        <CloseConfirmationModal
          open={confirmCloseModal}
          setOpen={setConfirmCloseModal}
          onCloseClick={() => {
            closeModal();
          }}
        />
      )}
      <Popover
        open={isChosen}
        onOpenChange={(open) => {
          if (open) {
            setRepeat(null);
          }
          if (!open) {
            setConfirmCloseModal(true);
          }
        }}
      >
        <PopoverAnchor onClick={() => setIsChosen(true)} className="w-full">
          {btn}
        </PopoverAnchor>
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
                        {repeatPeriod && `For ${repeatPeriod} month${repeatPeriod > 1 ? 's' : ''}`}
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
              <Button
                onClick={() => {
                  setSchedule(slot);
                  if (repeatWeekly) setRepeat(repeatPeriod);
                  closeModal();
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default SelectLessonDatePopover;
