import '@/app/styles/auth.scss';
import Butterfly from '@/shared/assets/images/butterfly.svg';
import Logo from '@/shared/assets/images/logo_purple.svg';
import type { ReactNode } from 'react';

const AuthLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
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
