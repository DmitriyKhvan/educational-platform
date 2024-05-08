import { useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { LANGUAGE_LEVELS_WITH_PAGINATION } from 'src/modules/graphql/queries/levels/languageLevelsWithPagination';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import notify from 'src/utils/notify';

const LevelAfterTrialModal = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const lessonId = urlSearchParams.get('lessonId');

  const { data: levelsData } = useQuery(LANGUAGE_LEVELS_WITH_PAGINATION, {
    variables: { limit: 999 },
  });

  const { register, handleSubmit, watch } = useForm({
    values: {
      languageLevelId: '3',
    },
  });

  const languageLevel = useMemo(() => {
    const currentLevel =
      levelsData?.languageLevelsWithPagination?.languageLevels?.find(
        (topic) => topic.id === watch('languageLevelId'),
      );

    setCurrentLevel(currentLevel);

    return (
      currentLevel?.title || (
        <span className="text-[#BBBBC4]">Select a level</span>
      )
    );
  }, [watch('languageLevelId'), currentLevel]);

  return (
    <AdaptiveDialog open={!!lessonId} hideCloseBtn={true}>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data, 'SUBMIT');
          history.push('/mentor/manage-appointments');
          notify('Student level successfully updated');
        })}
      >
        <div className="mb-7">
          <h2 className="text-xl font-bold text-color-dark-violet mb-4">
            Trial student level
          </h2>
          <p className="text-color-dark-violet">
            Determine the final level of your trial student
          </p>
        </div>

        <div className="flex gap-3 bg-color-bg-grey2 rounded-lg px-4 py-3 mb-7">
          <Avatar
            fallback="duck"
            className="bg-color-purple rounded-full w-10 h-10"
          />
          <div>
            <p className="text-color-dark-violet text-sm font-medium">
              Eunsoo Change
            </p>
            <p className="text-color-purple text-sm">Level 1</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-[15px] font-semibold text-color-dark-violet">
            Final level
          </p>
          <MyDropdownMenu
            open={isOpen}
            setOpen={setIsOpen}
            button={
              <Button
                theme="clear"
                className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none"
              >
                <p className="text-sm font-medium">{languageLevel}</p>
                <MdOutlineKeyboardArrowDown className="w-4" />
              </Button>
            }
          >
            <ul className="overflow-y-scroll max-h-72 sm:w-[336px]">
              {levelsData?.languageLevelsWithPagination?.languageLevels?.map(
                (topic) => {
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
                          onClick={() => setIsOpen(false)}
                          {...register('languageLevelId', {
                            required: 'Topic is required',
                          })}
                        />
                      </label>
                    </li>
                  );
                },
              )}
            </ul>
          </MyDropdownMenu>
        </div>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </AdaptiveDialog>
  );
};

export default LevelAfterTrialModal;
