import { PUBLIC_MENTOR_LIST } from '@/shared/apollo/queries/mentors/public-mentor-list';
import type { Query } from '@/types/types.generated';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

export const usePublicMentors = () => {
  const { data } = useQuery<Query>(PUBLIC_MENTOR_LIST, {
    fetchPolicy: 'network-only',
  });

  const { publicMentorList: trialMentors } = data || {};

  const [trialMentorsDic, setTrialMentorsDic] = useState<
    | {
        value: string | undefined;
        label: string;
      }[]
    | undefined
  >([]);

  useEffect(() => {
    if (trialMentors) {
      const trialMentorsDic = trialMentors.map((mentor) => {
        return {
          value: mentor?.id,
          label: `${mentor?.firstName} ${mentor?.lastName}`,
        };
      });

      setTrialMentorsDic(trialMentorsDic);
    }
  }, [trialMentors]);

  return trialMentorsDic;
};
