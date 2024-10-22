import InputField from '@/components/form/input-field';
import Loader from '@/components/loader/loader';
import { MentorCard } from '@/pages/students/mentors-list/ui/mentor/mentor-card';
import { MentorCard2 } from '@/pages/students/mentors-list/ui/mentor/mentor-card-2';
import type { Mentor } from '@/types/types.generated';
import debounce from 'debounce';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillGridFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa6';
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
  console.log('loading', loading);

  const [t] = useTranslation(['studentMentor', 'common']);

  const [viewMentorList, setViewMentorList] = useState<'list' | 'grid'>('list');

  const toggleView = (view: 'list' | 'grid') => {
    setViewMentorList(view);
  };

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

        <div className="flex gap-4">
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
        </div>
      </div>

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
