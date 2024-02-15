import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleCard } from './ScheduleCard';
import { useSchedule } from '../ScheduleProvider';

export const AvailableTimes = ({ setIsLoading }) => {
  const { availableTimes } = useSchedule();
  const [t] = useTranslation('lessons');

  return (
    <>
      {availableTimes.length ? (
        <>
          <div>
            <h1 className="title mb-2.5 available-text">
              {t('available_spots')}
            </h1>
            <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] available-text">
              {t('available_spots_subtitle')}
            </p>
          </div>
          <div className="row schedule-overflow-scroll slot-scroll col-12 media_small_width_schedule gap-4">
            {availableTimes.map((x, i) => (
              <ScheduleCard
                scheduleStartTime={x}
                setIsLoading={setIsLoading}
                key={i}
              />
            ))}
            {/* {availableTimes.length === 0 && (
          <div className="col-12">
            <p className="text-center">{t('no_available_slots')}</p>
          </div>
        )} */}
          </div>
        </>
      ) : null}
    </>
  );
};
