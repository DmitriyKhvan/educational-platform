import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from 'src/constants/global';

import Logo from 'src/assets/images/logo_purple.svg';

export const OnboardingLayout = ({ children }) => {
  const { i18n } = useTranslation();

  const onChangeLanguage = (event) => {
    const lang = parseInt(event.target.value);
    setItemToLocalStorage('language', lang);
    setLanguage(lang);
  };

  const [language, setLanguage] = useState(
    parseInt(getItemToLocalStorage('language', 1)),
  );

  useEffect(() => {
    i18n.changeLanguage(language === 0 ? 'kr' : 'en');
  }, [language]);

  return (
    <div className="flex flex-col relative items-center overflow-hidden">
      <header className="flex items-center justify-between w-screen h-[60px] sm:h-[96px] px-5 py-[10px] sm:px-[80px] sm:py-[16px] sm:border-b-[1px] border-color-border-grey">
        <img className="w-[134px] sm:w-[161px]" src={Logo} alt="naonow-logo" />
        <div className="flex rounded-xl p-1 bg-[#F2F4FB]">
          <label>
            <input
              onChange={onChangeLanguage}
              className="peer hidden"
              type="radio"
              value="1"
              name="language"
              checked={language === 1}
            />
            <span className="flex items-end justify-center py-2 px-[20px] rounded-lg  peer-checked:bg-color-dark-purple peer-checked:text-white text-[13px] cursor-pointer select-none">
              En
            </span>
          </label>

          <label>
            <input
              onChange={onChangeLanguage}
              className="peer hidden"
              type="radio"
              value="0"
              name="language"
              checked={language === 0}
            />
            <span className="flex items-end justify-center py-2 px-[20px] rounded-lg  peer-checked:bg-color-dark-purple peer-checked:text-white text-[13px] cursor-pointer select-none">
              Kr
            </span>
          </label>
        </div>
      </header>
      <main className="overflow-auto w-screen h-[calc(100vh-60px)] sm:h-[calc(100vh-97px)]">
        {children}
      </main>
    </div>
  );
};
