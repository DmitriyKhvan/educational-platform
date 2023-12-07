import React from 'react';
import { Avatar } from 'src/widgets/Avatar/Avatar';

const MentorImageRow = ({ mentor }) => {
  const { avatar, gender, fullName, firstName, lastName, university, degree } =
    mentor;
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
      <div className="w-[100px] h-[100px] rounded-[5px] overflow-hidden">
        <Avatar avatarUrl={avatar?.url} gender={gender} />
      </div>
      <div>
        <h1 className="text-[clamp(1rem,_5vw,_2rem)] text-color-purple mb-3">
          {fullName || firstName + ' ' + lastName}
        </h1>

        <h5 className="font-medium leading-[18px] tracking-[-0.2px] text-light-grey text-[clamp(0.5rem,_4vw,_1rem)]">
          {university}
        </h5>
        <h5 className="text-light-grey text-[clamp(0.5rem,_4vw,_1rem)]">
          {degree || ''}
        </h5>
      </div>
    </div>
  );
};

export default MentorImageRow;
