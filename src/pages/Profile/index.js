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
import { useAuth } from '../../modules/auth';

export const ProfileLayout = ({ user_id }) => {
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')
  const user = useSelector(state =>
    user_id ? state.admin.user : state.users.user
  )

  const { user: CurrentUser } = useAuth()

  const [isTutor, setIsTutor] = useState(null)

  // useEffect(() => {
  //   if (user_id) dispatch(getUserById(user_id))
  //   else dispatch(getUserInfo())
  // }, [dispatch, user_id])

  // useEffect(() => {
  //   if (user && user.roles) {
  //     if (user.roles[0].role_name === 'tutor') {
  //       setIsTutor(true)
  //       history.push('/tutor/profile')
  //     } else if (user.roles[0].role_name === 'student') {
  //       setIsTutor(false)
  //     } else {
  //       setIsTutor(null)
  //     }
  //   }
  // }, [user])

  return (
    <Layout fluid={true}>
      <div className='scroll-layout'>{CurrentUser && <Profile user={CurrentUser} />}</div>
    </Layout>
  )
}

