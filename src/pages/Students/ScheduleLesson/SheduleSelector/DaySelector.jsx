import { format } from 'date-fns-tz';
import { useState } from 'react';
import { useAuth } from 'src/modules/auth';
import { useSheduleSelector } from './SheduleSelectorProvider/useSheduleSelector';
import { getItemToLocalStorage } from 'src/constants/global';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';

const GET_TIMESHEETS = gql`
  query combinedTimesheets(
    $tz: String!
    $date: String!
    $duration: String!
    $studentId: ID!
    $mentorId: ID
  ) {
    combinedTimesheets(
      tz: $tz
      date: $date
      duration: $duration
      mentorId: $mentorId
      studentId: $studentId
    ) {
      id
      day
      from
      to
      reserved
    }
  }
`;

export const DaySelector = ({ data, i }) => {
  const [getTimesheetsData, { data: timesheetsData }] = useLazyQuery(
    GET_TIMESHEETS,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [t] = useTranslation('common');
  const { user } = useAuth();

  const { duration, selectedTutor } = useSheduleSelector();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [dayClicked, setDayClicked] = useState();

  const isClicked = () => {
    if (data.format === 'day') {
      setDayClicked(i);
      // setTimeClicked(null);
      setTimeArr([]);

      setDay(data.day);
      getTimesheetsData({
        variables: {
          tz: userTimezone,
          date: format(new Date(data.day), 'yyyy-MM-dd', {
            timeZone: userTimezone,
          }),
          duration: String(duration).toString(),
          ...(selectedTutor && {
            mentorId: selectedTutor.id,
          }),
          studentId: getItemToLocalStorage('studentId'),
        },
      });
    }
  };

  return (
    <div
      className={`day-selector  rounded-md border-2 text-center my-3 ${
        i === dayClicked
          ? 'schedule_lesson_day bg-color-purple'
          : 'schedule_lesson_day_unselect bg-white'
      }`}
      onClick={isClicked}
    >
      <div>
        {t(
          data.day &&
            format(new Date(data.day), 'EEEE', {
              timeZone: userTimezone,
            }),
        )}
      </div>
    </div>
  );
};
