import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { PUBLIC_MENTOR_LIST } from 'src/shared/apollo/queries/mentors/publicMentorList';

export const usePublicMentors = () => {
  const { data: { publicMentorList: trialMentors } = [] } = useQuery(
    PUBLIC_MENTOR_LIST,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [trialMentorsDic, setTrialMentorsDic] = useState([]);

  useEffect(() => {
    if (trialMentors) {
      const trialMentorsDic = trialMentors.map((mentor) => {
        return {
          value: mentor.id,
          label: `${mentor.firstName} ${mentor.lastName}`,
        };
      });

      setTrialMentorsDic(trialMentorsDic);
    }
  }, [trialMentors]);

  return trialMentorsDic;
};
