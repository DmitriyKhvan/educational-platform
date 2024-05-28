import { useState, useEffect } from 'react';
import { Roles, classMaterialURL } from 'src/shared/constants/global';
import { useAuth } from 'src/app/providers/AuthProvider';

import { GoHomeFill } from 'react-icons/go';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { HiGift } from 'react-icons/hi2';
import { FaGraduationCap } from 'react-icons/fa6';
import { IoLibrarySharp } from 'react-icons/io5';
import { MdOutlineGroups } from 'react-icons/md';
import { ModalPurchase } from 'src/components/ModalPurchase';
import { Info } from 'src/components/ReferBanner/ui/Info';

const mentorNavLinks = [
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
    type: 'trial',
    modal: <ModalPurchase />,
  },
  {
    label: 'subscriptions',
    link: '/student/subscriptions',
    icon: HiGift,
  },
  {
    label: 'refer',
    link: '#',
    icon: MdOutlineGroups,
    type: 'modal',
    modal: <Info />,
  },
  {
    label: 'class_material',
    link: classMaterialURL || 'https://naonow.instructure.com/',
    icon: IoLibrarySharp,
    type: 'external',
  },
];

export const useMenuList = () => {
  const { user } = useAuth();
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    if (user.role === Roles.MENTOR) {
      setNavLinks(mentorNavLinks);
    } else if (user.role === Roles.STUDENT) {
      setNavLinks(studentNavLinks);
    }
  }, [user]);

  return navLinks;
};
