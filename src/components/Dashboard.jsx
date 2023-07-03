import React from 'react';
import Layout from './Layout';
import TutorDashboard from '../pages/Mentors/MentorDashboard';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import '../assets/styles/dashboard.scss';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user.role === 'mentor' && <TutorDashboard />}
      {user.role === 'student' && <Redirect to="/student/manage-lessons" />}
    </Layout>
  );
};

export default Dashboard;
