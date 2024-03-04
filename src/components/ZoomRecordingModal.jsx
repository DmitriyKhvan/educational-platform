import { addMinutes, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import React from 'react';
import ReactPlayer from 'react-player/file';
import StatusIndicator from './student-dashboard/StatusIndicator';
import { Avatar } from 'src/widgets/Avatar/Avatar';

export const ZoomRecordingModal = ({
  urlRecording,
  width = '100%',
  date,
  data,
  duration,
  userTimezone,
}) => {
  return (
    <div className="max-w-[520px] w-full">
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

      <div className="max-w-[456px] w-full mx-auto overflow-hidden rounded-lg mb-6">
        <ReactPlayer
          url={urlRecording}
          controls
          volume={0.8}
          width={width}
          height="auto"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-6 border-t">
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
