import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleCard } from './ScheduleCard';
import { useSchedule } from '../ScheduleProvider';
import { IoArrowBack } from 'react-icons/io5';

export const AvailableTimes = memo(function AvailableTimes() {
  const { availableTimes } = useSchedule();
  const [t] = useTranslation('lessons');

  return (
    <>
      {availableTimes.length !== 0 && (
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3">
              <button>
                <IoArrowBack className="text-2xl" />
              </button>
              <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
                {t('available_spots')}
              </h1>
            </div>

            <p className="welcome-subtitle mt-[15px]">
              {t('available_spots_subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {availableTimes.map((startTime) => (
              <ScheduleCard
                scheduleStartTime={startTime}
                key={startTime.time}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
});
