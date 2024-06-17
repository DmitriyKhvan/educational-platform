import { useState } from 'react';
import MyDropdownMenu from '../../../components/DropdownMenu';
import Button from '../../../components/Form/Button';
import {
  languagesDic,
  setItemToLocalStorage,
} from 'src/shared/constants/global';
import { useTranslation } from 'react-i18next';
import CheckboxField from '../../../components/Form/CheckboxField';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { useCurrentLang } from '..';
import { cn } from 'src/shared/utils/functions';
// import { VscGlobe } from 'react-icons/vsc';

export const LangSwitcher = ({ currentLang, theme = 'default' }) => {
  const [open, setOpen] = useState(false);
  const [t, i18n] = useTranslation('common');

  const [language, setLanguage] = useState(currentLang || useCurrentLang());

  const onChangeLanguage = (currentLang) => {
    setOpen(false);
    setItemToLocalStorage('language', currentLang.value);
    setLanguage(currentLang);
    i18n.changeLanguage(currentLang.value);
  };

  return (
    <MyDropdownMenu
      open={open}
      setOpen={setOpen}
      button={
        <Button
          theme="clear"
          className={cn(
            'flex justify-between items-center gap-3 w-full border border-gray-200',
            theme === 'purple' &&
              'border border-white border-opacity-15 bg-[#A462ED] text-white',
          )}
        >
          {/* <VscGlobe className="text-2xl" /> */}
          <span className="grow text-left">{t(language.label)}</span>
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </Button>
      }
    >
      {/* <ul className="w-[calc(100vw-2*24px)] sm:w-[514px]"> */}
      <ul
        className={cn(
          'w-[200px]',
          theme === 'purple' &&
            'border border-white border-opacity-15 bg-[#A462ED] text-white',
        )}
      >
        {languagesDic.map((lang) => {
          return (
            <li
              key={lang.value}
              className={cn(
                'border-b border-color-border-grey last:border-b-0',
                theme === 'purple' && 'border-opacity-15 text-white',
              )}
            >
              <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                <span
                  className={cn(
                    'text-sm font-medium text-color-dark-purple',
                    theme === 'purple' && 'text-white',
                  )}
                >
                  {t(lang.label)}
                </span>
                <CheckboxField
                  onChange={() => onChangeLanguage(lang)}
                  type="radio"
                  name="lang"
                  checked={lang.value === language.value}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </MyDropdownMenu>
  );
};
