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
// import { VscGlobe } from 'react-icons/vsc';

export const LangSwitcher = ({ currentLang }) => {
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
          className="flex justify-between items-center gap-3 w-full border border-gray-200"
        >
          {/* <VscGlobe className="text-2xl" /> */}
          <span className="grow text-left">{t(language.label)}</span>
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </Button>
      }
    >
      {/* <ul className="w-[calc(100vw-2*24px)] sm:w-[514px]"> */}
      <ul className="w-[200px]">
        {languagesDic.map((lang) => {
          return (
            <li
              key={lang.value}
              className="border-b border-color-border-grey last:border-b-0"
            >
              <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                <span className="text-sm font-medium text-color-dark-purple">
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
