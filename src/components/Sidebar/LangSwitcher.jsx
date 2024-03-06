import { useState, useMemo } from 'react';
import MyDropdownMenu from '../DropdownMenu';
import Button from '../Form/Button';
import { Language, Roles, setItemToLocalStorage } from 'src/constants/global';
import { useAuth } from 'src/modules/auth';
import { useTranslation } from 'react-i18next';
import CheckboxField from '../Form/CheckboxField';
import { FaAngleDown } from 'react-icons/fa6';
import { VscGlobe } from 'react-icons/vsc';

export const LangSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [t, i18n] = useTranslation('common');

  const languages = [
    {
      label: 'english',
      value: Language.EN,
    },
    {
      label: 'korean',
      value: Language.KR,
    },
  ];

  const currentLang = useMemo(() => {
    const currentLangValue =
      localStorage.getItem('language') === Language.EN
        ? Language.EN
        : localStorage.getItem('language') === Language.KR
        ? Language.KR
        : user.role === Roles.MENTOR
        ? Language.EN
        : Language.KR;

    return languages.find((lang) => lang.value === currentLangValue);
  }, []);

  const [language, setLanguage] = useState(currentLang);

  const onChangeLanguage = (currentLang) => {
    setOpen(false);
    setItemToLocalStorage('language', currentLang.value);
    setLanguage(currentLang);
    i18n.changeLanguage(currentLang.value);
  };

  return (
    <MyDropdownMenu
      align="end"
      open={open}
      setOpen={setOpen}
      button={
        <Button
          theme="gray"
          className="flex justify-between items-center gap-3 w-full"
        >
          <VscGlobe className="text-2xl" />
          <span className="grow text-left">{t(language.label)}</span>
          <FaAngleDown />
        </Button>
      }
    >
      {/* <ul className="w-[calc(100vw-2*24px)] sm:w-[514px]"> */}
      <ul>
        {languages.map((lang) => {
          return (
            <li
              key={lang.value}
              className="border-b border-color-border-grey last:border-b-0"
            >
              <label className="flex items-center gap-3 p-4 cursor-pointer ">
                <CheckboxField
                  onChange={() => onChangeLanguage(lang)}
                  type="radio"
                  name="lang"
                  checked={lang.value === language.value}
                />

                <span className="text-sm font-medium text-color-dark-purple">
                  {t(lang.label)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </MyDropdownMenu>
  );
};
