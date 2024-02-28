import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';

import Logo from 'src/assets/images/logo_purple.svg';
import LogoSymbol from 'src/assets/images/logo_purple_symbol.svg';
import { FiLogOut } from 'react-icons/fi';

import 'src/assets/styles/referal.scss';

import { VscChromeClose } from 'react-icons/vsc';
import { Menu } from './Menu';
import { Roles } from 'src/constants/global';

const Sidebar = ({ isShowSidebar, setShowSidebar }) => {
  const [t] = useTranslation(['common', 'sidebar']);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload(true);
  };

  return (
    <>
      <div className="side-bar desktop-version">
        <Link
          // className="mb-[7vh] mt-4"
          className="flex items-center justify-center h-[79px] mb-5"
          to={
            user.role === Roles.MENTOR
              ? '/mentor/manage-appointments'
              : '/student/manage-lessons'
          }
        >
          <img src={Logo} alt="" />
        </Link>

        <Menu />
      </div>

      <div
        className={`side-bar mobile-version pt-6 ${isShowSidebar && 'open'}`}
      >
        <div className="flex items-center justify-between mb-5">
          <Link
            to={
              user.role === Roles.MENTOR
                ? '/mentor/manage-appointments'
                : '/student/manage-lessons'
            }
          >
            <img className="w-7" src={LogoSymbol} alt="" />
          </Link>

          <VscChromeClose
            className="w-6 h-6 cursor-pointer p-1 rounded hover:bg-color-light-purple transition ease-in-out delay-150"
            onClick={() => setShowSidebar(false)}
          />
        </div>

        <div className="">
          <Menu />

          <a className="nav-item" onClick={() => handleLogout()}>
            <FiLogOut />
            <span>{t('logout', { ns: 'common' })}</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
