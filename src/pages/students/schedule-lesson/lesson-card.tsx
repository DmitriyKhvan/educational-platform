import Button from '@/components/form/button';
import { ucFirst } from '@/shared/utils/uc-first';

import { useTranslation } from 'react-i18next';
import { FaPencil } from 'react-icons/fa6';

const LessonCard = ({
  lesson,
  duration,
  remaining,
  total,
  setTabIndex,
}: {
  lesson: string;
  duration: string;
  remaining: number;
  total: number;
  setTabIndex: (index: number) => void;
}) => {
  const [t] = useTranslation(['profile', 'lessons']);
  return (
    <div className="border flex justify-between items-center rounded-[10px] w-full p-5 shadow-[0px_10px_30px_rgba(0,_0,_0,_0.04)] border-color-border-grey">
      <div className="flex items-start flex-col gap-2 flex-wrap">
        <h1 className="font-bold text-base sm:text-lg leading-7 tracking-[-0.6px] text-color-dark-purple">
          {ucFirst(lesson) || 'Title'}
        </h1>

        <div className="flex gap-7 items-center">
          <div>
            <span className="block text-xs sm:text-sm text-color-light-grey">
              {t('lessons_remaining', { ns: 'profile' })}
            </span>
            <span className="block text-xs sm:text-sm text-color-dark-purple">
              {remaining && `${remaining}/${total}`}
            </span>
          </div>
          <div>
            <span className="block text-xs sm:text-sm text-color-light-grey">
              {t('duration', { ns: 'lessons' })}
            </span>
            <span className="block text-xs sm:text-sm text-color-dark-purple">{duration}</span>
          </div>
        </div>
      </div>
      <Button
        className="bg-opacity-10 text-color-purple hover:bg-opacity-100 hover:text-white aspect-square p-1 w-8 h-8"
        onClick={() => setTabIndex(1)}
      >
        <FaPencil className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default LessonCard;
