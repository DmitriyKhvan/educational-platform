import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
// import { Link } from 'react-router-dom';
import '../../assets/styles/calendar.scss';
import { useAuth } from '../../modules/auth';

const LessonTable = ({ tabularData }) => {
  const [t] = useTranslation('lessons');
  const [displayTableData, setDisplayTableData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (tabularData.length) {
      const x = tabularData
        .sort(
          (a, b) => new Date(a.resource.startAt) - new Date(b.resource.startAt),
        )
        .map((x) => x);

      const y = Object.assign({}, x);
      const z = [];
      for (const [, value] of Object.entries(y)) {
        z.push(value);
      }
      setDisplayTableData(z);
    } else {
      setDisplayTableData([]);
    }
  }, [tabularData]);

  const tableHead = [
    t('lesson_package'),
    t('duration'),
    t('date_time'),
    t('student_name'),
    t('status'),
    // t('class_feedback'),
  ];

  return (
    <div className="scroll-layout">
      <table className="table">
        <thead>
          <tr>
            {tableHead.map((x, ind) => (
              <th scope="col" key={`row-${ind}`}>
                {x}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData?.length === 0 && (
            <tr>
              <td colSpan={tableHead.length} align="center">
                {t('no_lessons')}
              </td>
            </tr>
          )}
          {displayTableData.map((event) => (
            <tr className="tr-center" key={event.resource.id}>
              <td className="td-item m-0">
                <p className="td-lesson">
                  {event.resource.packageSubscription.package.course.title}
                </p>
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
                  {`${event.resource.duration} min`}
                </p>
              </td>

              <td className="td-item m-0">
                <div className="td-datetime td-datetime-border p-3">
                  {moment(event.resource.startAt)
                    .tz(user.timeZone)
                    .format('ddd, MMM Do | hh:mm A')}
                  {' → '}
                  {moment(event.resource.startAt)
                    .tz(user.timeZone)
                    .add(event.resource.duration, 'minutes')
                    .format('hh:mm A')}
                </div>
              </td>
              <td className="td-item m-0">
                <p className="td-topic-level">
                  {(event.resource.student.user.firstName ?? '') +
                    ' ' +
                    (event.resource.student.user.lastName ?? '')}
                </p>
              </td>

              <td className="td-item m-0">
                <p className="td-topic-level">
                  {event.resource.status === 'approved'
                    ? 'Approved'
                    : event.resource.status === 'scheduled'
                    ? 'Peding Request'
                    : event.resource.status}
                </p>
              </td>
              {/* <td className="td-item m-0">
                <Link
                  className="td-button"
                  to={`appointments-calendar/lesson/${event.resource.id}`}
                >
                  Feedback
                </Link>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonTable;
