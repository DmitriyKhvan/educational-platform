import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import InputWithError from '@/components/form/input-with-error';
import LevelModal from '@/pages/students/trial/level-modal';
import { TRIAL_PACKAGES } from '@/shared/apollo/queries/trial/trial-packages';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { getTranslatedDescription, getTranslatedTitle } from '@/shared/utils/get-translated-title';
import type { Course, LanguageLevel, Lesson, Package, Query, Topic } from '@/types/types.generated';
import { useQuery } from '@apollo/client';
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

interface LessonDetailsProps {
  schedule: string;
  selectedPlan?: Lesson;
  setSelectedPlan: (plan?: Partial<Package>) => void;
  setStep: Dispatch<SetStateAction<number>>;
}

interface FormValues {
  packageId: string;
  languageLevelId: string;
  lessonTopicId: string;
}

const LessonDetails: React.FC<LessonDetailsProps> = ({
  schedule,
  selectedPlan,
  setSelectedPlan,
  setStep,
}) => {
  const { data } = useQuery<Query>(TRIAL_PACKAGES);
  const { t, i18n } = useTranslation(['common', 'trial']);

  const [currentPackage, setCurrentPackage] = useState<Partial<Package> | undefined>();
  const [currentLevel, setCurrentLevel] = useState<LanguageLevel>();
  const [currentTopic, setCurrentTopic] = useState<Topic>();

  const [isOpenCourse, setIsOpenCourse] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);
  const [isOpenTopic, setIsOpenTopic] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      packageId: selectedPlan?.packageSubscription?.id || '',
      languageLevelId: '',
      lessonTopicId: '',
    },
  });

  const languageLevel = useMemo(() => {
    if (currentPackage) {
      const level = currentPackage?.course?.languageLevels?.find(
        (level) => level?.id === watch('languageLevelId'),
      );

      // Ensure the type aligns with the state setter
      setCurrentLevel(level as LanguageLevel | undefined);

      return (
        level?.title || <span className="text-[#BBBBC4]">{t('select_level', { ns: 'trial' })}</span>
      );
    }

    return <span className="text-[#BBBBC4]">{t('first_select_course', { ns: 'trial' })}</span>;
  }, [watch('languageLevelId'), currentPackage, t, watch]);

  const packagesData = useMemo(() => {
    if (data) {
      const translatePackages = data.trialPackages?.map((pkg) => ({
        ...pkg,
        course: {
          ...pkg?.course,
          title: getTranslatedTitle(pkg?.course as Course, i18n.language),
          languageLevels: pkg?.course?.languageLevels?.map((level) => ({
            ...level,
            description: getTranslatedDescription(level as LanguageLevel, i18n.language),
            title: getTranslatedTitle(level as LanguageLevel, i18n.language),
            topics: level?.topics?.map((topic) => ({
              ...topic,
              title: getTranslatedTitle(topic as Topic, i18n.language),
            })),
          })),
        },
      }));

      return { trialPackages: translatePackages };
    }
  }, [data, i18n.language]);

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (!currentPackage || !currentLevel || !currentTopic) return;
    setSelectedPlan({
      packageSubscription: currentPackage,
      languageLevel: currentLevel,
      lessonTopic: currentTopic,
    });

    if (schedule) {
      setStep(3);
    } else {
      setStep((v) => v + 1);
    }
  };

  const course = useMemo(() => {
    const packageId = watch('packageId');
    if (packageId) {
      const currentPackage = packagesData?.trialPackages?.find((pkg) => pkg.id === packageId);

      if (currentPackage) {
        setCurrentPackage(currentPackage);
      }

      return (
        currentPackage?.course?.title || (
          <span className="text-[#BBBBC4]">{t('select_course', { ns: 'trial' })}</span>
        )
      );
    }

    return <span className="text-[#BBBBC4]">{t('select_course', { ns: 'trial' })}</span>;
  }, [packagesData, t, watch]);

  const lessonTopic = useMemo(() => {
    const lessonTopicId = watch('lessonTopicId');
    if (currentLevel) {
      const currentTopic = currentLevel.topics?.find((topic) => topic?.id === lessonTopicId);

      // Ensure the type aligns with the state setter
      setCurrentTopic(currentTopic as Topic | undefined);

      return (
        currentTopic?.title || (
          <span className="text-[#BBBBC4]">{t('select_lesson_topic', { ns: 'trial' })}</span>
        )
      );
    }

    return <span className="text-[#BBBBC4]">{t('first_select_level', { ns: 'trial' })}</span>;
  }, [currentLevel, t, watch]);
  return (
    <div className="w-full max-w-[440px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[440px] m-auto">
        <h1 className="text-3xl font-semibold mb-8">{t('lesson_details', { ns: 'trial' })}</h1>

        <div className="mb-6">
          <InputWithError errorsField={errors?.packageId}>
            <label className="font-semibold block mb-3">{t('course', { ns: 'trial' })}</label>
            {/* <MySelect options={courses} /> */}

            <MyDropdownMenu
              open={isOpenCourse}
              setOpen={setIsOpenCourse}
              button={
                <Button
                  theme="clear"
                  className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer"
                >
                  <p className="text-sm font-medium">{course}</p>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </Button>
              }
            >
              <ul className="overflow-auto sm:w-[440px]">
                {packagesData?.trialPackages?.map((pkg) => {
                  return (
                    <li key={pkg.id} className="border-b border-color-border-grey last:border-b-0">
                      <label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
                        <p>{pkg.course.title}</p>
                        <CheckboxField
                          type="radio"
                          value={pkg.id}
                          onClick={() => {
                            setIsOpenCourse(false);
                          }}
                          {...register('packageId', {
                            required: 'Course is required',
                          })}
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </MyDropdownMenu>
          </InputWithError>
        </div>

        <div className="mb-6">
          <InputWithError errorsField={errors?.languageLevelId}>
            <label className="font-semibold block mb-3">{t('level', { ns: 'trial' })}</label>

            <AdaptiveDialog
              open={isOpenLevel}
              setOpen={currentPackage && setIsOpenLevel}
              classNameDrawer="h-[80%]"
              button={
                <Button
                  disabled={!currentPackage}
                  theme="clear"
                  className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none"
                >
                  <p className="text-sm font-medium">{languageLevel}</p>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </Button>
              }
            >
              {currentPackage?.course?.languageLevels && (
                <LevelModal
                  setOpen={setIsOpenLevel}
                  watch={watch}
                  levels={currentPackage.course.languageLevels
                    .filter(
                      (level): level is LanguageLevel =>
                        level !== null && level !== undefined && level.id !== undefined,
                    )
                    .map((level) => ({
                      id: level.id as string, // Ensure id is not undefined
                      title: level.title as string, // Ensure title is not undefined
                      description: level.description as string, // Ensure description is not undefined
                    }))}
                  {...register('languageLevelId', {
                    required: 'Level is required',
                  })}
                />
              )}
            </AdaptiveDialog>
          </InputWithError>
        </div>

        <div className="mb-8">
          <InputWithError errorsField={errors?.lessonTopicId}>
            <label className="font-semibold block mb-3">{t('lesson_topic', { ns: 'trial' })}</label>

            {currentLevel && (
              <MyDropdownMenu
                open={isOpenTopic}
                setOpen={setIsOpenTopic}
                button={
                  <Button
                    disabled={!currentLevel}
                    theme="clear"
                    className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none"
                  >
                    <p className="text-sm font-medium">{lessonTopic}</p>
                    <MdOutlineKeyboardArrowDown className="w-4" />
                  </Button>
                }
              >
                <ul className="overflow-auto min-w-[280px] sm:w-[440px]">
                  {currentLevel?.topics?.map((topic) => {
                    return (
                      <li
                        key={topic?.id}
                        className="border-b border-color-border-grey last:border-b-0"
                      >
                        <label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
                          <p>{topic?.title}</p>
                          <CheckboxField
                            type="radio"
                            value={topic?.id ?? ''}
                            onClick={() => setIsOpenTopic(false)}
                            {...register('lessonTopicId', {
                              required: 'Topic is required',
                            })}
                          />
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </MyDropdownMenu>
            )}
          </InputWithError>
        </div>

        <Button
          disabled={!isValid}
          className="w-full my-8 sm:my-10 sm:text-[15px] h-[58px] sm:h-16"
          type="submit"
        >
          {t('continue_button')}
        </Button>
      </form>
    </div>
  );
};

export default LessonDetails;
