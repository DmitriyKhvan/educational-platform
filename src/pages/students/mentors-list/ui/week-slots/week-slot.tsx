import { format } from 'date-fns-tz';
import { HiMiniChevronRight } from 'react-icons/hi2';

export const WeekSlot = ({ date }: { date: string }) => {
  return (
    <div className="min-w-[127px] max-w-[127px] space-y-2">
      <h4 className="text-sm text-center text-gray-300 font-normal">
        {format(new Date(date), 'EEEE')}
      </h4>
      <div className="p-3 border border-gray-100 rounded-lg shadow-[0px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
        <h5 className="text-[13px] text-color-dark-purple text-center font-semibold">
          {format(new Date(date), 'MMM d')}
        </h5>
        <ul className="space-y-2 mt-2">
          <li className="w-full py-2 px-3 bg-[rgba(14,_197,_65,_0.10)] text-xs text-center leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]">
            12:00 - 12:25
          </li>
          <li className="w-full py-2 px-3 bg-[rgba(14,_197,_65,_0.10)] text-xs text-center leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]">
            13:00 - 13:25
          </li>
          <li className="w-full py-2 px-3 bg-[rgba(14,_197,_65,_0.10)] text-xs text-center leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]">
            14:00 - 14:25
          </li>
        </ul>
        <button
          type="button"
          className="w-full flex justify-center items-center mt-2 py-2 px-3 bg-[rgba(14,_197,_65,_0.10)] text-xs leading-[15px] text-[rgba(14,_197,_65,_1)] rounded-[4px]"
        >
          <span>4 more</span>
          <HiMiniChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};
