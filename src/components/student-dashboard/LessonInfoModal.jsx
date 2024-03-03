import React from 'react';
import LessonControls from './LessonControls';
import { addMinutes, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import StatusIndicator from './StatusIndicator';
import { Avatar } from 'src/widgets/Avatar/Avatar';

const LessonInfoModal = ({
  date,
  data,
  zoom,
  refetch,
  duration,
  setCanceledLessons,
  userTimezone,
}) => {
  return (
    <div className="w-[520px]">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-color-dark-purple">
            {format(
              utcToZonedTime(new Date(date), userTimezone),
              'eee, MMM do',
              { timeZone: userTimezone },
            )}
          </h2>
          <p>
            {format(utcToZonedTime(new Date(date), userTimezone), 'hh:mm a', {
              timeZone: userTimezone,
            })}
            {' - '}
            {format(
              addMinutes(
                utcToZonedTime(new Date(date), userTimezone),
                duration,
              ),
              'hh:mm a',
              { timeZone: userTimezone },
            )}
          </p>
        </div>

        <StatusIndicator status={data.status} />
      </header>

      <LessonControls
        date={date}
        data={data}
        zoom={zoom}
        refetch={refetch}
        duration={duration}
        setCanceledLessons={setCanceledLessons}
        pattern="info"
      />

      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t">
        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
          <label className="text-xs font-medium text-gray-300 block">
            Package
          </label>
          {data?.packageSubscription?.package?.course?.title}
        </div>

        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate flex">
          <Avatar
            avatarUrl={data?.mentor?.avatar?.url}
            className="w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9"
          />
          <div className=" overflow-hidden truncate">
            <label className="text-xs font-medium text-gray-300 block">
              Mentor
            </label>
            {data?.mentor?.firstName}{' '}
            {data?.mentor?.lastName[0] ? `${data?.mentor?.lastName[0]}.` : ''}
          </div>
        </div>

        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
          <label className="text-xs font-medium text-gray-300 block">
            Level
          </label>
          Level 2
        </div>

        <div className="w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate">
          <label className="text-xs font-medium text-gray-300 block">
            Duration
          </label>
          {duration} min.
        </div>
      </div>
    </div>
  );
};

export default LessonInfoModal;
