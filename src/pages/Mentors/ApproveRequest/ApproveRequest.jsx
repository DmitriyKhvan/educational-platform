import Layout from '../../../components/Layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../modules/auth';
import { useQuery } from '@apollo/client';

import { APPOINTMENTS_QUERY } from 'src/modules/auth/graphql';

import 'src/assets/styles/calendar.scss';
import Loader from '../../../components/Loader/Loader';
import Button from 'src/components/Form/Button';
import { ApproveRequestLessons } from './ApproveRequestLessons';
import { LessonsStatusType } from 'src/constants/global';

const ApproveRequest = () => {
  const { user } = useAuth();
  const [t] = useTranslation('lessons');

  const [selectedTab, setSelectedTab] = useState('newLessons');
  const [newLessons, setNewLessons] = useState([]);
  const [rescheduleLessons, setRescheduleLessons] = useState([]);
  const [currentlessons, setCurrentLessons] = useState([]);

  const {
    data: appointments,
    loading,
    refetch: refetchAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status: 'scheduled,rescheduled',
    },
    fetchPolicy: 'no-cache',
  });

  const onClickNewLessons = () => {
    setSelectedTab('newLessons');
    setCurrentLessons(newLessons);
  };

  const onClickRescheduleLessons = () => {
    setSelectedTab('rescheduleLessons');
    setCurrentLessons(rescheduleLessons);
  };

  useEffect(() => {
    if (appointments) {
      const newLessons = [];
      const rescheduleLessons = [];

      appointments?.lessons
        .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
        .forEach((lesson) => {
          const lessonTansform = {
            id: lesson.id,
            img: lesson?.student?.avatar?.url,
            studentName: `${lesson?.student?.firstName} ${lesson?.student?.lastName}`,
            lessonNumber: lesson.id,
            lessonDate: lesson.startAt,
            duration: lesson.duration,
          };
          if (lesson.status === LessonsStatusType.SCHEDULED) {
            newLessons.push(lessonTansform);
          } else {
            rescheduleLessons.push(lessonTansform);
          }
        });
      setCurrentLessons(
        selectedTab === 'newLessons' ? newLessons : rescheduleLessons,
      );
      setNewLessons(newLessons);
      setRescheduleLessons(rescheduleLessons);
    }
  }, [appointments]);

  return (
    <Layout>
      {loading && <Loader height="calc(100vh - 80px)" />}
      <div className="main-dashboard p-3">
        <h4 className="title mb-2">{t('appointment_requests')}</h4>

        <div className="w-auto flex items-center mb-4">
          <Button
            theme="outline"
            className={`ml-0 rounded-r-none focus:shadow-none ${
              selectedTab === 'newLessons' && 'bg-color-purple text-white'
            }`}
            onClick={onClickNewLessons}
          >
            <span>New Lessons</span>
          </Button>
          <Button
            theme="outline"
            className={`ml-[-4px] rounded-l-none focus:shadow-none ${
              selectedTab === 'rescheduleLessons' &&
              'bg-color-purple text-white'
            }`}
            onClick={onClickRescheduleLessons}
          >
            <span>Reschedule Lessons</span>
          </Button>
        </div>

        <ApproveRequestLessons
          lessons={currentlessons}
          refetchAppointments={refetchAppointments}
        />
      </div>
    </Layout>
  );
};

export default ApproveRequest;
