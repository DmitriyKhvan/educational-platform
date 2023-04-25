import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Label = ({ date, label, drilldownView, onDrillDown }) => {
  const [t] = useTranslation('common')
  if (!drilldownView) {
    return <span>{t(label.replace(/[^A-Za-z]+/g, ''))}</span>
  }

  return <a onClick={onDrillDown}>{t(label)}</a>
}

Label.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool
}

const WeekHeader = ({ label, drilldownView, onDrillDown }) => {
  return (
    <div className='custom-date-header'>
      <div className='dh-item header-right'>
        <Label {...{ label, drilldownView, onDrillDown }} />
      </div>
    </div>
  )
}

WeekHeader.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool
}

export default WeekHeader
