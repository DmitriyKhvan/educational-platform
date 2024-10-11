import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import { useCurrentLang } from '@/entities/lang-switcher/lib/use-current-lang';
import {
  type LanguageDictionary,
  languagesDic,
  setItemToLocalStorage,
} from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
// import { VscGlobe } from 'react-icons/vsc';

export const LangSwitcher = ({
  theme = 'default',
}: {
  theme?: 'default' | 'purple';
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const currentLang = useCurrentLang();

  const [open, setOpen] = useState(false);
  const [t, i18n] = useTranslation('common');

  const onChangeLanguage = (currentLang: LanguageDictionary) => {
    newSearchParams.delete('lang');
    setSearchParams(newSearchParams);

    setOpen(false);
    setItemToLocalStorage('language', currentLang.value);
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
            theme === 'purple' && 'text-color-purple border-none',
          )}
        >
          {/* <VscGlobe className="text-2xl" /> */}
          {currentLang?.label && <span className="grow text-left">{t(currentLang?.label)}</span>}
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </Button>
      }
    >
      {/* <ul className="w-[calc(100vw-2*24px)] sm:w-[514px]"> */}
      <ul className={cn('w-[200px]')}>
        {languagesDic.map((lang) => {
          return (
            <li
              key={lang.value}
              className={cn('border-b border-color-border-grey last:border-b-0')}
            >
              <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                <span
                  className={cn(
                    'text-sm font-medium text-color-dark-purple',
                    theme === 'purple' && 'text-color-purple',
                  )}
                >
                  {t(lang.label)}
                </span>
                <CheckboxField
                  onChange={() => onChangeLanguage(lang)}
                  type="radio"
                  name="lang"
                  checked={lang.value === currentLang?.value}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </MyDropdownMenu>
  );
};
