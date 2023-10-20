import React from 'react';
import Layout from './Layout';
import TutorDashboard from '../pages/Mentors/MentorDashboard';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import '../assets/styles/dashboard.scss';
import { Roles } from 'src/constants/global';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user.role === Roles.MENTOR && <TutorDashboard />}
      {user.role === Roles.STUDENT && <Redirect to="/student/manage-lessons" />}
    </Layout>
  );
};

export default Dashboard;
