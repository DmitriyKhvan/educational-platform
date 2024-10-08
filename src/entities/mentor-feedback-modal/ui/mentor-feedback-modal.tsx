import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import Feedback from '@/entities/mentor-feedback-modal/ui/feedback';
import FeedbackLessonInfo from '@/entities/mentor-feedback-modal/ui/feedback-lesson-info';
import { MARK_LESSON_ATTENDANCE } from '@/shared/apollo/mutations/lessons/mark-lesson-attendance';
import { cn } from '@/shared/utils/functions';
import type { Section } from '@/types';
import type { Lesson, Maybe, Topic } from '@/types/types.generated';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';

export const MentorFeedbackModal = ({
  data,
  closeModal,
}: {
  data: Lesson;
  closeModal: () => void;
}) => {
  const [t] = useTranslation(['common']);
  const [step, setStep] = useState(0);

  const [markLessonAttendance, { loading }] = useMutation(MARK_LESSON_ATTENDANCE);

  const [choosenTopic, setChoosenTopic] = useState<Maybe<Topic> | undefined>(data?.topic);
  const [choosenSection, setChoosenSection] = useState<Section | undefined>();

  const [studentShowUp, setStudentShowUp] = useState(true);

  const markStudentAttendance = () => {
    markLessonAttendance({
      variables: {
        lessonId: data.id ?? '',
      },
      onCompleted: () => {
        closeModal();
      },
    });
  };

  return (
    <div className="sm:w-[410px]">
      <header className="mb-8">
        <div className="flex justify-between text-color-purple text-sm font-medium mb-4">
          <button
            type="button"
            onClick={() =>
              setStep((step) => {
                if (step === 99) return 0;
                return step - 1;
              })
            }
            disabled={step === 0}
            className="flex items-center gap-1 disabled:text-[#C0C0C3]"
          >
            <FaArrowLeft /> {t('back')}
          </button>
          {step !== 99 && `Step ${step}/2`}
        </div>
        {step !== 99 && (
          <div className="w-full h-[5px] sm:h-[6px] flex">
            {/* <span className="w-full h-[5px] sm:h-[6px] rounded-l-3xl bg-color-purple" /> */}
            <span
              className={cn(
                'w-full h-[5px] sm:h-[6px] rounded-r-3xl bg-color-border',
                step !== 0 && 'bg-color-purple',
              )}
            />
            <span
              className={cn(
                'w-full h-[5px] sm:h-[6px] rounded-r-3xl bg-color-border',
                step === 2 && 'bg-color-purple',
              )}
            />
          </div>
        )}
      </header>

      <main>
        {step === 0 && (
          <div>
            <section>
              <h3 className="mb-4 text-color-light-grey text-sm">Did the student show up?</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <CheckboxField
                  label="Yes"
                  name="studentShowUp"
                  onChange={() => {
                    setStudentShowUp(true);
                    // setChoosenSection(null);
                  }}
                  checked={studentShowUp}
                  dot
                  type="radio"
                  className="border px-4 py-[18px] rounded-lg has-[:checked]:border-color-purple"
                />
                <CheckboxField
                  label="No"
                  name="studentShowUp"
                  checked={!studentShowUp}
                  onChange={() => setStudentShowUp(false)}
                  dot
                  type="radio"
                  className="border px-4 py-[18px] rounded-lg has-[:checked]:border-color-purple"
                />
              </div>
            </section>

            <Button
              className="w-full h-[56px]"
              // disabled={!choosenTopic?.id || (!completedLesson && !choosenSection)}
              onClick={() => {
                if (studentShowUp) setStep(1);
                if (!studentShowUp) setStep(99);
              }}
            >
              Next
            </Button>
          </div>
        )}

        {step === 1 && (
          <FeedbackLessonInfo
            data={data}
            setStep={setStep}
            choosenTopic={choosenTopic ?? null}
            setChoosenTopic={setChoosenTopic}
            choosenSection={choosenSection}
            setChoosenSection={setChoosenSection}
          />
        )}

        {step === 2 && (
          <Feedback
            chosenTopic={choosenTopic ?? null}
            chosenSection={choosenSection ?? null}
            setStep={setStep}
            closeModal={closeModal}
            lessonId={data?.id}
          />
        )}

        {step === 99 && (
          <div>
            <span className="bg-color-red rounded-full bg-opacity-10 flex justify-center items-center w-10 h-10 mx-auto mb-4">
              <BsExclamationTriangleFill className="text-color-red text-2xl" />
            </span>
            <h2 className="text-lg text-center mb-8">
              Are you sure that{' '}
              <span className="font-semibold">the student didn&apos;t show up</span>?
            </h2>
            <Button theme="red" className="w-full mb-4 h-14" onClick={markStudentAttendance}>
              {loading ? <FaSpinner className="animate-spin" /> : "Yes, student didn't show up"}
            </Button>
            <Button theme="gray" className="w-full  h-14" onClick={() => setStep(0)}>
              Cancel
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
