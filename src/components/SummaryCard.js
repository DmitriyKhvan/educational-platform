import React from 'react'

const SummaryCard = ({ text, icon, number }) => {
  return (
    <div className='summary-item'>
      <p className='number'>{number}</p>
      <div>
        <img src={icon} alt='' />
        <span>{text}</span>
      </div>
    </div>
  )
}

export default SummaryCard
