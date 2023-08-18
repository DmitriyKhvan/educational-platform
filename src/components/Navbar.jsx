import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/images/auth-logo.svg';
import FlagUsa from '../assets/images/flag-usa.svg';
import FlagKorea from '../assets/images/flag-korea.svg';
import LogoutImg from '../assets/images/logout_icon.svg';
import MobileMenuIcon from '../assets/images/mobile-menu.svg';
import Dropdown from './Dropdown';

import IconMyprofile from '../assets/images/sidebar/icon-myprofile.svg';
import IconUser from '../assets/images/user.svg';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from '../constants/global';
import { useAuth } from '../modules/auth';

const Navbar = ({setShowSidebar}) => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );
  const [t, i18n] = useTranslation('common');

  const handleLogout = async () => {
    await logout();
    window.location.reload(true);
  };

  const onChangeLanguage = (lang) => {
    setItemToLocalStorage('language', lang);
    setLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language === 0 ? 'kr' : 'en');
  }, [language]);

  return (
    <div className="nav-bar">
      <div className="desktop-version">
        <div className="left-part"></div>
        <div className="right-part">
          <Dropdown
            className="settings"
            icon={IconUser}
            items={[
              {
                label: t('my_profile'),
                icon: IconMyprofile,
                activeIcon: IconMyprofile,
                href:
                  user.role === 'mentor'
                    ? '/mentor/profile'
                    : '/student/profile',
              },
              {
                label: t('logout'),
                icon: LogoutImg,
                onClick: handleLogout,
              },
            ]}
          />
          <Dropdown
            className="language"
            icon={language === 1 ? FlagUsa : FlagKorea}
            items={[
              {
                label: t('korean'),
                icon: FlagKorea,
                onClick: onChangeLanguage,
              },
              { label: t('english'), icon: FlagUsa, onClick: onChangeLanguage },
            ]}
          />
        </div>
      </div>
      <div className="mobile-version">
        <div className="logo">
          <Link to={'/dashboard'}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="mobile-menu">
          <img src={MobileMenuIcon} alt="" onClick={() => setShowSidebar(state => !state)} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
