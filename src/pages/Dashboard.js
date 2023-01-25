import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import '../assets/styles/dashboard.scss'
import TutorDashboard from '../pages/Tutors/Dashboard'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../modules/auth'; 
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user.role === 'tutor' && <TutorDashboard />}
      {user.role === 'student' && <Redirect to='/student/manage-lessons' />}
    </Layout>
  )
}

export default Dashboard
