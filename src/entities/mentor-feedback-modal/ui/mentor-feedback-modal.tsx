import Feedback from '@/entities/mentor-feedback-modal/ui/feedback';
import FeedbackLessonInfo from '@/entities/mentor-feedback-modal/ui/feedback-lesson-info';
import { cn } from '@/shared/utils/functions';
import type { Section } from '@/types';
import type { EventInput } from '@fullcalendar/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa6';

export const MentorFeedbackModal = ({
  data,
  closeModal,
}: {
  data: EventInput;
  closeModal: () => void;
}) => {
  const [t] = useTranslation(['common']);
  const [step, setStep] = useState(1);

  const [choosenTopic, setChoosenTopic] = useState(data?.topic?.id);
  const [choosenSection, setChoosenSection] = useState<Section | undefined>();

  return (
    <div className="sm:w-[410px]">
      <header className="mb-8">
        <div className="flex justify-between text-color-purple text-sm font-medium mb-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={step === 1}
            className="flex items-center gap-1 disabled:text-[#C0C0C3]"
          >
            <FaArrowLeft /> {t('back')}
          </button>
          Step {step}/2
        </div>
        <div className="w-full h-[5px] sm:h-[6px] flex">
          <span className="w-full h-[5px] sm:h-[6px] rounded-l-3xl bg-color-purple" />
          <span
            className={cn(
              'w-full h-[5px] sm:h-[6px] rounded-r-3xl bg-color-border',
              step === 2 && 'bg-color-purple',
            )}
          />
        </div>
      </header>

      <main>
        {step === 1 ? (
          <FeedbackLessonInfo
            data={data}
            setStep={setStep}
            choosenTopic={choosenTopic}
            setChoosenTopic={setChoosenTopic}
            choosenSection={choosenSection}
            setChoosenSection={setChoosenSection}
          />
        ) : (
          <Feedback
            choosenTopic={choosenTopic}
            choosenSection={choosenSection}
            setStep={setStep}
            closeModal={closeModal}
            lessonId={data?.id}
          />
        )}
      </main>
    </div>
  );
};
