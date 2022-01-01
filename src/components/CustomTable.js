import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../assets/styles/global.scss'

const CustomTable = ({ data, columns, className, enableSeeAll = true }) => {
  const [isAll, setIsAll] = useState(false)
  const [t, i18n] = useTranslation('translation')
  return (
    <div className={`custom-table ${className}`}>
      <div className='desktop-version'>
        <div className='custom-table-header'>
          {columns.map((ci, index) => (
            <div
              className={`child-cell ${
                ci.dataKey === 'actions' ? 'actions' : ''
              }`}
              key={`desktop-header-${index}`}
              style={{ width: `${ci.width}%` }}
            >
              <p>{ci.title}</p>
            </div>
          ))}
        </div>
        <div className='custom-table-content'>
          {data
            .slice(0, isAll || !enableSeeAll ? data.length : 5)
            .map((item, index) => (
              <div
                className='custom-table-cell'
                key={`custom-table-cell-${index}`}
              >
                {columns.map((ci, index) => (
                  <div
                    className={`child-cell ${
                      ci.dataKey === 'actions' ? 'actions' : ''
                    }`}
                    key={`desktop-content-${index}`}
                    style={{ width: `${ci.width}%` }}
                  >
                    {ci.render ? (
                      ci.render(item[ci.dataKey], item)
                    ) : (
                      <p>{item[ci.dataKey]}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
      <div className='mobile-version'>
        {data
          .slice(0, isAll || !enableSeeAll ? data.length : 5)
          .map((item, index) => (
            <table key={`mobile-${index}`}>
              <tbody>
                {columns.map((ci, index) =>
                  ci.dataKey !== 'actions' ? (
                    <tr className='child-cell' key={`mobile-header-${index}`}>
                      <td>{ci.title}</td>
                      <td>
                        {ci.render ? (
                          ci.render(item[ci.dataKey], item)
                        ) : (
                          <p>{item[ci.dataKey]}</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <tr className='child-cell' key={`mobile-header-${index}`}>
                      <td colSpan={2}>
                        <div className='flex justify-content-center align-items-center'>
                          {ci.render(item[ci.dataKey], item)}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ))}
      </div>
      {enableSeeAll && !isAll && data.length > 4 && (
        <div className='btn-see-all' onClick={() => setIsAll(true)}>
          {t('see_all')}
        </div>
      )}
    </div>
  )
}

export default CustomTable
