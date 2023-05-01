import React from 'react';
import { useTranslation } from 'react-i18next';
import ScheduleCard from '../pages/Students/ScheduleLesson/ScheduleCard';

const AvailabilitySpots = ({ times }) => {
  const [t] = useTranslation();
  return (
    <React.Fragment>
      <h2 className="mb-2">{t('available_spots')}</h2>
      <p className="welcome-subtitle text-purple">
        {t('available_spots_subtitle')}
      </p>
      {times.map((x) => (
        <ScheduleCard scheduleStartTime={x} />
      ))}
    </React.Fragment>
  );
};

export default AvailabilitySpots;
