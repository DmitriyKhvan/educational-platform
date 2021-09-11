import React from 'react'
import '../assets/styles/auth.scss'
import Logo from '../assets/images/auth-logo.svg'
import Butterfly from '../assets/images/butterfly.svg'
import Footer from './Footer'

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-body">
        <div className="main-logo">
          <img src={Logo} alt="" />
        </div>
        <div className="auth-form">{children}</div>
      </div>
      <div className="butterfly">
        <img src={Butterfly} alt="" />
      </div>
      <Footer />
    </div>
  )
}

export default AuthLayout
