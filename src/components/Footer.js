import React from 'react'
import HeartImg from '../assets/images/heart.svg'

const Footer = () => {
  return (
    <>
      <div className='footer desktop-version'>
        <p className='company'>nao now LLC</p>
        <p>
          Made with <img src={HeartImg} alt='' /> in sunny California.
        </p>
        <p>Copyright 2021; All rights reserved.</p>
      </div>
      <div className='footer mobile-version'>
        <p className='company'>nao now LLC</p>
        <p>
          Made with <img src={HeartImg} alt='' /> in sunny California.
        </p>
        <p>Copyright 2021; All rights reserved.</p>
      </div>
    </>
  )
}

export default Footer
