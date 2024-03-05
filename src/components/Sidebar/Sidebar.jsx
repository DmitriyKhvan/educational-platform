import React from 'react';

import { Menu } from './Menu';
import { useMediaQuery } from 'react-responsive';
import { MobileMenu } from './MobileMenu';

import 'src/assets/styles/referal.scss';

const Sidebar = ({ isShowSidebar }) => {
  console.log(isShowSidebar);
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  // const { user, logout } = useAuth();

  // const handleLogout = () => {
  //   logout();
  //   window.location.reload(true);
  // };

  return <>{isTablet ? <MobileMenu /> : <Menu />}</>;
};

export default Sidebar;
