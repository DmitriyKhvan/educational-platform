import { useTranslation } from 'react-i18next';

import { getItemToLocalStorage } from '@/shared/constants/global';

import { MentorsView } from '@/pages/students/mentors-list/ui/mentor/mentors-view';

import { useEffect, useState } from 'react';
import type { Mentor } from '@/types/types.generated';
import { useMentorsLazyQuery } from '@/shared/apollo/queries/mentors/mentors.generated';
import notify from '@/shared/utils/notify';
import debounce from 'debounce';

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [search, setSearch] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const studentId = getItemToLocalStorage('studentId', '');

  const [t] = useTranslation(['studentMentor', 'common']);

  const element = document.getElementById('mentors') as HTMLElement;

  const [mentorsQuery] = useMentorsLazyQuery();

  const mentorsFetch = async (scroll = false) => {
    try {
      const response = await mentorsQuery({
        fetchPolicy: 'no-cache',
        variables: { studentId, page: currentPage, limit: 2, ...(search && { search }) },
      });

      if (response.data) {
        if (scroll) {
          setMentors((prevState) => [
            ...prevState,
            ...(response.data?.mentors?.mentors as Mentor[]),
          ]);
        } else {
          setMentors(response.data?.mentors?.mentors as Mentor[]);
        }
        setCurrentPage((prevState) => prevState + 1);
        setTotalCount(response?.data?.mentors?.count ?? 0);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      }
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetching) {
      element.scroll({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
      mentorsFetch(true);
    }
  }, [fetching]);

  useEffect(() => {
    if (search !== null) {
      mentorsFetch();
    }
  }, [search]);

  useEffect(() => {
    element?.addEventListener('scroll', scrollHandler);

    return () => {
      element?.removeEventListener('scroll', scrollHandler);
    };
  }, [mentors]);

  const scrollHandler = debounce((e: Event) => {
    const element = e.target as HTMLElement;

    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight &&
      mentors.length < totalCount
    ) {
      setLoading(true);
      setFetching(true);
    }
  }, 500);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-base sm:text-4xl text-color-dark-purple font-bold leading-normal tracking-tight">
          {t('mentor_list', { ns: 'studentMentor' })}
        </h1>
      </div>

      <p className="text-base leading-6 tracking-[-0.6px] text-color-light-grey">
        {t('mentor_list_desc', { ns: 'studentMentor' })}
      </p>

      {/* {loading ? (
        <Loader height={'50vh'} />
      ) : mentors.length ? (
        <MentorsView mentorList={mentors} setMentors={setMentors} loading={loading} />
      ) : (
        <p className="w-full text-center text-gray-500 uppercase">{t('no_mentors_available')}</p>
      )} */}

      <MentorsView
        setMentors={setMentors}
        mentorList={mentors}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
      />
    </div>
  );
};

export default Mentors;
