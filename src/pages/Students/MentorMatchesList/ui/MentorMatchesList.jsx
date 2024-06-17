import React from 'react';
import { TopMentorCard } from 'src/entities/TopMentorCard';

export default function MentorMatchesList() {
  return (
    <div className="max-w-[584px] mx-auto space-y-10">
      <h2 className="text-center text-[30px] font-bold leading-[120%]">
        Top mentor matches for you
      </h2>

      <div className="w-full flex justify-center flex-wrap gap-6">
        <TopMentorCard />
        <TopMentorCard />
        <TopMentorCard />
        <TopMentorCard />
      </div>
    </div>
  );
}
