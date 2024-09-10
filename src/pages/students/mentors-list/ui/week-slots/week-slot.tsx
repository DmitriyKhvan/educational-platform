import MyDropdownMenu from '@/components/dropdown-menu';
import type { AvailabilitySlot } from '@/types/types.generated';
import { format } from 'date-fns-tz';
import { HiMiniChevronRight } from 'react-icons/hi2';

interface PropType {
  date: string;
  slots: AvailabilitySlot[];
}

export const WeekSlot: React.FC<PropType> = ({ date, slots }) => {
  const findSlots = slots.filter((slots) => slots.date === date);
  const cardSlots = findSlots.slice(0, 3);
  const moreSlots = findSlots.slice(3);

  // console.log('slots', slots);
  // console.log('date', date);
  // console.log('findSlots', findSlots);

  return (
    <div className="min-w-[127px] max-w-[127px] space-y-2">
      <h4 className="text-sm text-center text-gray-300 font-normal">
        {format(new Date(date), 'EEEE')}
      </h4>
      <div className="h-[202px] p-3 border border-gray-100 rounded-lg shadow-[0px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
        <h5 className="text-[13px] text-color-dark-purple text-center font-semibold">
          {format(new Date(date), 'MMM d')}
        </h5>
        <ul className="space-y-2 mt-2">
          {cardSlots.map((slot) => (
            <li
              key={slot.from}
              className="w-full p-2 bg-[rgba(14,_197,_65,_0.10)] text-xs text-center leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]"
            >
              {slot.from} - {slot.to}
            </li>
          ))}
        </ul>
        {moreSlots.length > 0 && (
          <MyDropdownMenu
            button={
              <button
                type="button"
                className="w-full flex justify-center items-center mt-2 py-2 px-3 bg-[rgba(14,_197,_65,_0.10)] text-xs leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]"
              >
                <span>{moreSlots.length} more</span>
                <HiMiniChevronRight className="text-sm" />
              </button>
            }
            align="center"
          >
            <ul className="space-y-2 p-3 max-h-[calc(100svh/2)] overflow-auto border border-gray-100 rounded-lg shadow-[0px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
              {moreSlots.map((slot) => (
                <li
                  key={slot.from}
                  className="w-full py-2 px-3 bg-[rgba(14,_197,_65,_0.10)] text-xs text-center leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]"
                >
                  {slot.from} - {slot.to}
                </li>
              ))}
            </ul>
          </MyDropdownMenu>
        )}
      </div>
    </div>
  );
};
