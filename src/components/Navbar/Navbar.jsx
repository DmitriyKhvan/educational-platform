import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'src/assets/images/logo_purple.svg';

import { Roles } from '../../constants/global';
import { useAuth } from '../../modules/auth';

import { NotificationDropdownMenu } from './Notification/NotificationDropdownMenu';
import { useMediaQuery } from 'react-responsive';
import MyDropdownMenu from '../DropdownMenu';
import { FaAngleDown } from 'react-icons/fa6';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { MyDrawer } from '../Drawer';
import MyProfileModal from './MyProfileModal';
import { useTranslation } from 'react-i18next';

const Navbar = memo(() => {
  const [t] = useTranslation('common');
  const { user } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ maxWidth: 1023 });

  const myProfileButton = (
    <label className="py-[14px] rounded-lg select-none cursor-pointer">
      <div className="flex flex-col items-center justify-between gap-2 sm:gap-0">
        <Avatar
          fallback={user.role === Roles.STUDENT ? 'duck' : 'user'}
          avatarUrl={user?.avatar?.url}
          className="w-[32px] h-[32px] bg-color-purple rounded-full overflow-hidden"
          iconClassName="text-white w-[20px]"
        />
        <div className="hidden sm:flex items-center font-bold gap-1">
          <p>{t('my_profile')}</p>
          <FaAngleDown className="w-3" />
        </div>
      </div>
    </label>
  );

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
        <NotificationDropdownMenu />

        {isMobile ? (
          <MyDrawer button={myProfileButton}>
            <MyProfileModal />
          </MyDrawer>
        ) : (
          <MyDropdownMenu
            button={myProfileButton}
            contentClassName="min-w-[210px] overflow-hidden"
            align="end"
          >
            <MyProfileModal />
          </MyDropdownMenu>
        )}
      </div>
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
