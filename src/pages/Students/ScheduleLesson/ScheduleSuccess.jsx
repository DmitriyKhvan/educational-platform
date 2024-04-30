import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Form/Button';
import Indicator from 'src/components/Indicator';
import ScheduleCard from 'src/components/student-dashboard/ScheduleCardRebranding';
import Layout from 'src/layouts/DashboardLayout';

const ScheduleSuccess = ({ lessons, repeat }) => {
  const [t] = useTranslation('modals');
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
        {lessons && (
          <ScheduleCard
            duration={lessons[0]?.duration}
            lesson={lessons[0]?.packageSubscription?.package?.course?.title}
            mentor={lessons[0]?.mentor}
            date={lessons[0]?.startAt}
            data={lessons[0]}
            repeat={repeat}
            fetchAppointments={() => history.push('/student/manage-lessons')}
          />
        )}

        {lessons.find((l) => !l.status) && (
          <div className="my-10">
            <p className="text-sm text-color-light-grey mb-4">
              No lessons these days
            </p>
            {lessons
              .filter((l) => !l.status)
              .map((l) => (
                <div
                  key={l.id}
                  className="flex justify-between items-center text-color-dark-violet font-bold text-[15px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)] border border-color-border-grey p-4 rounded-[10px]"
                >
                  <h3>{format(new Date(l.startAt), 'MMMM do')}</h3>
                  <Indicator className="bg-color-purple text-color-purple">
                    {t(l.cancelReason)}
                  </Indicator>
                </div>
              ))}
          </div>
        )}
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
