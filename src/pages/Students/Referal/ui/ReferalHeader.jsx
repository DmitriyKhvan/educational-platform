import purpleLogo from 'src/shared/assets/images/logo_purple.svg';

import { useTranslation } from "react-i18next";
import { LuMenu, LuX } from "react-icons/lu"
import Button from "src/components/Form/Button"
import { LangSwitcher, useCurrentLang } from "src/entities/LangSwitcher"
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

function ReferalHeader() {
  const currentLang = useCurrentLang();
  const [t] = useTranslation(['refer', 'common']);
  
  const isTablet = useMediaQuery({ maxWidth: 1280 });
  const [openMenu, setOpenMenu] = useState(false);
  
  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
    }
    if (!isTablet) {
      setOpenMenu(false)
    }
  }, [openMenu, isTablet]);
  
  const navLinks = [
    { title: t('courses'), href: 'https://www.naonow.com' },
    { title: t('mentors'), href: 'https://www.naonow.com/mentors' },
    { title: t('free_trial'), href: 'https://www.naonow.com' },
    { title: t('blog'), href: 'https://www.naonow.com/blog' },
    {
      title: t('become_a_mentor'),
      href: 'https://www.naonow.com/mentors-apply',
    },
  ];

  return (<><header className="flex mb-6 justify-between items-center gap-2 px-5 py-[10px] xl:px-20 md:py-6 md:mb-0">
    <img src={purpleLogo} alt="NAONOW" className="h-5 md:h-6" />
    <nav className="hidden xl:flex lg:gap-5 xl:gap-12">
      {navLinks.map((link) => (
        <a
          key={link.title}
          target="_blank"
          rel="noreferrer"
          href={link.href}
        >
          {link.title}
        </a>
      ))}
    </nav>
    <div className="flex gap-1 sm:gap-4">
      <div>
        <LangSwitcher currentLang={currentLang} theme="purple" />
      </div>
      {isTablet ? (
        <Button
          onClick={() => setOpenMenu((prev) => !prev)}
          theme="outline"
          className="border-none hover:bg-white hover:text-black"
        >
          {openMenu ? (
            <LuX className="w-6 h-6" />
          ) : (
            <LuMenu className="w-6 h-6" />
          )}
        </Button>
      ) : (
        <>
          <a
            href="https://dashboard.naonow.com"
            className="flex w-full transition h-12 items-center justify-center rounded-lg font-semibold text-sm hover:bg-color-purple border px-8 py-4 text-color-purple border-color-purple hover:text-white"
          >
            {t('sign_in', { ns: 'common' })}
          </a>
          <a
            href="https://dashboard.naonow.com/onboarding"
            className="flex whitespace-nowrap border border-color-purple w-full h-12 items-center justify-center rounded-lg font-semibold text-sm bg-color-purple px-8 py-4 text-white"
          >
            {t('signup', { ns: 'common' })}
          </a>
        </>
      )}
    </div>
  </header>

  {isTablet && openMenu && (
    <div className="fixed p-4 bg-white w-screen left-0 right-0 bottom-0 h-[calc(100vh-68px)] md:h-[calc(100vh-96px)] z-10">
      <nav className="flex flex-col mb-12">
        {navLinks.map((link) => (
          <a
            key={link.title}
            target="_blank"
            rel="noreferrer"
            className="py-4 border-b"
            href={link.href}
          >
            {link.title}
          </a>
        ))}
      </nav>

      <a
        href="https://dashboard.naonow.com/onboarding"
        className="flex whitespace-nowrap mb-4 border border-color-purple w-full h-12 items-center justify-center rounded-lg font-semibold text-sm bg-color-purple px-8 py-4 text-white"
      >
        {t('signup', { ns: 'common' })}
      </a>
      <a
        href="https://dashboard.naonow.com"
        className="flex w-full transition h-12 items-center justify-center rounded-lg font-semibold text-sm hover:bg-color-purple border px-8 py-4 text-color-purple border-color-purple hover:text-white"
      >
        {t('sign_in', { ns: 'common' })}
      </a>
    </div>
  )}</>)
}

export default ReferalHeader