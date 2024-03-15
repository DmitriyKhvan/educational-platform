import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'src/assets/images/logo_purple.svg';
import Dropdown from '../Dropdown';

import { Roles } from '../../constants/global';
import { useAuth } from '../../modules/auth';

import { HiUserCircle } from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';
import { useStudentsDropdown } from './useStudentsDropdown';
import { NotificationDropdownMenu } from './Notification/NotificationDropdownMenu';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

// eslint-disable-next-line react/display-name
const Navbar = memo(() => {
  const [t] = useTranslation('common');
  const { user, logout } = useAuth();
  const isTablet = useMediaQuery({ maxWidth: 1023 });

  const { studentsRender, studentList } = useStudentsDropdown();

  const handleLogout = async () => {
    await logout();
    window.Intercom('shutdown');
    window.location.reload(true);
  };

  return (
    <div className="nav-bar sticky top-0 flex items-center justify-between bg-white h-20 px-5 sm:px-10 shadow-[0px_4px_16px_0px_rgba(0,_0,_0,_0.04)] z-20">
      <div>
        {isTablet && (
          <Link
            to={
              user.role === Roles.MENTOR
                ? '/mentor/manage-appointments'
                : '/student/manage-lessons'
            }
          >
            <img className="min-w-[161px]" src={Logo} alt="" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between gap-5">
        {user.role === Roles.STUDENT && (
          <Dropdown
            icon={
              user?.avatar ? (
                user?.avatar.url
              ) : (
                <HiUserCircle className="text-[30px] text-color-purple " />
              )
            }
            label={user?.firstName}
            className="w-[30px] h-[30px] rounded-full border-2 border-color-white object-center object-cover "
            renderChild={studentsRender}
            items={studentList}
          />
        )}

        <NotificationDropdownMenu />

        <Dropdown
          className="w-[30px] h-[30px] rounded-full border-2 border-color-white object-center object-cover "
          icon={
            user?.avatar ? (
              user?.avatar.url
            ) : (
              <HiUserCircle className="text-[30px] text-color-purple " />
            )
          }
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
  );
});

export default Navbar;
