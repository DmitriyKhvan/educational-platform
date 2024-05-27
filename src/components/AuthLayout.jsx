import React from 'react';
import 'src/app/styles/auth.scss';
import Logo from '../assets/images/logo_purple.svg';
import Butterfly from '../assets/images/butterfly.svg';

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
    </div>
  );
};

export default AuthLayout;
