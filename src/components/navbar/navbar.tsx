import Logo from '@/shared/assets/images/logo_purple.svg';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/app/providers/auth-provider';
import { Roles } from '@/shared/constants/global';

import { MyDrawer } from '@/components/drawer';
import MyDropdownMenu from '@/components/dropdown-menu';
import MyProfileModal from '@/components/navbar/my-profile-modal';
import { Notifications } from '@/components/navbar/notification/notifications';
import { Avatar } from '@/widgets/avatar/avatar';
import { useTranslation } from 'react-i18next';
import { FaAngleDown } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';

const Navbar = memo(() => {
  const [t] = useTranslation('common');
  const { user } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ maxWidth: 1023 });

  const myProfileButton = (
    <label className="py-[14px] rounded-lg select-none cursor-pointer">
      <div className="flex flex-col items-center justify-between gap-2 sm:gap-0">
        <Avatar
          fallback={user?.role === Roles.STUDENT ? 'duck' : 'user'}
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
              user?.role === Roles.MENTOR
                ? '/mentor/manage-appointments'
                : '/student/manage-lessons'
            }
          >
            <img className="min-w-[161px]" src={Logo} alt="" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between gap-5">
        <Notifications />

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
