import React from 'react';
import { Link } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';

import { useAuth } from 'src/modules/auth';
import { LangSwitcher } from 'src/components/LangSwitcher';
import { Menu } from 'src/components/Menu';
import { MobileMenu } from 'src/components/Menu/ui/MobileMenu';

import { Roles } from 'src/constants/global';
import Logo from 'src/assets/images/logo_purple.svg';

export const Sidebar = () => {
  const { user } = useAuth();
  const isTablet = useMediaQuery({ maxWidth: 1023 });

  // const { user, logout } = useAuth();

  // const handleLogout = () => {
  //   logout();
  //   window.location.reload(true);
  // };

  return (
    <>
      {isTablet ? (
        <MobileMenu />
      ) : (
        <div className="sticky z-30 top-0 left-0 min-w-[280px] max-w-[280px] h-screen pl-8 pr-16 shadow-[4px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
          <Link
            className="flex items-center h-[79px]"
            to={
              user.role === Roles.MENTOR
                ? '/mentor/manage-appointments'
                : '/student/manage-lessons'
            }
          >
            <img src={Logo} alt="" />
          </Link>

          <Menu />

          <LangSwitcher />
        </div>
      )}
    </>
  );
};
