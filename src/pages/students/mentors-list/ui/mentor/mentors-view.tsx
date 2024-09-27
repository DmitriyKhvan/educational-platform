import InputField from '@/components/form/input-field';
import { MentorCard } from '@/pages/students/mentors-list/ui/mentor/mentor-card';
import { MentorCard2 } from '@/pages/students/mentors-list/ui/mentor/mentor-card-2';
import type { Mentor } from '@/types/types.generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillGridFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';

interface MentorsViewProps {
  mentorList: Mentor[];
  handleSelectMentor: (mentor: Mentor) => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({ mentorList, handleSelectMentor }) => {
  const [t] = useTranslation(['studentMentor', 'common']);

  const [mentors, setMentors] = useState<Mentor[]>(
    [...mentorList].sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)),
  );

  const [viewMentorList, setViewMentorList] = useState<'list' | 'grid'>('list');

  const searchMentors = (value: string) => {
    let newMentors = [...mentorList].sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

    if (value) {
      newMentors = mentorList
        .filter((mentor) => mentor?.fullName?.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
    }

    setMentors(newMentors);
  };

  const toggleView = (view: 'list' | 'grid') => {
    setViewMentorList(view);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 my-10">
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

      <div className="flex flex-wrap mt-10 gap-6 select-none">
        {mentors.length !== 0 ? (
          mentors.map((mentor) => {
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
          })
        ) : (
          <p className="w-full text-center text-gray-500 uppercase">{t('cannot_find_mentors')}</p>
        )}
      </div>
    </>
  );
};
