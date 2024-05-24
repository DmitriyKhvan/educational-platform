import { useState, useEffect, Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Language, setItemToLocalStorage } from 'src/constants/global';

import Logo from 'src/assets/images/logo_purple.svg';
import Loader from 'src/components/Loader/Loader';

export const OnboardingLayout = () => {
  const urlObject = new URL(window.location.href);

  const [language, setLanguage] = useState(null);

  const { i18n } = useTranslation();

  const onChangeLanguage = (event) => {
    const lang = event.target.value;
    setItemToLocalStorage('language', lang);
    setLanguage(lang);
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryLang = urlSearchParams.get('lang');
    let localStorageLang = '';

    if (queryLang) {
      localStorageLang = queryLang;
    } else if (urlObject.pathname === '/') {
      localStorageLang =
        localStorage.getItem('language') === Language.KR
          ? Language.KR
          : localStorage.getItem('language') === Language.CH
            ? Language.CH
            : Language.EN;
    } else {
      localStorageLang =
        localStorage.getItem('language') === Language.EN
          ? Language.EN
          : localStorage.getItem('language') === Language.CH
            ? Language.CH
            : Language.KR;
    }

    setLanguage(localStorageLang);
    setItemToLocalStorage('language', localStorageLang);
  }, []);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <div className="flex flex-col relative items-center overflow-hidden">
      <header className="flex items-center justify-between w-screen h-[60px] sm:h-[96px] px-5 py-[10px] sm:px-[80px] sm:py-[16px] sm:border-b-[1px] border-color-border-grey">
        <Link
          className="flex items-center h-[79px]"
          to="/student/manage-lessons"
        >
          <img
            className="w-[134px] sm:w-[161px]"
            src={Logo}
            alt="naonow-logo"
          />
        </Link>
        <div className="flex rounded-xl p-1 bg-[#F2F4FB]">
          <label>
            <input
              onChange={onChangeLanguage}
              className="peer hidden"
              type="radio"
              value={Language.EN}
              name="language"
              checked={language === Language.EN}
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
              value={Language.KR}
              name="language"
              checked={language === Language.KR}
            />
            <span className="flex items-end justify-center py-2 px-[20px] rounded-lg  peer-checked:bg-color-dark-purple peer-checked:text-white text-[13px] cursor-pointer select-none">
              Kr
            </span>
          </label>

          <label>
            <input
              onChange={onChangeLanguage}
              className="peer hidden"
              type="radio"
              value={Language.CH}
              name="language"
              checked={language === Language.CH}
            />
            <span className="flex items-end justify-center py-2 px-[20px] rounded-lg  peer-checked:bg-color-dark-purple peer-checked:text-white text-[13px] cursor-pointer select-none">
              Ch
            </span>
          </label>
        </div>
      </header>
      <main className="relative overflow-auto w-screen h-[calc(100vh-60px)] sm:h-[calc(100vh-97px)] px-5 sm:px-20 py-6 sm:py-8 lg:py-10">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full w-full">
              <Loader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
