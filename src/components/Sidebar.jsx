import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import '../assets/styles/referal.scss';
import '../assets/styles/sidebar.scss';
import CloseIcon from '../assets/images/close.svg';
import Logo from '../assets/images/logo.png';
import LogoutImg from '../assets/images/logout_icon.svg';
import whiteCalendar from '../assets/images/sidebar/active-calendar.png';
import Icon1 from '../assets/images/sidebar/purple_dashboard_icon.svg';
import tutorIcon from '../assets/images/sidebar/purple_tutor_icon.svg';
import tutorActiveIcon from '../assets/images/sidebar/white_tutor_icon.svg';
import Icon2 from '../assets/images/sidebar/purple_lesson_icon.svg';
import Icon11 from '../assets/images/sidebar/purple_subscription_icon.svg';
import ActivePayments from '../assets/images/present.png';
import purpleCalendar from '../assets/images/sidebar/calendar.png';
import ClassMaterialIcon from '../assets/images/sidebar/class_materials.svg';
import ActiveIcon1 from '../assets/images/sidebar/white_dashboard_icon.svg';
import ActiveIcon2 from '../assets/images/sidebar/white_lesson_icon.svg';
import ActiveIcon11 from '../assets/images/sidebar/white_subscription_icon.svg';
import gift from '../assets/images/sidebar/gift.png';
import { classMaterialURL } from '../constants/global';
import { useSubscription } from '@apollo/client';
import { MESSAGE_SUBSCRIPTIONS } from '../utils/subscriptions';

const tutorNavLinks = [
  {
    label: 'manage_appointments',
    link: '/mentor/manage-appointments',
    icon: Icon1,
    activeIcon: ActiveIcon1,
  },
  {
    label: 'lessons',
    link: '/mentor/lesson-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2,
  },
  {
    label: 'messages',
    link: '/messages',
    icon: Icon2,
    activeIcon: ActiveIcon2,
  },
  {
    label: 'check_requests',
    link: '/approve-requests',
    icon: Icon11,
    activeIcon: ActiveIcon11,
  },
  {
    label: 'my_availability',
    link: '/mentor/availability',
    icon: purpleCalendar,
    activeIcon: whiteCalendar,
  },
];

const studentNavLinks = [
  {
    label: 'dashboard',
    link: '/student/manage-lessons',
    icon: Icon1,
    activeIcon: ActiveIcon1,
  },
  {
    label: 'lessons',
    link: '/student/lesson-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2,
  },
  {
    label: 'mentors',
    link: '/student/mentors-list',
    icon: tutorIcon,
    activeIcon: tutorActiveIcon,
  },
  {
    label: 'class_material',
    link: classMaterialURL || 'https://naonow.instructure.com/',
    icon: ClassMaterialIcon,
    activeIcon: ClassMaterialIcon,
    external: true,
  },
  {
    label: 'subscriptions',
    link: '/student/subscriptions',
    icon: ActivePayments,
    activeIcon: gift,
  },
];

const Sidebar = ({ isShowSidebar, setShowSidebar }) => {
  let location = useLocation();
  const history = useHistory();
  const [t] = useTranslation(['common', 'sidebar']);

  const { user: currentUser, logout } = useAuth();

  const {data} = useSubscription(MESSAGE_SUBSCRIPTIONS);
  tutorNavLinks.map((item) => {
    item.is_selected = location.pathname.includes(item.link);
    return item;
  });

  studentNavLinks.map((item) => {
    item.is_selected = location.pathname.includes(item.link);
    return item;
  });

  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    if (currentUser.role === 'mentor') {
      setNavLinks(tutorNavLinks);
    } else if (currentUser.role === 'student') {
      setNavLinks(studentNavLinks);
    }
  }, [currentUser]);

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
        <div className="link-list">
          {navLinks?.map((item, index) =>
            item.divider ? (
              <div key={`divider-${index}`} className="divider" />
            ) : (
              <li
                className={`nav-item ${item.is_selected ? 'active' : ''} ${data?.newMessages?.meta?.dashboard == item.label ? 'ws-notification' : ''}`}
                key={index}
              >
                {item.external ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(item.link);
                    }}
                  >
                    <div className="icon">
                      <img
                        src={item.activeIcon}
                        alt=""
                        className={item.is_selected ? 'block' : 'none'}
                      />
                      <img
                        src={item.icon}
                        alt=""
                        className={!item.is_selected ? 'block' : 'none'}
                      />
                    </div>
                    <span>{t(item.label, { ns: 'sidebar' })}</span>
                  </a>
                ) : (
                  <Link to={item.link}>
                    <div className="icon">
                      <img
                        src={item.activeIcon}
                        alt=""
                        className={item.is_selected ? 'block' : 'none'}
                      />
                      <img
                        src={item.icon}
                        alt=""
                        className={!item.is_selected ? 'block' : 'none'}
                      />
                    </div>
                    <span>{t(item.label, { ns: 'sidebar' })}</span>
                  </Link>
                )}
              </li>
            ),
          )}
        </div>
      </div>
      {isShowSidebar ? (
        <div className="side-bar mobile-version">
          <h4 className="main-title">{t('navigation', { ns: 'sidebar' })}</h4>
          <img
            src={CloseIcon}
            alt=""
            className="close-icon"
            onClick={() => setShowSidebar(false)}
          />
          <div className="divider" />
          <div className="link-list">
            {navLinks?.map((item, index) => (
              <li
                className={`nav-item ${item.is_selected ? 'active' : ''} ${data?.newMessages?.meta?.dashboard == item.label ? 'ws-notification' : ''}`}
                key={index}
              >
                <Link to={item.link} onClick={() => setShowSidebar(false)}>
                  <div className="icon">
                    <img
                      src={item.activeIcon}
                      alt=""
                      className={item.is_selected ? 'block' : 'none'}
                    />
                    <img
                      src={item.icon}
                      alt=""
                      className={!item.is_selected ? 'block' : 'none'}
                    />
                  </div>
                  <span>{t(item.label, { ns: 'sidebar' })}</span>
                </Link>
              </li>
            ))}
            <li className="nav-item log-out" onClick={() => handleLogout()}>
              <div className="icon">
                <img src={LogoutImg} alt="" />
              </div>
              <span>{t('logout', { ns: 'common' })}</span>
            </li>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Sidebar;
