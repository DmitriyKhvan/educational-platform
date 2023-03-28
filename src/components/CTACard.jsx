import React from 'react'
import { Link } from 'react-router-dom'

const CTACard = ({ color, title, btnTitle, path, icon, iconBGcolor,alt }) => {
  return (
    <div className={`page-card ${color} small-card`}>
      <div className='row ms-1 rows-align'>
        <div className='col-4  mt-3 me-2 mobilefinal mobilefinal-laptop '>
          <img src={icon} className={`img-fluid ${iconBGcolor}`} alt={alt} />
        </div>
        <div className='col-7 forest'>
          <h3 className='text-white change-mobile-top'>{title}</h3>
        </div>
      </div>
      <div className='ps-0'>
        <Link to={path} className='enter-btn ms-0 p-3 m-0'>
        {btnTitle}
        </Link>
      </div>
    </div>
  )
}

export default CTACard
