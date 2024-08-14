import React from 'react';
import DashboardCard from './DashboardCard';
import ScheduleCard from 'src/components/student-dashboard/ScheduleCardRebranding';

export const MyTrialLessons = ({ lessons, fetchAppointments }) => {
  return (
    <DashboardCard title="My Trial Lessons" hrefTo="/student/lesson-calendar">
      {lessons.map((lesson) => (
        <ScheduleCard
          key={lesson.id}
          duration={lesson.duration}
          lesson={lesson?.packageSubscription?.package?.course?.title}
          mentor={lesson.mentor}
          playground={lesson?.playground}
          date={new Date(lesson.startAt)}
          data={lesson}
          fetchAppointments={fetchAppointments}
        />
      ))}
    </DashboardCard>
  );
};
