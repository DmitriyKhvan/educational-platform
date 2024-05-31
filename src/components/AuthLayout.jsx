import React from 'react';
import 'src/app/styles/auth.scss';
import Logo from 'src/shared/assets/images/logo_purple.svg';
import Butterfly from 'src/shared/assets/images/butterfly.svg';

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
