import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { logout } from '../actions/auth'
import { getUserInfo } from '../actions/user'
import Logo from '../assets/images/auth-logo.svg'
import SettingImg from '../assets/images/setting_icon.svg'
import FlagUsa from '../assets/images/flag-usa.svg'
import FlagKorea from '../assets/images/flag-korea.svg'
import LogoutImg from '../assets/images/logout_icon.svg'
import MobileMenuIcon from '../assets/images/mobile-menu.svg'
import Dropdown from './Dropdown'

import IconMyprofile from '../assets/images/sidebar/icon-myprofile.svg'
import IconUser from '../assets/images/user.svg'
import IconNavigate from '../assets/images/navigate.svg'
import IconNotification from '../assets/images/notification.svg'
import IconMyprofileActive from '../assets/images/sidebar/active-myprofile.svg'
import { readNotification } from '../actions/notification'
import {
  getItemToLocalStorage,
  setItemToLocalStorage
} from '../constants/global'

const Navbar = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const isShowSidebar = useSelector(state => state.settings.isShowSidebar)
  const user = useSelector(state => state.users.user)
  const notifications = useSelector(state => state.notification.list)
  const user_role = user.roles && user.roles[0].role_name
  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1))
  )
  const [t, i18n] = useTranslation('translation')
  useEffect(() => {
    dispatch(getUserInfo(user?.id))
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const showSidebar = () => {
    if (isShowSidebar) {
      dispatch({ type: 'HIDE_SIDEBAR' })
    } else {
      dispatch({ type: 'SHOW_SIDEBAR' })
    }
  }

  const onChangeLanguage = lang => {
    setItemToLocalStorage('language', lang)
    setLanguage(lang)
  }

  const onHandle = ({ data, id }) => {
    dispatch(readNotification)
    if (!data.type || data.type === 'complete_lesson') {
      history.push(`/student/lesson-complete/${data.group.group_id}`)
    }
  }

  useEffect(() => {
    i18n.changeLanguage(language === 0 ? 'kr' : 'en')
  }, [language])

  return (
    <div className='nav-bar'>
      <div className='desktop-version'>
        <div className='left-part'>
          {/* <div className="logo">
            <Link to={'/dashboard'}>
              <img src={Logo} alt="" />
            </Link>
          </div> */}
          {/* <Link to="/dashboard" className="page-title"> */}
          {/* {t('user_role_dashboard', { user_role: user_role })} */}
          {/* </Link> */}
          <input type='text' placeholder={t('placeholder_search_here')} />
        </div>
        <div className='right-part'>
          <Dropdown
            className='settings'
            icon={IconUser}
            items={[
              {
                label: t('my_profile'),
                icon: IconMyprofile,
                activeIcon: IconMyprofile,
                href:
                  user_role === 'tutor' ? '/tutor/profile' : '/student/profile'
              },
              { label: t('logout'), icon: LogoutImg, onClick: handleLogout }
            ]}
          />
          {/* <h5 className="me-2">{user.first_name}</h5> */}
          <Dropdown
            className='language'
            icon={language === 1 ? FlagUsa : FlagKorea}
            items={[
              {
                label: t('korean'),
                icon: FlagKorea,
                onClick: onChangeLanguage
              },
              { label: t('english'), icon: FlagUsa, onClick: onChangeLanguage }
            ]}
          />
          {/* <h5 className="me-2">
            {language === 1 ? t('english') : t('korean')}
          </h5> */}

          <Dropdown
            className='settings'
            icon={IconNotification}
            badge={notifications.length}
            items={(notifications || []).map(n => {
              return {
                role: n?.message?.data?.user?.role || 'tutor',
                name: n?.message?.data?.user?.name,
                message: n?.message?.message,
                data: n?.message?.data,
                id: n?.id
              }
            })}
            popupClassName='notifications'
            maxCount={3}
            viewMore={t('view_older')}
            renderChild={(item, index) => (
              <div key={`notification-${index}`} className='notification'>
                <div>
                  <div>
                    <span>{item.message}</span>
                    <span>
                      {t('from_role_name', {
                        role: t(item.role),
                        name: item.name
                      })}
                    </span>
                  </div>
                  <img
                    src={IconNavigate}
                    alt=''
                    onClick={() => onHandle(item)}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className='mobile-version'>
        <div className='logo'>
          <Link to={'/dashboard'}>
            <img src={Logo} alt='' />
          </Link>
        </div>
        <div className='mobile-menu'>
          <img src={MobileMenuIcon} alt='' onClick={() => showSidebar()} />
        </div>
      </div>
    </div>
  )
}

export default Navbar
