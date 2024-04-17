import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Form/Button';
import ScheduleCard from 'src/components/student-dashboard/ScheduleCardRebranding';
import Layout from 'src/layouts/DashboardLayout';

const ScheduleSuccess = ({ lesson, mentor, repeat }) => {
  const history = useHistory();

  return (
    <Layout>
      <div className="max-w-[488px] mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-8 sm:justify-center">
          <FaCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
          <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
            Lesson Scheduled
          </h1>
        </div>
        <ScheduleCard
          duration={lesson?.duration}
          lesson={lesson?.packageSubscription?.package?.course?.title}
          mentor={mentor}
          date={lesson?.startAt}
          data={lesson}
          repeat={repeat}
          fetchAppointments={() => history.push('/student/manage-lessons')}
        />
        <Button
          className="w-full h-[57px] mb-3"
          onClick={() => history.push('/student/lesson-calendar')}
        >
          View my lessons
        </Button>
        <Button
          className="w-full h-[57px]"
          theme="gray"
          onClick={() => history.push('/student/manage-lessons')}
        >
          Return to dashboard
        </Button>
      </div>
    </Layout>
  );
};

export default ScheduleSuccess;
