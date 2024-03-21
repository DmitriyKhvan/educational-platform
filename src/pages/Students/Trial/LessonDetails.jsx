import { useEffect, useMemo, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
// import Dropdown from 'src/components/Dropdown';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import LevelModal from './LevelModal';
import { useQuery } from '@apollo/client';
import { TRIAL_PACKAGES } from 'src/modules/graphql/queries/trial/trialPackages';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { useForm } from 'react-hook-form';
import InputWithError from 'src/components/Form/InputWithError';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_LEVELS } from 'src/modules/graphql/queries/trial/languageLevels';
// import MySelect from 'src/components/Form/MySelect';

const LessonDetails = ({
  schedule,
  selectedPlan,
  setSelectedPlan,
  setStep,
}) => {
  const { data: packagesData } = useQuery(TRIAL_PACKAGES);
  const { data: levelsData } = useQuery(LANGUAGE_LEVELS);
  const { t } = useTranslation('common');
  const [currentPackage, setCurrentPackage] = useState({});
  const [currentLevel, setCurrentLevel] = useState({});
  const [currentTopic, setCurrentTopic] = useState({});
  const [isOpenLevel, setIsOpenLevel] = useState(false);

  console.log('levelsData', levelsData);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
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

  console.log('isValid', isValid);
  console.log('errors', errors);

  const onSubmit = (data) => {
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
    console.log(setStep);
    console.log('data', data);
  };

  const course = useMemo(() => {
    const currentPackage = packagesData?.trialPackages.find(
      (pkg) => pkg.id === watch('packageId'),
    );
    setCurrentPackage({
      ...currentPackage,
    });
    return (
      currentPackage?.course?.title || (
        <span className="text-[#BBBBC4]">Select a course</span>
      )
    );
  }, [watch('packageId')]);

  const languageLevel = useMemo(() => {
    const currentLevel = levelsData?.languageLevels.find(
      (level) => level.id === watch('languageLevelId'),
    );

    setCurrentLevel(currentLevel);
    setValue('lessonTopicId', '');

    return (
      currentLevel?.title || (
        <span className="text-[#BBBBC4]">Select a level</span>
      )
    );
  }, [watch('languageLevelId')]);

  const lessonTopic = useMemo(() => {
    if (Object.keys(currentLevel || {}).length !== 0) {
      const currentTopic = currentLevel?.topics?.find(
        (topic) => topic.id === watch('lessonTopicId'),
      );

      setCurrentTopic(currentTopic);

      return (
        currentTopic?.title || (
          <span className="text-[#BBBBC4]">Select a lesson topic</span>
        )
      );
    }

    return <span className="text-[#BBBBC4]">First select a level</span>;
  }, [watch('lessonTopicId'), currentLevel]);

  useEffect(() => {
    setValue('lessonTopicId', selectedPlan?.lessonTopic?.id);
  }, []);

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[440px] m-auto">
        <h1 className="text-3xl font-semibold mb-8">Lesson Details</h1>

        <div className="mb-6">
          <InputWithError errorsField={errors?.packageId}>
            <label className="font-semibold block mb-3">Course</label>
            {/* <MySelect options={courses} /> */}

            <MyDropdownMenu
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
            <label className="font-semibold block mb-3">Level</label>

            <AdaptiveDialog
              open={isOpenLevel}
              setOpen={setIsOpenLevel}
              classNameDrawer="h-[80%]"
              button={
                <Button
                  theme="clear"
                  className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer"
                >
                  <p className="text-sm font-medium">{languageLevel}</p>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </Button>
              }
            >
              <LevelModal
                setOpen={setIsOpenLevel}
                watch={watch}
                levels={levelsData}
                {...register('languageLevelId', {
                  required: 'Level is required',
                })}
              />
            </AdaptiveDialog>
          </InputWithError>
        </div>

        <div className="mb-8">
          <InputWithError errorsField={errors?.lessonTopicId}>
            <label className="font-semibold block mb-3">Lesson topic</label>
            <MyDropdownMenu
              button={
                <Button
                  disabled={Object.keys(currentLevel || {}).length === 0}
                  theme="clear"
                  className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer"
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
                      key={topic.id}
                      className="border-b border-color-border-grey last:border-b-0"
                    >
                      <label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
                        <p>{topic.title}</p>
                        <CheckboxField
                          type="radio"
                          name="topic"
                          value={topic.id}
                          {...register('lessonTopicId', {
                            required: 'Topic is isrequired',
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
