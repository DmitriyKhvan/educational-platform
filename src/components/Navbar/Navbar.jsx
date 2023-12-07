import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import Logo from 'src/assets/images/auth-logo.svg';
import Logo from 'src/assets/images/logo_purple.svg';
import FlagUsa from 'src/assets/images/flag-usa.svg';
import FlagKorea from 'src/assets/images/flag-korea.svg';
import { MdOutlineMenu } from 'react-icons/md';
import Dropdown from '../Dropdown';

import {
  getItemToLocalStorage,
  Roles,
  setItemToLocalStorage,
} from '../../constants/global';
import { useAuth } from '../../modules/auth';

import { HiUserCircle } from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';
// import { IoNotifications } from 'react-icons/io5';
import { useStudentsDropdown } from './useStudentsDropdown';
import { NotificationDropdownMenu } from './Notification/NotificationDropdownMenu';

// eslint-disable-next-line react/display-name
const Navbar = memo(({ setShowSidebar }) => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );
  const [t, i18n] = useTranslation('common');

  const { studentsRender, studentList } = useStudentsDropdown();

  const handleLogout = async () => {
    await logout();
    window.Intercom('shutdown');
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
          {user.role === Roles.STUDENT && (
            <Dropdown
              icon={
                user?.avatar ? (
                  user?.avatar.url
                ) : (
                  <HiUserCircle className="text-[30px] text-color-purple mr-[5px]" />
                )
              }
              label={user?.firstName}
              className="w-[30px] h-[30px] rounded-full border-2 border-color-white object-center object-cover mr-[5px]"
              renderChild={studentsRender}
              items={studentList}
            />
          )}

          <Dropdown
            className="language"
            icon={language === 1 ? FlagUsa : FlagKorea}
            label={language === 1 ? t('english') : t('korean')}
            items={[
              {
                label: t('korean'),
                icon: FlagKorea,
                onClick: onChangeLanguage,
              },
              { label: t('english'), icon: FlagUsa, onClick: onChangeLanguage },
            ]}
          />

          <NotificationDropdownMenu />

          <Dropdown
            className="w-[20px] h-[20px]"
            // icon={IconUser}
            label="My Account"
            items={[
              {
                label: t('my_profile'),
                // icon: IconMyprofile,
                // activeIcon: IconMyprofile,
                customIcon: (
                  <HiUserCircle className="text-[30px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />
                ),
                customIconActive: (
                  <HiUserCircle className="text-[30px] text-white" />
                ),
                href:
                  user.role === Roles.MENTOR
                    ? '/mentor/profile'
                    : '/student/profile',
              },
              {
                label: t('logout'),
                // icon: LogoutImg,
                customIcon: (
                  <FiLogOut className="text-[24px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />
                ),

                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </div>
      <div className="mobile-version flex items-center justify-between h-full px-5 shadow-[0px_4px_16px_rgba(0,_0,_0,_0.01)]">
        <Link
          to={
            user.role === Roles.MENTOR
              ? '/mentor/manage-appointments'
              : '/student/manage-lessons'
          }
        >
          <img className="w-[208px]" src={Logo} alt="" />
        </Link>
        {/* ${data?.newMessages?.meta?.dashboard ? 'ws-notification-mobile' : ''} */}
        <div className={`mobile-menu`}>
          <MdOutlineMenu
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowSidebar((state) => !state)}
          />
        </div>
      </div>
    </div>
  );
});

export default Navbar;
