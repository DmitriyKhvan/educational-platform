import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'

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
  }, [isUpcoming])

  const tableHead = [
    t('class'),
    t('topic'),
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
                <p className='td-lesson'>{event.lesson}</p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>{event.topic}</p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>
                  {`${t('level')} ${event.level || 0}`}
                </p>
              </td>
              <td className='d-inline-flex'>
                <p className='td-datetime td-datetime-border ps-3'>
                  {moment(event.resource.start_at)
                    .tz(timezone)
                    .format('ddd, MMM Do hh:mm A')}
                  {' → '}
                  {moment(event.resource.start_at)
                    .tz(timezone)
                    .add(event.resource.duration, 'minutes')
                    .format('hh:mm A')}
                </p>
              </td>
              <td className='td-item m-0'>
                <p className='td-topic-level'>{event.student}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LessonTable
