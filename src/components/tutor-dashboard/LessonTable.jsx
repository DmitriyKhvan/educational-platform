import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import { Link } from 'react-router-dom'
import '../../assets/styles/calendar.scss'

const LessonTable = ({ timezone, isUpcoming, tabularData }) => {
  const [t] = useTranslation('translation')
  const [displayTableData, setDisplayTableData] = useState([])

  useEffect(() => {
    if (tabularData.length) {
      const x = tabularData
        .sort((a, b) => new Date(a.dateTime.date) - new Date(b.dateTime.date))
        .sort(
          (a, b) =>
            new Date(a.dateTime.startTime) - new Date(b.dateTime.startTime)
        )
        .map(x => x)
      const y = Object.assign({}, x)
      const z = []
      for (const [, value] of Object.entries(y)) {
        z.push(value)
      }
      setDisplayTableData(z)
    }

    if (isUpcoming) {
      setDisplayTableData([
        {
          lessonId: '253',
          lesson: 'General English',
          topic: 'Topic Name',
          level: '3',
          type: 'Private',
          resource: {
            start_at: '2023-1-28 12:12:12',
            duration: '25'
          },
          student: 'Alice S.'
        },
        {
          lessonId: '123',
          lesson: 'Junior English',
          topic: 'Topic Name',
          level: '3',
          type: 'Group',
          resource: {
            start_at: '2023-1-28 12:12:12',
            duration: '25'
          },
          student: 'Jane D.'
        },
        {
          lessonId: '123',
          lesson: 'Junior English',
          topic: 'Topic Name',
          level: '3',
          type: 'Group',
          resource: {
            start_at: '2023-1-28 12:12:12',
            duration: '50'
          },
          student: 'Jane D.'
        }
      ])
    } else {
      setDisplayTableData([
        {
          lessonId: '253',
          lesson: 'General English',
          topic: 'Topic Name',
          level: '3',
          type: 'Private',
          resource: {
            start_at: '2022-12-12 12:12:12',
            duration: '25'
          },
          student: 'Alice S.'
        },
        {
          lessonId: '123',
          lesson: 'Junior English',
          topic: 'Topic Name',
          level: '3',
          type: 'Group',
          resource: {
            start_at: '2022-12-12 12:12:12',
            duration: '25'
          },
          student: 'Jane D.'
        },
        {
          lessonId: '123',
          lesson: 'Junior English',
          topic: 'Topic Name',
          level: '3',
          type: 'Group',
          resource: {
            start_at: '2022-12-12 12:12:12',
            duration: '50'
          },
          student: 'Jane D.'
        },
        {
          lessonId: '123',
          lesson: 'Junior English',
          topic: 'Topic Name',
          level: '3',
          type: 'Group',
          resource: {
            start_at: '2022-12-12 12:12:12',
            duration: '25'
          },
          student: 'Jane D.'
        }
      ])
    }
  }, [isUpcoming])

  const tableHead = [
    'Lesson ID',
    t('class'),
    t('topic'),
    'Duration',
    'Type',
    t('level'),
    t('date_and_time'),
    t('students')
  ]

  return (
    <div className='scroll-layout'>
      <table className='table'>
        <thead>
          <tr>
            {tableHead.map(x => (
              <th scope='col'>{x}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData.map(event => (
            <tr className='tr-center'>
              <td className='td-item m-0'>
                <p className='td-lesson'>{'#' + event.lessonId}</p>
              </td>
              <td className='td-item m-0'>
                <p className='td-lesson'>{event.lesson}</p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>
                  {event.topic === 'Business English' ? 'English' : event.topic}
                </p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>
                  {`${event.resource.duration}m`}
                </p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>{`${event.type}`}</p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level td-level'>
                  {`${t('level')} ${event.level || 0}`}
                </p>
              </td>
              <td className='td-item m-0'>
                <div className='td-datetime td-datetime-border p-3'>
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
              <td className='td-item m-0'>
                <p className='td-topic-level'>{event.student}</p>
              </td>
              <td className='td-item m-0'>
                <Link className='td-button' to={`appointments-calendar/lesson/${event.lessonId}`}>View More</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LessonTable
