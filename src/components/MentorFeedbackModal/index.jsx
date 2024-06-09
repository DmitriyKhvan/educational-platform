import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { cn } from 'src/shared/utils/functions';
import FeedbackLessonInfo from './FeedbackLessonInfo';
import Feedback from './Feedback';
// import { cn } from 'src/utils/functions';

const MentorFeedbackModal = ({ data, closeModal }) => {
  console.log('🚀 ~ MentorFeedbackModal ~ data:', data);
  const [step, setStep] = useState(1);

  const [choosenTopic, setChoosenTopic] = useState(data?.topic?.id);
  const [choosenSection, setChoosenSection] = useState(null);
  // console.log(data, 'data');

  return (
    <div className="sm:min-w-[410px]">
      <header className="mb-8">
        <div className="flex justify-between text-color-purple text-sm font-medium mb-4">
          <button
            // disabled={step === 1}
            onClick={() => setStep((v) => v - 1)}
            // onClick={() => closeModal()}
            className="flex items-center gap-1 disabled:text-[#C0C0C3]"
          >
            <FaArrowLeft /> Back
          </button>
          Step {step}/2
        </div>
        <div className="w-full h-[5px] sm:h-[6px] flex">
          <span className="w-full h-[5px] sm:h-[6px] rounded-l-3xl bg-color-purple"></span>
          <span
            className={cn(
              'w-full h-[5px] sm:h-[6px] rounded-r-3xl bg-color-border',
              step === 2 && 'bg-color-purple',
            )}
          ></span>
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

export default MentorFeedbackModal;
