import React, { useEffect, useState } from 'react'
import { useLocation, Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../actions/auth'
import Icon1 from '../assets/images/sidebar/icon1.svg'
import Icon2 from '../assets/images/sidebar/icon2.svg'
import Icon3 from '../assets/images/sidebar/icon3.svg'
import Icon4 from '../assets/images/sidebar/icon4.svg'
import Icon5 from '../assets/images/sidebar/icon5.svg'
import Icon9 from '../assets/images/sidebar/icon9.svg'
import Icon10 from '../assets/images/sidebar/icon10.svg'
import Icon11 from '../assets/images/sidebar/icon11.svg'
import Icon12 from '../assets/images/sidebar/icon12.svg'
import Icon13 from '../assets/images/sidebar/icon13.svg'
import Icon14 from '../assets/images/sidebar/icon14.svg'
import Icon15 from '../assets/images/sidebar/icon15.svg'
import Icon16 from '../assets/images/sidebar/icon16.svg'
import Icon17 from '../assets/images/sidebar/icon17.svg'
import Icon18 from '../assets/images/sidebar/icon18.svg'
import Icon19 from '../assets/images/sidebar/icon19.svg'
import ActiveIcon1 from '../assets/images/sidebar/active1.svg'
import ActiveIcon2 from '../assets/images/sidebar/active2.svg'
import ActiveIcon3 from '../assets/images/sidebar/active3.svg'
import ActiveIcon4 from '../assets/images/sidebar/active4.svg'
import ActiveIcon5 from '../assets/images/sidebar/active5.svg'
import ActiveIcon9 from '../assets/images/sidebar/active9.svg'
import ActiveIcon10 from '../assets/images/sidebar/active10.svg'
import ActiveIcon11 from '../assets/images/sidebar/active11.svg'
import ActiveIcon12 from '../assets/images/sidebar/active12.svg'
import ActiveIcon13 from '../assets/images/sidebar/active13.svg'
import ActiveIcon14 from '../assets/images/sidebar/active14.svg'
import ActiveIcon15 from '../assets/images/sidebar/active15.svg'
import ActiveIcon16 from '../assets/images/sidebar/active16.svg'
import ActiveIcon17 from '../assets/images/sidebar/active17.svg'
import ActiveIcon18 from '../assets/images/sidebar/active18.svg'
import ActiveIcon19 from '../assets/images/sidebar/active19.svg'
import CloseIcon from '../assets/images/close.svg'
import LogoutImg from '../assets/images/logout_icon.svg'
import { useTranslation } from 'react-i18next'

const tutorNavLinks = [
  {
    label: 'manage_appointments',
    link: '/tutor/manage-appointments',
    icon: Icon1,
    activeIcon: ActiveIcon1
  },
  {
    label: 'appointment_calendar',
    link: '/tutor/appointments-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2
  },
  {
    label: 'check_requests',
    link: '/approve-requests',
    icon: Icon11,
    activeIcon: ActiveIcon11
  },
  {
    label: 'my_availability',
    link: '/tutor/availability',
    icon: Icon19,
    activeIcon: ActiveIcon19
  },
  {
    label: 'student_list',
    link: '/tutor/students',
    icon: Icon4,
    activeIcon: ActiveIcon4
  },
  {
    label: 'messages',
    link: '/messages',
    icon: Icon5,
    activeIcon: ActiveIcon5
  },
  // { label: 'class_materials', link: '/tutor/class-materials', icon: Icon10, activeIcon: Icon10 },
  {
    label: 'payment',
    link: '/tutor/payment-page',
    icon: Icon12,
    activeIcon: ActiveIcon12
  }
  // { divider: true },
  // { label: 'feedback', link: '/feedback', icon: Icon14, activeIcon: ActiveIcon14 }
]

const studentNavLinks = [
  {
    label: 'manage_lessons',
    link: '/student/manage-lessons',
    icon: Icon1,
    activeIcon: ActiveIcon1
  },
  {
    label: 'lesson_calendar',
    link: '/student/lesson-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2
  },
  // { label: 'past_lessons', link: '/student/past-lessons', icon: Icon3, activeIcon: ActiveIcon3 },
  {
    label: 'messages',
    link: '/messages',
    icon: Icon5,
    activeIcon: ActiveIcon5
  },
  {
    label: 'favorite_tutors',
    link: '/student/favorite-tutors',
    icon: Icon9,
    activeIcon: ActiveIcon9
  },
  // { label: 'class_materials', link: '/student/class-materials', icon: Icon10, activeIcon: ActiveIcon10 },
  {
    label: 'packages',
    link: '/student/packages',
    icon: Icon11,
    activeIcon: ActiveIcon11
  }
  // { divider: true },
  // { label: 'support', link: '/support', icon: Icon13, activeIcon: ActiveIcon13 },
  // { label: 'feedback', link: '/feedback', icon: Icon14, activeIcon: ActiveIcon14 },
  // { label: 'faq', link: '/faq', icon: Icon15, activeIcon: ActiveIcon15 }
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
    label: 'appointment_calendar',
    link: '/admin/lesson-calendar',
    icon: Icon2,
    activeIcon: ActiveIcon2
  }
]

const Sidebar = () => {
  let location = useLocation()
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')
  const dispatch = useDispatch()
  const isShowSidebar = useSelector(state => state.settings.isShowSidebar)
  const user = useSelector(state => state.users.user)
  const user_role = user.roles && user.roles[0].role_name

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

  const [navLinks, setNavLinks] = useState()

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
    dispatch(logout())
    history.push('/')
  }

  const hideSidebar = () => {
    dispatch({ type: 'HIDE_SIDEBAR' })
  }

  return (
    <>
      <div className="side-bar desktop-version">
        <h4 className="main-title">{t('navigation')}</h4>
        <div className="divider" />
        <div className="link-list">
          {navLinks &&
            navLinks.map((item, index) =>
              item.divider ? (
                <div key={`divider-${index}`} className="divider" />
              ) : (
                <li
                  className={`nav-item ${item.is_selected ? 'active' : ''}`}
                  key={index}
                >
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
                    <span>{t(item.label)}</span>
                  </Link>
                </li>
              )
            )}
        </div>
      </div>
      {isShowSidebar ? (
        <div className="side-bar mobile-version">
          <h4 className="main-title">{t('navigation')}</h4>
          <img
            src={CloseIcon}
            alt=""
            className="close-icon"
            onClick={() => hideSidebar()}
          />
          <div className="divider" />
          <div className="link-list">
            {navLinks &&
              navLinks.map((item, index) => (
                <li
                  className={`nav-item ${item.is_selected ? 'active' : ''}`}
                  key={index}
                >
                  <Link to={item.link} onClick={() => hideSidebar()}>
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
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            <li className="nav-item log-out" onClick={() => handleLogout()}>
              <div className="icon">
                <img src={LogoutImg} alt="" />
              </div>
              <span>{t('logout')}</span>
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
