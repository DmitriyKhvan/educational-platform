import React from 'react'

const CTACard = ({ color, title, btnTitle, path, icon, iconBGcolor }) => {
  return (
    <div className={`page-card ${color} small-card`}>
      <div className='row ms-1'>
        <div className='col-4 mt-3 ps-3 me-2'>
          <img src={icon} className={`img-fluid ${iconBGcolor}`} alt='' />
        </div>
        <div className='col-7 mt-2'>
          <h3 className='text-white mt-3'>{title}</h3>
        </div>
      </div>
      <div className='ps-2'>
        <a href={path} className='enter-btn'>
          {btnTitle}
        </a>
      </div>
    </div>
  )
}

export default CTACard
