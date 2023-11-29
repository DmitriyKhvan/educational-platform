import React from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../modules/auth';

import Logo from 'src/assets/images/logo_purple.svg';
import { FiLogOut } from 'react-icons/fi';

import 'src/assets/styles/referal.scss';

import { VscChromeClose } from 'react-icons/vsc';
import { Menu } from './Menu';

const Sidebar = ({ isShowSidebar, setShowSidebar }) => {
  const history = useHistory();
  const [t] = useTranslation(['common', 'sidebar']);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload(true);
  };

  return (
    <>
      <div className="side-bar desktop-version">
        <img
          onClick={() => history.push('/')}
          src={Logo}
          className="sidebar-logo"
          alt=""
        />
        <Menu />
      </div>

      {isShowSidebar && (
        <div className="side-bar mobile-version">
          <h4 className="main-title">{t('navigation', { ns: 'sidebar' })}</h4>

          <VscChromeClose
            className="absolute top-[10px] right-[15px] w-6 h-6 cursor-pointer"
            onClick={() => setShowSidebar(false)}
          />

          <div className="divider" />
          <div className="mt-8">
            <Menu />

            <a className="nav-item" onClick={() => handleLogout()}>
              <FiLogOut />
              <span>{t('logout', { ns: 'common' })}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
