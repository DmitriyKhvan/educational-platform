import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/images/auth-logo.svg';
import FlagUsa from '../assets/images/flag-usa.svg';
import FlagKorea from '../assets/images/flag-korea.svg';
import MobileMenuIcon from '../assets/images/mobile-menu.svg';
import Dropdown from './Dropdown';

import IconMyprofile from '../assets/images/sidebar/icon-myprofile.svg';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from '../constants/global';
import { useAuth } from '../modules/auth';

import { HiUserCircle } from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';

// import LogoutImg from '../assets/images/logout_icon.svg';
// import IconUser from '../assets/images/user.svg';

const Navbar = ({ setShowSidebar }) => {
  console.log(typeof IconMyprofile);

  const { user, logout } = useAuth();
  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );
  const [t, i18n] = useTranslation('common');

  const onChangeStudentProfile = (id) => {
    setItemToLocalStorage('studentId', id);
    window.location.reload(true);
  };

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

  const students = (item, index, active, setActive, setVisible) => {
    return (
      <Link
        key={index}
        to={item.href || '#'}
        className={`flex items-center justify-between px-[15px] py-[7px]  font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
        onClick={() => {
          setActive(index);
          setVisible(false);
          if (item.onClick) {
            item.onClick(index);
          }
        }}
      >
        <span className="transition ease-in-out delay-150 group-hover:text-white">
          {item.label}
        </span>

        {item.activeIcon ? (
          <span>
            <img
              className="w-[30px] h-[30px] rounded-full border-2 border-color-white object-center object-cover"
              src={item.activeIcon}
              alt=""
            />
          </span>
        ) : (
          <HiUserCircle className="text-[30px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />
        )}
      </Link>
    );
  };

  return (
    <div className="nav-bar">
      <div className="desktop-version">
        <div className="left-part"></div>
        <div className="right-part">
          {user.role === 'student' && (
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
              renderChild={students}
              items={user.students
                .filter(
                  (student) =>
                    student.id !== getItemToLocalStorage('studentId'),
                )
                .map((student) => {
                  return {
                    label: student.firstName,
                    icon: student?.avatar?.url,
                    activeIcon: student?.avatar?.url,
                    onClick: () => onChangeStudentProfile(student.id),
                  };
                })}
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
                  user.role === 'mentor'
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
      <div className="mobile-version">
        <div className="logo">
          <Link to={'/dashboard'}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="mobile-menu">
          <img
            src={MobileMenuIcon}
            alt=""
            onClick={() => setShowSidebar((state) => !state)}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
