import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputField from 'src/components/Form/InputField';
import { MentorCard } from './MentorCard';
import { MentorCard2 } from './MentorCard2';
import { FiSearch } from 'react-icons/fi';

import { EmblaCarousel } from 'src/components/Carousel';
import { TopMentorCard } from 'src/entities/TopMentorCard';

import { FilterMatching } from 'src/features/FilterMatching';

export const MentorsView = ({ mentorList, handleSelectMentor }) => {
  const [t] = useTranslation(['studentMentor', 'common']);

  const [mentors, setMentors] = useState(
    [...mentorList].sort((a, b) => a.sortOrder - b.sortOrder),
  );

  const [viewMentorList, setViewMentorList] = useState('list');

  const searchMentors = (value) => {
    let newMentors = [...mentorList].sort((a, b) => a.sortOrder - b.sortOrder);

    if (value) {
      newMentors = mentorList
        .filter((mentor) =>
          mentor?.fullName?.toLowerCase().includes(value.toLowerCase()),
        )
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    setMentors(newMentors);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 my-10">
        <InputField
          className="w-full max-w-[560px] h-12 pl-5 placeholder:text-gray-300"
          classNameIcon="h-12 pr-5 text-xl"
          placeholder="Search..."
          icon={<FiSearch />}
          onChange={(e) => searchMentors(e.target.value)}
        />

        <FilterMatching setViewMentorList={setViewMentorList} viewMentorList={viewMentorList} />
      </div>

      <div className="w-full">
        <EmblaCarousel
          options={{ align: 'start' }}
          slides={
            <>
              <div className="pl-4">
                <TopMentorCard />
              </div>
              <div className="pl-4">
                <TopMentorCard />
              </div>
              <div className="pl-4">
                <TopMentorCard />
              </div>
              <div className="pl-4">
                <TopMentorCard />
              </div>
              <div className="pl-4">
                <TopMentorCard />
              </div>
            </>
          }
        />
      </div>

      <div className="flex flex-wrap mt-10 gap-6 select-none">
        {mentors?.length !== 0 ? (
          mentors?.map((mentor) => {
            if (viewMentorList === 'grid') {
              return (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  handleSelectMentor={handleSelectMentor}
                />
              );
            } else {
              return (
                <MentorCard2
                  key={mentor.id}
                  mentor={mentor}
                  handleSelectMentor={handleSelectMentor}
                />
              );
            }
          })
        ) : (
          <p className="w-full text-center text-gray-500 uppercase">
            {t('cannot_find_mentors')}
          </p>
        )}
      </div>
    </>
  );
};
