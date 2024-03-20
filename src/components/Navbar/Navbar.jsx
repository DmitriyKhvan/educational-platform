import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'src/assets/images/logo_purple.svg';

import { Roles } from '../../constants/global';
import { useAuth } from '../../modules/auth';

import { HiUserCircle } from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';
import { useStudentsDropdown } from './useStudentsDropdown';
import { NotificationDropdownMenu } from './Notification/NotificationDropdownMenu';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import MyDropdownMenu from '../DropdownMenu';
import { FaAngleDown } from 'react-icons/fa6';

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

  const myAccountItems = [
    {
      label: t('my_profile'),
      customIcon: HiUserCircle,
      isActive: true,
      href: user.role === Roles.MENTOR ? '/mentor/profile' : '/student/profile',
    },
    {
      label: t('logout'),
      customIcon: FiLogOut,
      isActive: true,
      onClick: handleLogout,
    },
  ];

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
          <MyDropdownMenu
            button={
              <label className="py-[14px] rounded-lg select-none cursor-pointer">
                <div className="flex flex-col items-center justify-between gap-2 sm:gap-0">
                  {user?.avatar ? (
                    <img
                      className="w-[22px]"
                      src={user?.avatar.url}
                      alt="avatar"
                    />
                  ) : (
                    <HiUserCircle className="text-[30px] text-color-purple " />
                  )}
                  <div className="hidden sm:flex items-center font-bold gap-1">
                    <p>{user?.firstName}</p>
                    <FaAngleDown className="w-4" />
                  </div>
                </div>
              </label>
            }
          >
            <div className="py-[6px]">
              {studentList?.map((item, index) =>
                studentsRender(
                  item,
                  index,
                  false,
                  () => undefined,
                  () => undefined,
                ),
              )}
            </div>
          </MyDropdownMenu>
        )}

        <NotificationDropdownMenu />

        <MyDropdownMenu
          button={
            <label className="py-[14px] rounded-lg select-none cursor-pointer">
              <div className="flex flex-col items-center justify-between gap-2 sm:gap-0">
                {user?.avatar ? (
                  <img
                    className="w-[22px]"
                    src={user?.avatar.url}
                    alt="avatar"
                  />
                ) : (
                  <HiUserCircle className="text-[30px] text-color-purple " />
                )}
                <div className="hidden sm:flex items-center font-bold gap-1">
                  <p>My account</p>
                  <FaAngleDown className="w-4" />
                </div>
              </div>
            </label>
          }
        >
          <div className="py-[6px]">
            {myAccountItems?.map((item, index) =>
              studentsRender(
                item,
                index,
                false,
                () => undefined,
                () => undefined,
              ),
            )}
          </div>
        </MyDropdownMenu>
      </div>
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
