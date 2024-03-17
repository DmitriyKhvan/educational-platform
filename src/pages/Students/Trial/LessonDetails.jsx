import { useMemo, useState } from 'react';
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
import { topics } from 'src/constants/global';
import { useTranslation } from 'react-i18next';
// import MySelect from 'src/components/Form/MySelect';

const LessonDetails = ({ setSelectedPlan, setStep }) => {
  const { data } = useQuery(TRIAL_PACKAGES);
  const { t } = useTranslation('common');
  const [currentPackage, setCurrentPackage] = useState({});
  const [isOpenLevel, setIsOpenLevel] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    // mode: 'onChange',
    mode: 'all',
    defaultValues: { packageId: null, level: '', topic: '' },
  });

  const onSubmit = (data) => {
    setSelectedPlan({
      ...currentPackage,
      level,
      topic,
    });
    setStep((v) => v + 1);
    console.log(setStep);
    console.log('data', data);
  };

  const course = useMemo(() => {
    const currentPackage = data?.trialPackages.find(
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
  }, [watch('packageId'), setSelectedPlan]);

  const level = useMemo(() => {
    return (
      watch('level') || <span className="text-[#BBBBC4]">Select a level</span>
    );
  }, [watch('level')]);

  const topic = useMemo(() => {
    return (
      watch('topic') || <span className="text-[#BBBBC4]">Select a topic</span>
    );
  }, [watch('topic')]);

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
                {data?.trialPackages?.map((pkg) => {
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
                            required: 'Course required',
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
                <p className="text-sm font-medium">{level}</p>
                <MdOutlineKeyboardArrowDown className="w-4" />
              </Button>
            }
          >
            <LevelModal
              setOpen={setIsOpenLevel}
              register={register}
              watch={watch}
            />
          </AdaptiveDialog>
        </div>

        <div className="mb-8">
          <label className="font-semibold block mb-3">Lesson topic</label>
          <MyDropdownMenu
            button={
              <Button
                theme="clear"
                className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none cursor-pointer"
              >
                <p className="text-sm font-medium">{topic}</p>
                <MdOutlineKeyboardArrowDown className="w-4" />
              </Button>
            }
          >
            <ul className="overflow-auto min-w-[280px] sm:w-[440px]">
              {topics.map((topic) => {
                return (
                  <li
                    key={topic.value}
                    className="border-b border-color-border-grey last:border-b-0"
                  >
                    <label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
                      <p>{topic.label}</p>
                      <CheckboxField
                        type="radio"
                        name="phoneCode"
                        value={topic.value}
                        {...register('topic', {
                          required: 'Topic required',
                        })}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          </MyDropdownMenu>
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
