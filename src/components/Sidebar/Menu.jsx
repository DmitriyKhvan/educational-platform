import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { useNotifications } from 'src/modules/notifications';
import { Roles, classMaterialURL } from 'src/constants/global';

import { Badge } from '../Badge';
import { GoHomeFill } from 'react-icons/go';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { HiGift } from 'react-icons/hi2';
import { FaGraduationCap } from 'react-icons/fa6';
import { IoLibrarySharp } from 'react-icons/io5';

const tutorNavLinks = [
  {
    label: 'manage_appointments',
    link: '/mentor/manage-appointments',
    icon: GoHomeFill,
  },
  {
    label: 'lessons',
    link: '/mentor/lesson-calendar',
    icon: FaRegCalendarAlt,
  },
  // {
  //   label: 'messages',
  //   link: '/messages',
  //   icon: Icon2,
  //   activeIcon: ActiveIcon2,
  // },
  {
    label: 'check_requests',
    link: '/approve-requests',
    icon: HiGift,
  },
  {
    label: 'my_availability',
    link: '/mentor/availability',
    icon: FaRegCalendarAlt,
  },
];

const studentNavLinks = [
  {
    label: 'dashboard',
    link: '/student/manage-lessons',
    icon: GoHomeFill,
  },
  {
    label: 'lessons',
    link: '/student/lesson-calendar',
    icon: FaRegCalendarAlt,
  },
  {
    label: 'mentors',
    link: '/student/mentors-list',
    icon: FaGraduationCap,
  },
  {
    label: 'class_material',
    link: classMaterialURL || 'https://naonow.instructure.com/',
    icon: IoLibrarySharp,
    external: true,
  },
  {
    label: 'subscriptions',
    link: '/student/subscriptions',
    icon: HiGift,
  },
];

export const Menu = () => {
  const [t] = useTranslation(['common', 'sidebar']);

  const { user: currentUser } = useAuth();
  const { notifications } = useNotifications();

  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    if (currentUser.role === Roles.MENTOR) {
      setNavLinks(tutorNavLinks);
    } else if (currentUser.role === Roles.STUDENT) {
      setNavLinks(studentNavLinks);
    }
  }, [currentUser]);

  const getCountNotification = (type) => {
    const count = notifications.filter(
      (notification) => notification?.meta?.dashboard === type,
    );
    return count.length;
  };

  return (
    <ul className="flex flex-col gap-[10px]">
      {navLinks?.map((item, index) => (
        <li className="relative list-none" key={index}>
          {getCountNotification(item.label) > 0 && (
            <Badge count={getCountNotification(item.label)} />
          )}

          {item.external ? (
            <a
              className="flex items-center gap-4 p-[15px] rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(item.link);
              }}
            >
              <item.icon className="w-5 h-5 text-color-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />
              <span className="text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
                {t(item.label, { ns: 'sidebar' })}
              </span>
            </a>
          ) : (
            <NavLink
              to={item.link}
              activeClassName="bg-color-purple active"
              className="flex items-center gap-4 p-[15px] rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple"
            >
              <item.icon className="w-5 h-5 text-color-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />

              <span className="text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
                {t(item.label, { ns: 'sidebar' })}
              </span>
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};
