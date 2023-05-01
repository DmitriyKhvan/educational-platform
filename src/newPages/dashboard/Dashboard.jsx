import React from 'react';
import Layout from '../../components/Layout';
import TutorDashboard from './mentor/MentorDashboard';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import '../../assets/styles/dashboard.scss';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user.role === 'tutor' && <TutorDashboard />}
      {user.role === 'student' && <Redirect to="/student/manage-lessons" />}
    </Layout>
  );
};

export default Dashboard;
