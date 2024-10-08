import { addMinutes, parse } from 'date-fns';
import { format } from 'date-fns-tz';
// import { ko as kr } from 'date-fns/locale';

import CheckboxField from '@/components/form/checkbox-field';
import { useSchedule } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';
import { type LanguageType, localeDic } from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';
import { scrollToElement } from '@/shared/utils/scroll-to-element';
import { useTranslation } from 'react-i18next';
import type { AvailableTime } from '../schedule-provider/lib/schedule-context';
import type { Dispatch, SetStateAction } from 'react';

export const ScheduleCard = ({
  startTime,
  setScheduleStartTime,
  scheduleStartTime,
}: {
  startTime: AvailableTime;
  setScheduleStartTime: Dispatch<SetStateAction<AvailableTime | null | undefined>>;
  scheduleStartTime: AvailableTime | null | undefined;
}) => {
  const { duration, day } = useSchedule();

  // eslint-disable-next-line no-unused-vars
  const [_, i18n] = useTranslation();

  const dayFormat = format(new Date(day), 'EEEE, MMM dd', {
    locale: localeDic[i18n.language as LanguageType],
  });

  const scheduleStartTimeParse = parse(startTime.time, 'HH:mm', new Date());

  const scheduleStartTimeFormat = format(scheduleStartTimeParse, 'hh:mm a', {
    locale: localeDic[i18n.language as LanguageType],
  });

  const scheduleEndTimeFormat = format(
    addMinutes(scheduleStartTimeParse, duration ?? 0),
    'hh:mm a',
    {
      locale: localeDic[i18n.language as LanguageType],
    },
  );

  const selectAvailableTime = () => {
    setScheduleStartTime(startTime);
    scrollToElement('timeSheets');
  };

  return (
    <label
      className={cn(
        'flex justify-between border border-color-border-grey rounded-lg bg-white p-5 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.04)] cursor-pointer',

        startTime.reserved && 'bg-gray-400/30 cursor-not-allowed',
        !startTime.reserved && 'hover:border-color-purple',
        startTime === scheduleStartTime && 'border-color-purple',
      )}
    >
      <div className="space-y-4">
        <h3 className="text-color-dark-purple text-base sm:text-lg font-bold">
          {`${scheduleStartTimeFormat} - ${scheduleEndTimeFormat}`}
        </h3>

        <p className="text-color-light-grey text-sm">{dayFormat}</p>
      </div>

      <CheckboxField
        disabled={startTime.reserved}
        type="radio"
        name="package"
        onChange={selectAvailableTime}
      />
    </label>
  );
};
