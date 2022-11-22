import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, {
  useEffect,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getUserById } from '../../actions/admin';
import { getUserInfo } from '../../actions/user';
import Layout from '../../components/Layout';
import Profile from './Profile';

export const ProfileLayout = ({ user_id }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const user = useSelector(state =>
    user_id ? state.admin.user : state.users.user
  )
  const [isTutor, setIsTutor] = useState(null)

  useEffect(() => {
    if (user_id) dispatch(getUserById(user_id))
    else dispatch(getUserInfo())
  }, [dispatch])

  useEffect(() => {
    if (user && user.roles) {
      if (user.roles[0].role_name === 'tutor') {
        setIsTutor(true)
        history.push('/tutor/profile')
      } else if (user.roles[0].role_name === 'student') {
        setIsTutor(false)
      } else {
        setIsTutor(null)
      }
    }
  }, [user])

  return (
    <Layout fluid={true}>
      {/* {isTutor !== null && (
        <h4 className='main-title Custom-main-title'>
          {isTutor ? t('tutor_profile') : t('student_profile')}
        </h4>
      )}
      <div className='divider' /> */}
      <div className='scroll-layout'>{user && <Profile user={user} />}</div>
    </Layout>
  )
}

