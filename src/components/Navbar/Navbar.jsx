import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'src/assets/images/logo_purple.svg';
import Dropdown from '../Dropdown';

import { Roles } from '../../constants/global';
import { useAuth } from '../../modules/auth';

import { HiUserCircle } from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';
// import { IoNotifications } from 'react-icons/io5';
import { useStudentsDropdown } from './useStudentsDropdown';
import { NotificationDropdownMenu } from './Notification/NotificationDropdownMenu';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/display-name
const Navbar = memo(() => {
  const [t] = useTranslation('common');
  const { user, logout } = useAuth();

  const { studentsRender, studentList } = useStudentsDropdown();

  const handleLogout = async () => {
    await logout();
    window.Intercom('shutdown');
    window.location.reload(true);
  };

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
      </div>
    </div>
  );
});

export default Navbar;
