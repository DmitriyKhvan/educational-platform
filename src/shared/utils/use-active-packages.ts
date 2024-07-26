import { PACKAGE_QUERY } from '@/shared/apollo/graphql';
import { getItemToLocalStorage } from '@/shared/constants/global';
import type { Query } from '@/types/types.generated';
import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';

export const useActivePackages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data } = useQuery<Query>(PACKAGE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      studentId: getItemToLocalStorage('studentId', ''),
    },
  });

  const activePackages = useMemo(() => {
    if (data) {
      const activePackages = data.packageSubscriptions?.filter((pkg) => !!pkg?.credits);
      setIsLoading(false);
      return activePackages;
    }
  }, [data]);

  return { activePackages, isLoading };
};
