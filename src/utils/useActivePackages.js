import { useQuery } from '@apollo/client';
import { useState, useMemo } from 'react';
import { getItemToLocalStorage } from 'src/constants/global';
import { PACKAGE_QUERY } from 'src/modules/auth/graphql';

export const useActivePackages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data } = useQuery(PACKAGE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      studentId: getItemToLocalStorage('studentId'),
    },
  });

  const activePackages = useMemo(() => {
    if (data) {
      const activePackages = data.packageSubscriptions.filter(
        (pkg) => pkg.credits > 0,
      );
      setIsLoading(false);
      return activePackages;
    }
  }, [data]);

  return { activePackages, isLoading };
};
