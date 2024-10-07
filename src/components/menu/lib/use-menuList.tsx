import { useAuth } from '@/app/providers/auth-provider';
import { classMaterialURL } from '@/shared/constants/global';
import { useEffect, useState } from 'react';

import { ModalPurchase } from '@/components/modal-purchase';
import { Info } from '@/components/refer-banner/ui/info';
import type { IconType } from 'react-icons';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa6';
import { GoHomeFill } from 'react-icons/go';
import { IoGiftOutline } from 'react-icons/io5';
import { MdEventNote, MdLibraryBooks, MdOutlineShoppingBag } from 'react-icons/md';
import { UserRoleType } from '@/types/types.generated';

export interface MentorNavLink {
  label: string;
  link: string;
  notificationType?: string;
  icon: IconType;
  type: undefined;
}

export interface StudentNavLink {
  label: string;
  link: string;
  type?: 'trial' | 'modal' | 'external';
  modal?: JSX.Element;
  icon: IconType;
  notificationType: undefined;
}

const mentorNavLinks: MentorNavLink[] = [
  {
    label: 'manage_appointments',
    link: '/mentor/manage-appointments',
    icon: GoHomeFill,
    type: undefined,
  },
  {
    label: 'lessons',
    link: '/mentor/lesson-calendar',
    notificationType: 'check_requests', //for notifications filter
    icon: FaRegCalendarAlt,
    type: undefined,
  },
  {
    label: 'my_availability',
    link: '/mentor/availability',
    icon: FaRegCalendarAlt,
    type: undefined,
  },
];

const studentNavLinks: StudentNavLink[] = [
  {
    label: 'dashboard',
    link: '/student/manage-lessons',
    icon: GoHomeFill,
    notificationType: undefined,
  },
  {
    label: 'lessons',
    link: '/student/lesson-calendar',
    icon: MdEventNote,
    notificationType: undefined,
  },
  {
    label: 'mentors',
    link: '/student/mentors-list',
    icon: FaGraduationCap,
    type: 'trial',
    modal: <ModalPurchase />,
    notificationType: undefined,
  },
  {
    label: 'purchase',
    link: '/student/subscriptions',
    icon: MdOutlineShoppingBag,
    notificationType: undefined,
  },
  {
    label: 'free_classes',
    link: '#',
    icon: IoGiftOutline,
    type: 'modal',
    modal: <Info />,
    notificationType: undefined,
  },
  {
    label: 'class_material',
    link: classMaterialURL || 'https://naonow.instructure.com/',
    icon: MdLibraryBooks,
    type: 'external',
    notificationType: undefined,
  },
];

export const useMenuList = () => {
  const { user } = useAuth();
  const [navLinks, setNavLinks] = useState<MentorNavLink[] | StudentNavLink[]>([]);

  useEffect(() => {
    if (user?.role === UserRoleType.Mentor) {
      setNavLinks(mentorNavLinks);
    } else if (user?.role === UserRoleType.Student) {
      setNavLinks(studentNavLinks);
    }
  }, [user]);

  return navLinks;
};
