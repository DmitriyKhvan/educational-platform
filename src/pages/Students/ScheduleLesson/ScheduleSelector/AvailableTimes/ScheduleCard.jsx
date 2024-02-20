import { addMinutes, parse } from 'date-fns';
import { format } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from 'src/utils/functions';
import { useSchedule } from '../ScheduleProvider';
import CheckboxField from 'src/components/Form/CheckboxField';

export const ScheduleCard = ({
  startTime,
  setScheduleStartTime,
  scheduleStartTime,
}) => {
  const { duration, day } = useSchedule();

  const [i18n] = useTranslation(['lessons', 'common', 'modals']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const dayFormat = format(new Date(day), 'EEEE, MMM dd', {
    locale: locale,
  });

  const scheduleStartTimeParse = parse(startTime.time, 'HH:mm', new Date());

  const scheduleStartTimeFormat = format(scheduleStartTimeParse, 'hh:mm a');

  const scheduleEndTimeFormat = format(
    addMinutes(scheduleStartTimeParse, duration),
    'hh:mm a',
  );

  return (
    <label
      className={cn(
        `flex justify-between border border-color-border-grey rounded-lg bg-white p-5 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.04)] cursor-pointer`,
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
        onChange={() => setScheduleStartTime(startTime)}
      />
    </label>
  );
};
