import { useAuth } from '@/app/providers/auth-provider';
import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import Indicator from '@/components/indicator';
import { selectStyle } from '@/pages/mentors/availability/lib/select-style';
import { GET_LESSON_SECTIONS } from '@/shared/apollo/queries/lessons/lesson-sections';
import { GET_TOPICS } from '@/shared/apollo/queries/topics/topics';
import { localeDic } from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';
import { getTranslatedDescription, getTranslatedTitle } from '@/shared/utils/get-translated-title';
import type { Section } from '@/types/feedback';
import type { Topic } from '@/types/types.generated';
import { Avatar } from '@/widgets/avatar/avatar';
import { useQuery } from '@apollo/client';
import type { EventInput } from '@fullcalendar/core';
import { format, toZonedTime } from 'date-fns-tz';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDown } from 'react-icons/fa6';
import Select from 'react-select';

interface FeedbackLessonInfoProps {
  data: EventInput;
  setStep: (step: number) => void;
  choosenTopic: Topic | null;
  setChoosenTopic: (topic: Topic | null) => void;
  choosenSection?: Section;
  setChoosenSection: (section?: Section) => void;
}

const FeedbackLessonInfo: React.FC<FeedbackLessonInfoProps> = ({
  data,
  setStep,
  choosenTopic,
  setChoosenTopic,
  choosenSection,
  setChoosenSection,
}) => {
  const [t, i18n] = useTranslation(['common', 'feedback']);
  const { user } = useAuth();

  const [completedLesson, setCompletedLesson] = useState(!choosenSection);
  const [openSections, setOpenSections] = useState(false);

  const { data: topicsData } = useQuery(GET_TOPICS);
  const { data: sectionsData } = useQuery(GET_LESSON_SECTIONS, {
    variables: { topicId: choosenTopic?.id },
    skip: !choosenTopic?.id,
  });

  const topics = useMemo(() => {
    if (topicsData) {
      return topicsData.topics.map((topic: Topic) => ({
        ...topic,
        title: getTranslatedTitle(topic, i18n.language),
        description: getTranslatedDescription(topic, i18n.language),
        value: topic,
        label: getTranslatedTitle(topic, i18n.language),
      }));
    }

    return [];
  }, [topicsData, i18n.language]);

  const sections: Section[] = sectionsData?.lessonSections?.map((section: Section) => ({
    label: getTranslatedTitle(section, i18n.language),
    value: section.id,
  }));

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="text-color-dark-violet space-y-8">
      <h2 className="text-2xl font-bold">Lesson Information</h2>

      <section className="border rounded-[10px] shadow-[0px_0px_8px_0px_#0000000A] p-4">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              fallback="duck"
              avatarUrl={data.student?.avatar?.url}
              className="w-[40px] h-[40px] bg-color-purple rounded-full overflow-hidden"
              iconClassName="text-white w-[20px]"
            />
            <p className="font-semibold text-base">
              {data?.student?.firstName} {data?.student?.lastName}
            </p>
          </div>
          {data?.languageLevel ? (
            <Indicator className="bg-[#19BBFE] text-[#19BBFE] flex rounded-md">
              {data?.languageLevel?.title}
            </Indicator>
          ) : (
            <div />
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Indicator className="truncate bg-color-purple text-color-purple rounded-md py-[6px]">
            {format(toZonedTime(new Date(data.startAt), userTimezone), 'eee, MMM do', {
              timeZone: userTimezone,
              locale: localeDic[i18n.language as keyof typeof localeDic],
            })}
          </Indicator>

          <Indicator className="truncate bg-color-purple text-color-purple rounded-md py-[6px]">
            {Number(data?.duration)} {t('minutes_full')}
          </Indicator>

          <Indicator className="truncate bg-color-purple text-color-purple rounded-md py-[6px]">
            {getTranslatedTitle(data?.packageSubscription?.package?.course, i18n.language)}
          </Indicator>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-color-light-grey text-sm">
          {t('topic_lesson', { ns: 'feedback' })}
        </h3>

        <Select
          styles={selectStyle}
          isClearable={true}
          value={choosenTopic}
          options={topics}
          onChange={setChoosenTopic}
        />
      </section>

      <section>
        <h3 className="mb-4 text-color-light-grey text-sm">Did you complete the lesson?</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <CheckboxField
            label="Yes"
            name="completeLesson"
            onChange={() => {
              setCompletedLesson(true);
              setChoosenSection(undefined);
            }}
            checked={completedLesson}
            dot
            type="radio"
            className="border px-4 py-[18px] rounded-lg has-[:checked]:border-color-purple"
          />
          <CheckboxField
            label="No"
            name="completeLesson"
            checked={!completedLesson}
            onChange={() => setCompletedLesson(false)}
            dot
            type="radio"
            className="border px-4 py-[18px] rounded-lg has-[:checked]:border-color-purple"
          />
        </div>

        {!completedLesson && !!sections?.length && (
          <>
            <h3 className="mb-4 text-color-light-grey text-sm">Last section completed</h3>
            <MyDropdownMenu
              align="end"
              open={openSections}
              setOpen={setOpenSections}
              button={
                <Button
                  theme="outline"
                  className={cn('flex justify-between items-center gap-3 w-full h-[56px]')}
                >
                  <span className="grow text-left">
                    {choosenSection?.label ? choosenSection?.label : 'Choose lesson section...'}
                  </span>
                  <FaAngleDown />
                </Button>
              }
            >
              <ul className={cn('w-[400px] max-h-[400px] overflow-y-auto')}>
                {sections.map((section) => (
                  <li
                    key={section.value}
                    className={cn('border-b border-color-border-grey last:border-b-0')}
                  >
                    <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-color-purple text-color-dark-purple hover:text-white has-[:checked]:text-white has-[:checked]:bg-color-purple">
                      <input
                        className="hidden"
                        onChange={() => setChoosenSection(section)}
                        type="radio"
                        name="lang"
                        checked={section.value === choosenSection?.value}
                        onClick={() => setOpenSections(false)}
                      />
                      <span className={cn('text-sm font-medium')}>{section.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </MyDropdownMenu>
          </>
        )}
      </section>

      <Button
        className="w-full h-[56px]"
        disabled={!choosenTopic?.id || (!completedLesson && !choosenSection)}
        onClick={() => setStep(2)}
      >
        Next
      </Button>
    </div>
  );
};

export default FeedbackLessonInfo;
