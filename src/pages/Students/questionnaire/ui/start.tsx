import Button from '@/components/form/button';
import type { Dispatch, SetStateAction } from 'react';
import questinnarie from 'src/shared/assets/images/questinnarie.svg';

interface StartProps {
  setPage: Dispatch<SetStateAction<string>>;
  setCache: Dispatch<SetStateAction<object>>;
}

export const Start: React.FC<StartProps> = ({ setPage, setCache }) => {
  const nextPage = () => {
    setPage('questionnaire');
    setCache((prev) => {
      localStorage.setItem('questionnaire', JSON.stringify({ ...prev, page: 'questionnaire' }));
      return { ...prev, page: 'questionnaire' };
    });
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <img className="mx-auto mb-6" src={questinnarie} alt="questinnarie" />

      <h2 className="text-[38px] text-center font-bold leading-[120%] mb-[17px]">
        Let’s find the right mentor for you!
      </h2>
      <p className="text-[15px] text-center mb-[38px]">
        Share your teaching and learning preferences for personalized mentor matches.
      </p>

      <Button onClick={nextPage} className="w-full h-[57px]">
        Get started
      </Button>
    </div>
  );
};
