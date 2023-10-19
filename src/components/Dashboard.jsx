import React from 'react';
import Layout from './Layout';
import TutorDashboard from '../pages/Mentors/MentorDashboard';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import '../assets/styles/dashboard.scss';
import { ROLES } from 'src/constants/global';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user.role === ROLES.MENTOR && <TutorDashboard />}
      {user.role === ROLES.STUDENT && <Redirect to="/student/manage-lessons" />}
    </Layout>
  );
};

export default Dashboard;
