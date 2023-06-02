import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Layout from '../../components/Layout';
import { useAuth } from '../../modules/auth';
import SwitchProfile from './SwitchProfile';

export const ProfileLayout = () => {
  const history = useHistory();
  const { user: CurrentUser } = useAuth();

  useEffect(() => {
    if (CurrentUser && CurrentUser.role) {
      if (CurrentUser.role === 'tutor') {
        history.push('/tutor/profile');
      } else if (CurrentUser.role === 'student') {
        history.push('/student/profile');
      }
    }
  }, [CurrentUser]);

  return (
    <Layout fluid={true}>
      <div className="scroll-layout">
        {CurrentUser && <SwitchProfile user={CurrentUser} />}
      </div>
    </Layout>
  );
};
