/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { MentorAvailabilityType } from '../../../constants/global';
import Layout from '../../../layouts/DashboardLayout';

import { v4 as uuid } from 'uuid';
import { useAuth } from '../../../modules/auth';
import { useQuery } from '@apollo/client';
import { GET_MENTOR } from '../../../modules/auth/graphql';
import Loader from 'src/components/Loader/Loader';
import { AcceptingStudents } from '../AcceptingStudents';
import { AvailabilityExceptions } from '../AvailabilityExceptions/AvailabilityExceptions';
import { AvailabilitySlots } from './AvailabilitySlots';
import { Tab } from './Tab';
import Tabs from './Tabs';
import AvailabilityCalendar from './AvailabilityCalendar/AvailabilityCalendar';

const Availability = () => {
  const { user } = useAuth();
  const [mentorAvailabilityType, setMentorAvailabilityType] = useState();

  const [selectedView, setSelectedView] = useState('list');

  const {
    data: { mentor: mentorInfo } = {},
    loading: loadingMentor,
    refetch: refetchMentor,
  } = useQuery(GET_MENTOR, {
    fetchPolicy: 'no-cache',
    variables: { id: user?.mentor?.id },
  });

  const [gatherAvailabilities, setGatherAvailabilities] = useState({
    [MentorAvailabilityType.ONLY_REGULAR]: [],
    [MentorAvailabilityType.ONLY_TRIAL]: [],
  });

  const initializeAvailabilities = (availabilities, mentorAvailabilityType) => {
    const parseAvailabilities = availabilities.map((slot) => {
      return {
        id: uuid(),
        day: slot.day,
        slots: [slot],
      };
    });

    setGatherAvailabilities((gatherAvailabilities) => {
      return {
        ...gatherAvailabilities,
        [mentorAvailabilityType]: parseAvailabilities,
      };
    });
  };

  useEffect(() => {
    if (mentorInfo) {
      const mentorType =
        mentorInfo.mentorAvailability === MentorAvailabilityType.ONLY_REGULAR ||
        mentorInfo.mentorAvailability ===
          MentorAvailabilityType.REGULAR_AND_TRIAL
          ? MentorAvailabilityType.ONLY_REGULAR
          : MentorAvailabilityType.ONLY_TRIAL;

      setMentorAvailabilityType(mentorType);
    }

    if (mentorInfo?.availabilities?.regular.length) {
      initializeAvailabilities(
        mentorInfo.availabilities.regular,
        MentorAvailabilityType.ONLY_REGULAR,
      );
    }

    if (mentorInfo?.availabilities?.trial.length) {
      initializeAvailabilities(
        mentorInfo.availabilities.trial,
        MentorAvailabilityType.ONLY_TRIAL,
      );
    }
  }, [mentorInfo]);

  const useSetGatherAvailabilities = (data) => {
    setGatherAvailabilities((gatherAvailabilities) => {
      return {
        ...gatherAvailabilities,
        [mentorAvailabilityType]: data,
      };
    });
  };

  if (loadingMentor) {
    return <Loader height="calc(100vh - 80px)" />;
  }

  return (
    <Layout>
      <div className="space-y-10">
        <h2 className="text-[32px] text-color-dark-purple font-bold leading-9">
          My Availability
        </h2>

        <Tabs
          mentorInfo={mentorInfo}
          mentorAvailabilityType={mentorAvailabilityType}
          setMentorAvailabilityType={setMentorAvailabilityType}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />

        {selectedView === 'list' ? (
          <>
            {mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR && (
              <AcceptingStudents />
            )}

            <div className="flex flex-wrap gap-6">
              <AvailabilitySlots
                mentorInfo={mentorInfo}
                gatherAvailabilities={gatherAvailabilities}
                mentorAvailabilityType={mentorAvailabilityType}
                useSetGatherAvailabilities={useSetGatherAvailabilities}
              />

              <AvailabilityExceptions
                mentor={mentorInfo}
                refetchMentor={refetchMentor}
              />
            </div>
          </>
        ) : (
          <AvailabilityCalendar
            gatherAvailabilities={gatherAvailabilities}
            mentorInfo={mentorInfo}
            refetchMentor={refetchMentor}
          />
        )}
      </div>
    </Layout>
  );
};

export default Availability;
