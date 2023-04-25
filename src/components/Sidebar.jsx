import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../modules/auth'
import CloseIcon from '../assets/images/close.svg'
import Logo from '../assets/images/logo.png'
import LogoutImg from '../assets/images/logout_icon.svg'
import referIcon from '../assets/images/referIconActive.png'
import referActiveIcon from '../assets/images/referIconActive.png'
import whiteCalendar from '../assets/images/sidebar/active-calendar.png'
import Icon16 from '../assets/images/sidebar/icon16.svg'
import Icon17 from '../assets/images/sidebar/icon17.svg'
import Icon18 from '../assets/images/sidebar/icon18.svg'
import Icon1 from '../assets/images/sidebar/purple_dashboard_icon.svg'
import tutorIcon from '../assets/images/sidebar/purple_tutor_icon.svg'
import tutorActiveIcon from '../assets/images/sidebar/white_tutor_icon.svg'
import Icon2 from '../assets/images/sidebar/purple_lesson_icon.svg'
import Icon11 from '../assets/images/sidebar/purple_subscription_icon.svg'
import MessageIcon from '../assets/images/sidebar/purple_message_icon.svg'
import MessageActiveIcon from '../assets/images/sidebar/white_message_icon.svg'
import purpleCalendar from '../assets/images/sidebar/calendar.png'
import GameIcon from '../assets/images/sidebar/game-menuitem.svg'
import GameIconFilled from '../assets/images/sidebar/game-menuitem-filled.svg'
import ClassMaterialIcon from '../assets/images/sidebar/class_materials.svg'
// import purplePayment from '../assets/images/sidebar/payment.png'
// import whitePayment from '../assets/images/sidebar/active-payment.png'
// import purpleStudentList from '../assets/images/sidebar/student-list.png'
// import whiteStudentList from '../assets/images/sidebar/active-student-list.png'

import ActiveIcon1 from '../assets/images/sidebar/white_dashboard_icon.svg'
import ActiveIcon2 from '../assets/images/sidebar/white_lesson_icon.svg'
// import ActiveIcon4 from '../assets/images/sidebar/active4.svg'
// import ActiveIcon5 from '../assets/images/sidebar/white_message_icon.svg'
// import ActiveIcon9 from '../assets/images/sidebar/white_tutor_icon.svg'
import ActiveIcon11 from '../assets/images/sidebar/white_subscription_icon.svg'
// import ActiveIcon12 from '../assets/images/sidebar/active12.svg'
import ActiveIcon16 from '../assets/images/sidebar/active16.svg'
import ActiveIcon17 from '../assets/images/sidebar/active17.svg'
import ActiveIcon18 from '../assets/images/sidebar/active18.svg'
// import ActiveIcon19 from '../assets/images/sidebar/active19.svg'
// import whiteClassMaterialIcon from '../assets/images/sidebar/white_class_material_icon.svg'
// import purpleClassMaterialIcon from '../assets/images/sidebar/purple_class_material_icon.svg'
// import whiteHomeworklIcon from '../assets/images/sidebar/white_homework_icon.svg'
// import purpleHomeworklIcon from '../assets/images/sidebar/purple_homework_icon.svg'
// import whiteSupportlIcon from '../assets/images/sidebar/white_support_icon.svg'
// import purpleSupportlIcon from '../assets/images/sidebar/purple_support_icon.svg'
// import whiteFeedbacklIcon from '../assets/images/sidebar/white_feedback_icon.svg'
// import purpleFeedbacklIcon from '../assets/images/sidebar/purple_feedback_icon.svg'
// import whiteRewardlIcon from '../assets/images/sidebar/white_reward_icon.svg'
// import purpleRewardlIcon from '../assets/images/sidebar/purple_reward_icon.svg'
import { classMaterialURL, gameLinkURL } from '../constants/global'

const tutorNavLinks = [
  {
    label: 'manage_appointments',
    link: '/tutor/manage-appointments',
    icon: Icon1,
    activeIcon: ActiveIcon1
  },
  {
    label: 'lessons',
    link: '/tutor/appointments-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2
  },
  {
    label: 'students',
    link: '/tutor/students-list',
    icon: tutorIcon,
    activeIcon: tutorActiveIcon
  },
  // {
  //   label: "Messages",
  //   link:"/messages/",
  //   icon:MessageIcon,
  //   activeIcon:MessageActiveIcon
  // },
  {
    label: 'check_requests',
    link: '/approve-requests',
    icon: Icon11,
    activeIcon: ActiveIcon11
  },
  {
    label: 'my_availability',
    link: '/tutor/availability',
    icon: purpleCalendar,
    activeIcon: whiteCalendar
  }
  // {
  //   label: 'student_list',
  //   link: '/tutor/students',
  //   icon: purpleStudentList,
  //   activeIcon: whiteStudentList
  // },
  // {
  //   label: 'messages',
  //   link: '/messages',
  //   icon: Icon5,
  //   activeIcon: ActiveIcon5
  // },
  // { label: 'class_materials', link: '/tutor/class-materials', icon: Icon10, activeIcon: Icon10 },
  // {
  //   label: 'payment',
  //   link: '/tutor/payment-page',
  //   icon: purplePayment,
  //   activeIcon: whitePayment
  // }
  // { divider: true },
  // { label: 'feedback', link: '/feedback', icon: Icon14, activeIcon: ActiveIcon14 }
]

const studentNavLinks = [
  {
    label: 'dashboard',
    link: '/student/manage-lessons',
    icon: Icon1,
    activeIcon: ActiveIcon1
  },
  {
    label: 'lessons',
    link: '/student/lesson-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2
  },
  // {
  //   label: "Messages",
  //   link:"/messages/",
  //   icon:MessageIcon,
  //   activeIcon:MessageActiveIcon
  // },
  {
    label: 'mentors',
    link: '/student/mentors-list',
    icon: tutorIcon,
    activeIcon: tutorActiveIcon
  },
  {
    label: 'refer',
    link: '/student/referal',
    icon: Icon1,
    activeIcon: referActiveIcon
  },
  // {
  //   label: 'games',
  //   link: gameLinkURL,
  //   icon: GameIcon,
  //   activeIcon: GameIconFilled,
  //   external: true
  // },
  {
    label: 'class_material',
    link: classMaterialURL || 'https://naonow.instructure.com/',
    icon: ClassMaterialIcon,
    activeIcon: ClassMaterialIcon,
    external: true
  },
  // {
  //   label: 'messages',
  //   link: '/messages',
  //   icon: Icon5,
  //   activeIcon: ActiveIcon5
  // },
  // {
  //   label: 'favorite_tutors',
  //   link: '/student/favorite-tutors',
  //   icon: Icon9,
  //   activeIcon: ActiveIcon9
  // },
  // {
  //   label: 'sidebar_homework_title',
  //   link: '/',
  //   icon: purpleHomeworklIcon,
  //   activeIcon: whiteHomeworklIcon
  // },
  // {
  //   label: 'packages',
  //   link: '/student/packages',
  //   icon: Icon11,
  //   activeIcon: ActiveIcon11
  // },
  { divider: true }
  // {
  //   label: 'support',
  //   link: '/support',
  //   icon: purpleSupportlIcon,
  //   activeIcon: whiteSupportlIcon
  // },
  // {
  //   label: 'feedback',
  //   link: '/feedback',
  //   icon: purpleFeedbacklIcon,
  //   activeIcon: whiteFeedbacklIcon
  // },
  // {
  //   label: 'faq',
  //   link: '/faq',
  //   icon: purpleRewardlIcon,
  //   activeIcon: whiteRewardlIcon
  // }
]

const adminNavLinks = [
  {
    label: 'tutor_list',
    link: '/admin/tutor-list',
    icon: Icon16,
    activeIcon: ActiveIcon16
  },
  {
    label: 'student_list',
    link: '/admin/student-list',
    icon: Icon17,
    activeIcon: ActiveIcon17
  },
  {
    label: 'admin',
    link: '/admin/main',
    icon: Icon18,
    activeIcon: ActiveIcon18
  },
  {
    label: 'lessons',
    link: '/admin/lesson-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2
  }
]

const Sidebar = () => {
  let location = useLocation()
  const history = useHistory()
  const [t] = useTranslation(['common', 'sidebar'])
  const dispatch = useDispatch()
  const isShowSidebar = useSelector(state => state.settings.isShowSidebar)

  const { user: CurrentUser, logout } = useAuth()

  const user_role = CurrentUser.role && CurrentUser.role

  tutorNavLinks.map(item => {
    item.is_selected = location.pathname.includes(item.link)
    return item
  })

  studentNavLinks.map(item => {
    item.is_selected = location.pathname.includes(item.link)
    return item
  })

  adminNavLinks.map(item => {
    item.is_selected = location.pathname.includes(item.link)
    return item
  })

  const [navLinks, setNavLinks] = useState([])

  useEffect(() => {
    if (user_role === 'tutor') {
      setNavLinks(tutorNavLinks)
    } else if (user_role === 'student') {
      setNavLinks(studentNavLinks)
    } else if (user_role === 'admin') {
      setNavLinks(adminNavLinks)
    }
  }, [user_role])

  const handleLogout = () => {
    logout()
    history.push('/')
  }

  const hideSidebar = () => {
    dispatch({ type: 'HIDE_SIDEBAR' })
  }

  return (
    <>
      <div className='side-bar desktop-version'>
        <img
          onClick={() => history.push('/')}
          src={Logo}
          className='sidebar-logo'
          alt=''
        />
        <div className='link-list'>
          {navLinks &&
            navLinks.map((item, index) =>
              item.divider ? (
                <div key={`divider-${index}`} className='divider' />
              ) : (
                <li
                  className={`nav-item ${item.is_selected ? 'active' : ''}`}
                  key={index}
                >
                  {item.external ? (
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault()
                        window.open(item.link)
                      }}
                    >
                      <div className='icon'>
                        <img
                          src={item.activeIcon}
                          alt=''
                          className={item.is_selected ? 'block' : 'none'}
                        />
                        <img
                          src={item.icon}
                          alt=''
                          className={!item.is_selected ? 'block' : 'none'}
                        />
                      </div>
                      <span>{t(item.label, { ns: 'sidebar' })}</span>
                    </a>
                  ) : (
                    <Link to={item.link}>
                      <div className='icon'>
                        <img
                          src={item.activeIcon}
                          alt=''
                          className={item.is_selected ? 'block' : 'none'}
                        />
                        <img
                          src={item.icon}
                          alt=''
                          className={!item.is_selected ? 'block' : 'none'}
                        />
                      </div>
                      <span>{t(item.label, { ns: 'sidebar' })}</span>
                    </Link>
                  )}
                </li>
              )
            )}
        </div>
      </div>
      {isShowSidebar ? (
        <div className='side-bar mobile-version'>
          <h4 className='main-title'>{t('navigation', { ns: 'sidebar' })}</h4>
          <img
            src={CloseIcon}
            alt=''
            className='close-icon'
            onClick={() => hideSidebar()}
          />
          <div className='divider' />
          <div className='link-list'>
            {navLinks &&
              navLinks.map((item, index) => (
                <li
                  className={`nav-item ${item.is_selected ? 'active' : ''}`}
                  key={index}
                >
                  <Link to={item.link} onClick={() => hideSidebar()}>
                    <div className='icon'>
                      <img
                        src={item.activeIcon}
                        alt=''
                        className={item.is_selected ? 'block' : 'none'}
                      />
                      <img
                        src={item.icon}
                        alt=''
                        className={!item.is_selected ? 'block' : 'none'}
                      />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            <li className='nav-item log-out' onClick={() => handleLogout()}>
              <div className='icon'>
                <img src={LogoutImg} alt='' />
              </div>
              <span>{t('logout', { ns: 'common' })}</span>
            </li>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default Sidebar
