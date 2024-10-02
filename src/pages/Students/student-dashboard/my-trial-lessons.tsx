import type { Lesson } from '@/types/types.generated';
import DashboardCard from './dashboard-card';
import ScheduleCard from '@/components/student-dashboard/schedule-card-rebranding';

interface MyTrialLessonsProps {
  lessons: Lesson[];
  fetchAppointments: () => void;
}

export const MyTrialLessons: React.FC<MyTrialLessonsProps> = ({ lessons, fetchAppointments }) => {
  return (
    <DashboardCard title="My Trial Lessons" hrefTo="/student/lesson-calendar">
      {lessons.map((lesson) => (
        <ScheduleCard
          key={lesson.id}
          duration={lesson.duration}
          mentor={lesson.mentor}
          date={new Date(lesson.startAt)}
          data={lesson}
          fetchAppointments={fetchAppointments}
        />
      ))}
    </DashboardCard>
  );
};
