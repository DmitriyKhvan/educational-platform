import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleCard } from './ScheduleCard';
import { useSchedule } from '../ScheduleProvider';

export const AvailableTimes = memo(function AvailableTimes() {
  const { availableTimes } = useSchedule();
  const [t] = useTranslation('lessons');

  return (
    <>
      {availableTimes.length ? (
        <>
          <div>
            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
              {t('available_spots')}
            </h1>
            <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] available-text">
              {t('available_spots_subtitle')}
            </p>
          </div>
          <div className="row schedule-overflow-scroll slot-scroll col-12 media_small_width_schedule gap-4">
            {availableTimes.map((startTime) => (
              <ScheduleCard
                scheduleStartTime={startTime}
                key={startTime.time}
              />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
});
