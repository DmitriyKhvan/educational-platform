import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import '../../assets/styles/calendar.scss'

const LessonTable = ({ isUpcoming, tabularData }) => {
  const [t] = useTranslation('translation')
  const [displayTableData, setDisplayTableData] = useState([])

  const today = moment().unix()
  useEffect(() => {
    if (isUpcoming) {
      const upcomingData = []
      for (const upcomingDataArr of tabularData) {
        if (moment(upcomingDataArr.onClick.date).isAfter(today)) {
          upcomingData.push(upcomingDataArr)
        }
      }
      setDisplayTableData(upcomingData)
    } else {
      const pastData = []
      for (const pastDataArr of tabularData) {
        if (moment(pastDataArr.onClick.date).isBefore(today)) {
          pastData.push(pastDataArr)
        }
      }
      setDisplayTableData(pastData)
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
                  {x.dateTime.date} {x.dateTime.startTime} {'→ '}
                  {x.dateTime.endTime}
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
