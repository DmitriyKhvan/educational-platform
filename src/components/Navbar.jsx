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

import { HiUserCircle } from 'react-icons/hi2';
import { cn } from 'src/utils/functions';

const Navbar = ({ setShowSidebar }) => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );
  const [t, i18n] = useTranslation('common');

  const onChangeStudentProfile = (id) => {
    setItemToLocalStorage('studentId', id);
    window.location.reload(true);
    // refetchUser({ studentId: id });
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
        className={`flex items-center justify-between p-[13px] font-semibold text-[15px] cursor-pointer group hover:bg-color-purple`}
        onClick={() => {
          setActive(index);
          setVisible(false);
          if (item.onClick) {
            item.onClick(index);
          }
        }}
      >
        <span className="group-hover:text-white">{item.label}</span>

        {item.activeIcon ? (
          <span>
            <img
              className="w-[30px] h-[30px] rounded-full border-2 border-color-white object-center object-cover"
              src={item.activeIcon}
              alt=""
            />
          </span>
        ) : (
          <HiUserCircle className="text-[30px] text-color-purple group-hover:text-white" />
        )}
      </Link>
    );
  };

  const customIcon = (onClick, setVisible, visible) => {
    return (
      <HiUserCircle
        className="text-[30px] text-color-purple mr-[10px]"
        onClick={() => (onClick ? onClick() : setVisible(!visible))}
      />
    );
  };

  return (
    <div className="nav-bar">
      <div className="desktop-version">
        <div className="left-part"></div>
        <div className="right-part">
          <Dropdown
            className={cn(
              'w-[30px] h-[30px] mr-[10px]',
              user?.avatar && 'rounded-full object-center object-cover',
            )}
            icon={user?.avatar ? user?.avatar?.url : null}
            customIcon={customIcon}
            renderChild={students}
            items={user.students
              .filter(
                (student) => student.id !== getItemToLocalStorage('studentId'),
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

          <Dropdown
            className="w-[20px] h-[20px] mr-[10px]"
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
