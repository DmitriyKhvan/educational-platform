import { useAuth } from '@/app/providers/auth-provider';
import InputField from '@/components/form/input-field';
import Loader from '@/components/loader/loader';
import { TopMentorCard } from '@/entities/top-mentor-card';
import { FilterMatching } from '@/features/filter-matching';
import { MentorCard } from '@/pages/students/mentors-list/ui/mentor/mentor-card';
import { MentorCard2 } from '@/pages/students/mentors-list/ui/mentor/mentor-card-2';
import { useFindMatchesQuery } from '@/shared/apollo/mutations/matching/findMatches.generated';
import { EmblaCarousel } from '@/shared/ui/carousel';
import type { Mentor } from '@/types/types.generated';
import debounce from 'debounce';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';

interface MentorsViewProps {
  setMentors: Dispatch<SetStateAction<Mentor[]>>;
  mentorList: Mentor[];
  setSearch: (search: string) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  loading: boolean;
  handleSelectMentor?: (mentor: Mentor) => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({
  setMentors,
  mentorList,
  setSearch,
  setLoading,
  setCurrentPage,
  loading,
  handleSelectMentor,
}) => {
  const { user } = useAuth();

  const { id: matchingId } = user?.matchingProfile || {};

  const [t] = useTranslation(['studentMentor', 'common']);

  const { data: findMatchesData, refetch } = useFindMatchesQuery({
    fetchPolicy: 'network-only',
    variables: {
      matchingProfileId: matchingId ?? '',
    },
  });

  const [viewMentorList] = useState<'list' | 'grid'>('list');

  // const toggleView = (view: 'list' | 'grid') => {
  //   setViewMentorList(view);
  // };

  const searchMentors = debounce((search: string) => {
    setMentors([]);
    setLoading(true);
    setCurrentPage(1);
    setSearch(search);
  }, 500);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mt-10">
        <InputField
          className="w-full max-w-[560px] h-[48px] pl-4 placeholder:text-gray-300"
          classNameIcon="h-[48px] pr-4 text-xl"
          placeholder="Search..."
          icon={<FiSearch />}
          onChange={(e) => searchMentors(e.target.value)}
        />

        <FilterMatching
          findMatches={refetch}
          // setViewMentorList={setViewMentorList}
          // viewMentorList={viewMentorList}
        />

        {/* <div className="flex gap-4">
          <FaList
            onClick={() => toggleView('list')}
            className={`text-2xl cursor-pointer ${
              viewMentorList === 'list' ? 'text-color-purple' : 'text-gray-300'
            }`}
          />
          <BsFillGridFill
            onClick={() => toggleView('grid')}
            className={`text-2xl cursor-pointer ${
              viewMentorList === 'grid' ? 'text-color-purple' : 'text-gray-300'
            }`}
          />
        </div> */}
      </div>

      {findMatchesData?.findMatches && findMatchesData?.findMatches?.length > 0 && (
        <div className="w-full mt-10">
          <EmblaCarousel
            options={{ align: 'start' }}
            slides={findMatchesData?.findMatches?.map((mentor) => {
              return (
                <div key={mentor?.id} className="pl-4">
                  <TopMentorCard mentor={mentor as Mentor} />
                </div>
              );
            })}
          />
        </div>
      )}

      <div className="flex flex-col py-10 gap-6 select-none">
        {mentorList.length > 0 &&
          mentorList.map((mentor) => {
            if (viewMentorList === 'grid') {
              return (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  handleSelectMentor={handleSelectMentor}
                />
              );
            }
            return (
              <MentorCard2
                key={mentor.id}
                mentor={mentor}
                // handleSelectMentor={handleSelectMentor}
              />
            );
          })}
      </div>

      {loading ? (
        <Loader height="352px" />
      ) : (
        !mentorList.length && (
          <p className="w-full text-center text-gray-500 uppercase">{t('cannot_find_mentors')}</p>
        )
      )}
    </>
  );
};
