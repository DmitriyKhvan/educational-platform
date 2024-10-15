import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import { forwardRef } from 'react';
import type { UseFormWatch } from 'react-hook-form';

export interface Level {
  id: string;
  title: string;
  description: string;
}

interface FormValues {
  packageId: string;
  languageLevelId: string | undefined;
  lessonTopicId: string | undefined;
}
interface LevelModalProps {
  setOpen: (open: boolean) => void;
  watch: UseFormWatch<FormValues>;
  levels: Level[];
}

const LevelModal = forwardRef<HTMLInputElement, LevelModalProps>(function LevelModal(
  { setOpen, watch, levels, ...props },
  ref,
) {
  return (
    <div className="space-y-6 sm:w-[520px]">
      <h2 className="text-center sm:text-left sm:text-2xl sm:font-bold font-semibold">
        Select a Level
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {levels?.map((level) => {
          return (
            <label
              key={level.id}
              className={
                'border rounded-xl p-4 cursor-pointer transition ease-in-out delay-150 hover:border-color-purple'
              }
            >
              <CheckboxField ref={ref} type="radio" value={level.id} name="level" {...props} />
              <h3 className="font-bold mb-2">{level.title}</h3>
              <p>{level.description}</p>
            </label>
          );
        })}
      </div>
      <Button className="w-full h-[57px]" onClick={() => setOpen(false)}>
        Select
      </Button>
    </div>
  );
});

export default LevelModal;
