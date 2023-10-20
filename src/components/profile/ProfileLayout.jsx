import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import React, { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Layout from '../Layout';
import { useAuth } from '../../modules/auth';
import SwitchProfile from './SwitchProfile';
import { Roles } from 'src/constants/global';

export const ProfileLayout = () => {
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role) {
      if (user.role === Roles.MENTOR) {
        history.push('/mentor/profile');
      } else if (user.role === Roles.STUDENT) {
        history.push('/student/profile');
      }
    }
  }, [user]);

  return (
    <Layout fluid={true}>
      <div className="scroll-layout">
        {user && <SwitchProfile user={user} />}
      </div>
    </Layout>
  );
};
