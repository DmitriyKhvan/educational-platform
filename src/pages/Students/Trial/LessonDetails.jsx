import { useMemo, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import LevelModal from './LevelModal';
import { useQuery } from '@apollo/client';
import { TRIAL_PACKAGES } from 'src/shared/apollo/queries/trial/trialPackages';
import { AdaptiveDialog } from 'src/shared/ui/AdaptiveDialog';
import { useForm } from 'react-hook-form';
import InputWithError from 'src/components/Form/InputWithError';
import { useTranslation } from 'react-i18next';
import {
  getTranslatedDescription,
  getTranslatedTitle,
} from 'src/shared/utils/getTranslatedTitle';

const LessonDetails = ({
  schedule,
  selectedPlan,
  setSelectedPlan,
  setStep,
}) => {
  const { data } = useQuery(TRIAL_PACKAGES);

  const [t, i18n] = useTranslation(['common', 'trial']);
  const [currentPackage, setCurrentPackage] = useState();
  const [currentLevel, setCurrentLevel] = useState();
  const [currentTopic, setCurrentTopic] = useState();

  const [isOpenCourse, setIsOpenCourse] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);
  const [isOpenTopic, setIsOpenTopic] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    // mode: 'all',
    defaultValues: {
      packageId: selectedPlan?.packageSubscription?.id,
      languageLevelId: selectedPlan?.languageLevel?.id,
      lessonTopicId: selectedPlan?.lessonTopic?.id,
    },
  });

  const packagesData = useMemo(() => {
    if (data) {
      const translatePackages = data.trialPackages.map((pkg) => {
        return {
          ...pkg,
          course: {
            ...pkg.course,
            title: getTranslatedTitle(pkg.course, i18n.language),
            languageLevels: pkg?.course?.languageLevels?.map((level) => ({
              ...level,
              description: getTranslatedDescription(level, i18n.language),
              title: getTranslatedTitle(level, i18n.language),
              topics: level?.topics?.map((topic) => ({
                ...topic,
                title: getTranslatedTitle(topic, i18n.language),
              })),
            })),
          },
        };
      });

      return { trialPackages: translatePackages };
    }
  }, [data, t]);

  const onSubmit = () => {
    setSelectedPlan({
      packageSubscription: { ...currentPackage },
      languageLevel: { ...currentLevel },
      lessonTopic: { ...currentTopic },
    });

    if (schedule) {
      setStep(3);
    } else {
      setStep((v) => v + 1);
    }
  };

  const course = useMemo(() => {
    if (watch('packageId')) {
      const currentPackage = packagesData?.trialPackages?.find(
        (pkg) => pkg.id === watch('packageId'),
      );
      setCurrentPackage(currentPackage);

      return (
        currentPackage?.course?.title || (
          <span className="text-[#BBBBC4]">
            {t('select_course', { ns: 'trial' })}
          </span>
        )
      );
    }

    return (
      <span className="text-[#BBBBC4]">
        {t('select_course', { ns: 'trial' })}
      </span>
    );
  }, [watch('packageId'), t]);

  const languageLevel = useMemo(() => {
    if (currentPackage) {
      const currentLevel = currentPackage?.course?.languageLevels?.find(
        (level) => level.id === watch('languageLevelId'),
      );
      setCurrentLevel(currentLevel);

      return (
        currentLevel?.title || (
          <span className="text-[#BBBBC4]">
            {t('select_level', { ns: 'trial' })}
          </span>
        )
      );
    }

    return (
      <span className="text-[#BBBBC4]">
        {t('first_select_course', { ns: 'trial' })}
      </span>
    );
  }, [watch('languageLevelId'), currentPackage, t]);

  const lessonTopic = useMemo(() => {
    if (currentLevel) {
      const currentTopic = currentLevel?.topics?.find(
        (topic) => topic.id === watch('lessonTopicId'),
      );

      setCurrentTopic(currentTopic);

      return (
        currentTopic?.title || (
          <span className="text-[#BBBBC4]">
            {t('select_lesson_topic', { ns: 'trial' })}
          </span>
        )
      );
    }

    return (
      <span className="text-[#BBBBC4]">
        {t('first_select_level', { ns: 'trial' })}
      </span>
    );
  }, [watch('lessonTopicId'), currentLevel, t]);

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[440px] m-auto">
        <h1 className="text-3xl font-semibold mb-8">
          {t('lesson_details', { ns: 'trial' })}
        </h1>

        <div className="mb-6">
          <InputWithError errorsField={errors?.packageId}>
            <label className="font-semibold block mb-3">
              {t('course', { ns: 'trial' })}
            </label>
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
              <ul className="overflow-auto sm:w-[440px] max-h-[calc(100svh/2)]">
                {packagesData?.trialPackages?.map((pkg) => {
                  return (
                    <li
                      key={pkg.id}
                      className="border-b border-color-border-grey last:border-b-0"
                    >
                      <label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
                        <p>{pkg.course.title}</p>
                        <CheckboxField
                          type="radio"
                          value={pkg.id}
                          name="package"
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
            <label className="font-semibold block mb-3">
              {t('level', { ns: 'trial' })}
            </label>

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
              <LevelModal
                setOpen={setIsOpenLevel}
                watch={watch}
                levels={currentPackage?.course?.languageLevels}
                {...register('languageLevelId', {
                  required: 'Level is required',
                })}
              />
            </AdaptiveDialog>
          </InputWithError>
        </div>

        <div className="mb-8">
          <InputWithError errorsField={errors?.lessonTopicId}>
            <label className="font-semibold block mb-3">
              {t('lesson_topic', { ns: 'trial' })}
            </label>
            <MyDropdownMenu
              open={isOpenTopic}
              setOpen={currentLevel && setIsOpenTopic}
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
              <ul className="overflow-auto min-w-[280px] sm:w-[440px] max-h-[calc(100svh/2)]">
                {currentLevel?.topics?.map((topic) => {
                  return (
                    <li
                      key={topic.id}
                      className="border-b border-color-border-grey last:border-b-0"
                    >
                      <label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
                        <p>{topic.title}</p>
                        <CheckboxField
                          type="radio"
                          name="topic"
                          value={topic.id}
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
