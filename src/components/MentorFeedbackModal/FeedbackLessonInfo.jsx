/* eslint-disable no-unused-vars */
// import LevelBadge from 'src/pages/Students/Profile/profile/LevelBadge';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import Indicator from '../Indicator';
import { format, toZonedTime } from 'date-fns-tz';
import { useAuth } from 'src/app/providers/AuthProvider';
import { localeDic } from 'src/shared/constants/global';
import { useTranslation } from 'react-i18next';
import { getTranslatedTitle } from 'src/shared/utils/getTranslatedTitle';
import { useQuery } from '@apollo/client';
import { GET_TOPICS } from 'src/shared/apollo/queries/topics/topics';
import { SelectField } from '../Form/SelectField';
import MyDropdownMenu from '../DropdownMenu';
import { cn } from 'src/shared/utils/functions';
import Button from '../Form/Button';
import { FaAngleDown } from 'react-icons/fa6';
import { VscGlobe } from 'react-icons/vsc';
import { useState } from 'react';
import CheckboxField from '../Form/CheckboxField';
import { GET_LESSON_SECTIONS } from 'src/shared/apollo/queries/lessons/lessonSections';

function FeedbackLessonInfo({
  data,
  setStep,
  choosenTopic,
  setChoosenTopic,
  choosenSection,
  setChoosenSection,
}) {
  // eslint-disable-next-line no-unused-vars
  const [t, i18n] = useTranslation('common');
  const { user } = useAuth();

  const [completedLesson, setCompletedLesson] = useState(!choosenSection);

  const [openTopics, setOpenTopics] = useState(false);
  // const [choosenTopic, setChoosenTopic] = useState(data?.topic?.id);
  const [openSections, setOpenSections] = useState(false);
  // const [choosenSection, setChoosenSection] = useState(null);

  console.log(data);

  const { data: topicsData } = useQuery(GET_TOPICS);
  const { data: sectionsData } = useQuery(GET_LESSON_SECTIONS, {
    variables: { topicId: choosenTopic?.value },
    skip: !choosenTopic?.value,
  });

  const topics = topicsData?.topics?.map((t) => ({
    label: t.title,
    value: t.id,
  }));

  const sections = sectionsData?.lessonSections?.map((t) => ({
    label: t.title,
    value: t.id,
  }));
  console.log('🚀 ~ FeedbackLessonInfo ~ topics:', topicsData);
  console.log('🚀 ~ FeedbackLessonInfo ~ sectionsData:', sectionsData);

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="text-color-dark-violet space-y-8">
      <h2 className="text-2xl font-bold">Lesson Information</h2>

      <section className=" border rounded-[10px] shadow-[0px_0px_8px_0px_#0000000A] p-4">
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
            {format(
              toZonedTime(new Date(data.startAt), userTimezone),
              'eee, MMM do',
              { timeZone: userTimezone, locale: localeDic[i18n.language] },
            )}
          </Indicator>

          <Indicator className="truncate bg-color-purple text-color-purple rounded-md py-[6px]">
            {data?.duration} {t('minutes_full')}
          </Indicator>

          <Indicator className="truncate bg-color-purple text-color-purple rounded-md py-[6px]">
            {getTranslatedTitle(
              data?.packageSubscription?.package?.course,
              i18n.language,
            )}
          </Indicator>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-color-light-grey text-sm">Lesson topic</h3>
        <MyDropdownMenu
          align="end"
          open={openTopics}
          setOpen={setOpenTopics}
          button={
            <Button
              theme="outline"
              className={cn(
                'flex justify-between items-center gap-3 w-full h-[56px]',
              )}
            >
              <span className="grow text-left">
                {choosenTopic?.label ? choosenTopic?.label : 'Choose topic...'}
              </span>
              <FaAngleDown />
            </Button>
          }
        >
          <ul className={cn('w-[400px] max-h-[400px] overflow-y-auto')}>
            {topics?.map((topic) => {
              return (
                <li
                  key={topic?.value}
                  className={cn(
                    ' border-b border-color-border-grey last:border-b-0 overflow-hidden',
                  )}
                >
                  <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-color-purple text-color-dark-purple  hover:text-white has-[:checked]:text-white has-[:checked]:bg-color-purple">
                    <input
                      className="hidden"
                      onChange={() => setChoosenTopic(topic)}
                      type="radio"
                      name="lang"
                      checked={topic?.value === choosenTopic?.value}
                      onClick={() => setOpenTopics(false)}
                    />
                    <span className={cn('text-sm font-medium ')}>
                      {topic?.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </MyDropdownMenu>
      </section>

      <section>
        <h3 className="mb-4 text-color-light-grey text-sm">
          Did you complete the lesson?
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <CheckboxField
            label="Yes"
            name="completeLesson"
            onChange={() => {
              setCompletedLesson(true);
              setChoosenSection(null);
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
            <h3 className="mb-4 text-color-light-grey text-sm">
              Last section completed
            </h3>
            <MyDropdownMenu
              align="end"
              open={openSections}
              setOpen={setOpenSections}
              button={
                <Button
                  theme="outline"
                  className={cn(
                    'flex justify-between items-center gap-3 w-full h-[56px]',
                  )}
                >
                  <span className="grow text-left">
                    {choosenSection?.label
                      ? choosenSection?.label
                      : 'Choose lesson section...'}
                  </span>
                  <FaAngleDown />
                </Button>
              }
            >
              <ul className={cn('w-[400px] max-h-[400px] overflow-y-auto')}>
                {sections?.map((section) => {
                  return (
                    <li
                      key={section?.value}
                      className={cn(
                        ' border-b border-color-border-grey last:border-b-0 ',
                      )}
                    >
                      <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-color-purple text-color-dark-purple  hover:text-white has-[:checked]:text-white has-[:checked]:bg-color-purple">
                        <input
                          className="hidden"
                          onChange={() => setChoosenSection(section)}
                          type="radio"
                          name="lang"
                          checked={section?.value === choosenSection?.value}
                          onClick={() => setOpenSections(false)}
                        />
                        <span className={cn('text-sm font-medium ')}>
                          {section?.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </MyDropdownMenu>
          </>
        )}
      </section>

      <Button
        className="w-full h-[56px]"
        disabled={!choosenTopic?.value || (!completedLesson && !choosenSection)}
        onClick={() => setStep(2)}
      >
        Next
      </Button>
    </div>
  );
}

export default FeedbackLessonInfo;
