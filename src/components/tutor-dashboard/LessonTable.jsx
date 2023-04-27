import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import '../../assets/styles/calendar.scss';

const LessonTable = ({ timezone, isUpcoming, tabularData }) => {
  const [t] = useTranslation('lessons');
  const [displayTableData, setDisplayTableData] = useState([]);

  useEffect(() => {
    if (tabularData.length) {
      const x = tabularData
        .sort((a, b) => new Date(a.dateTime.date) - new Date(b.dateTime.date))
        .sort(
          (a, b) =>
            new Date(a.dateTime.startTime) - new Date(b.dateTime.startTime),
        )
        .map((x) => x);
      const y = Object.assign({}, x);
      const z = [];
      for (const [, value] of Object.entries(y)) {
        z.push(value);
      }
      setDisplayTableData(z);
    }
  }, [tabularData]);

  const tableHead = [
    t('lesson_package'),
    t('duration'),
    t('date_time'),
    t('student_name'),
    t('class_feedback'),
  ];

  return (
    <div className="scroll-layout">
      <table className="table">
        <thead>
          <tr>
            {tableHead.map((x) => (
              <th scope="col">{x}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData?.length === 0 && (
            <tr
              className="tr-center "
              style={{ transform: 'translateX(38%) translateY(30%)' }}
            >
              <td>{t('no_lessons')}</td>
            </tr>
          )}
          {displayTableData.map((event, i) => (
            <tr className="tr-center">
              <td className="td-item m-0">
                <p className="td-lesson">{event.lesson}</p>
              </td>
              {/* 
              Do not delete this code, it is for future use
              <td className='td-item  m-0'>
                <p className='td-topic-level td-level'>
                  {`${t('level')} ${event.level || 0}`}
                </p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>
                  {event.topic === 'Business English' ? 'English' : event.topic}
                </p>
              </td>
              <td className='td-item text-center  m-0'>
                <p className='td-topic-level '>
                  {"WarmUp Exercise"}
                </p>
              </td> */}
              <td className="td-item m-0">
                <p className="td-topic-level">
                  {`${event.resource.duration}m`}
                </p>
              </td>

              <td className="td-item m-0">
                <div className="td-datetime td-datetime-border p-3">
                  {moment(event.resource.start_at)
                    .tz(timezone)
                    .format('ddd, MMM Do') + ' | '}
                  {moment(event.resource.start_at)
                    .tz(timezone)
                    .format('hh:mm A')}
                  {' → '}
                  {moment(event.resource.start_at)
                    .tz(timezone)
                    .add(event.resource.duration, 'minutes')
                    .format('hh:mm A')}
                </div>
              </td>
              <td className="td-item m-0">
                <p className="td-topic-level">
                  {event.resource.students[0].user.first_name ??
                    '' + ' ' + event.resource.students[0].user.last_name ??
                    ''}
                </p>
              </td>
              <td className="td-item m-0">
                <Link
                  className="td-button"
                  to={`appointments-calendar/lesson/${event.resource.id}`}
                >
                  Feedback
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonTable;
