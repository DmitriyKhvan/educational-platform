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
        .sort(
          (a, b) =>
            new Date(b.resource.start_at) - new Date(a.resource.start_at)
        )
        .map(x => x)
      const y = Object.assign({}, x)
      x.reverse()
      const z = []
      for (const [, value] of Object.entries(y)) {
        z.push(value)
      }
      setDisplayTableData(z)
    }
  }, [isUpcoming])

  const tableHead = [
    t('class'),
    t('level'),
    t('topic'),
    t('date_and_time'),
    t('students')
  ]

  return (
    <div style={{ overflowY: 'scroll', height: '70vh' }}>
      <table className='table'>
        <thead>
          <tr>
            {tableHead.map(x => (
              <th scope='col'>{x}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData.map(x => (
            <tr className='tr-center' style={{ height: '60px' }}>
              <td className='td-item'>
                <p className='td-lesson my-0'>{x.lesson}</p>
              </td>
              <td className='td-item'>
                <p className='td-lesson my-0'>{t('level') + ' ' + x.level}</p>
              </td>
              <td className='td-item'>
                <p
                  className='td-lesson my-0'
                  style={{ overflowX: 'clip', width: '15vw' }}
                >
                  {x.topic}
                </p>
              </td>
              <td>
                <p className='td-datetime td-datetime-border ps-3 my-0'>
                  {moment(x.resource.start_at)
                    .tz(timezone)
                    .format('ddd, MMM Do hh:mm A')}
                  {' → '}
                  {moment(x.resource.start_at)
                    .tz(timezone)
                    .add(x.resource.duration, 'minutes')
                    .format('hh:mm A')}
                </p>
              </td>
              <td className='td-item'>
                <p className='td-lesson my-0'>{x.student}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LessonTable
