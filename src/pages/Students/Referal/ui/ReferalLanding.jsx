/* eslint-disable no-unused-vars */
import purpleLogo from 'src/shared/assets/images/logo_purple.svg';
import whiteLogo from 'src/shared/assets/images/logo_white.svg';

import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import {
  FaAngleRight,
  FaInstagram,
  FaLinkedin,
  FaPhone,
} from 'react-icons/fa6';
import { IoLogoFacebook, IoMdMail } from 'react-icons/io';
import { LuMenu, LuX } from 'react-icons/lu';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import { useMediaQuery } from 'react-responsive';
import Button from 'src/components/Form/Button';
import { LangSwitcher, useCurrentLang } from 'src/entities/LangSwitcher';
import FormCard from './FormCard';
import ReferalIntro from './ReferalIntro';
import Reviews from './Reviews';
import WhyNaoNow from './WhyNaoNow';
import { useTranslation } from 'react-i18next';

const ReferalLanding = ({ student }) => {
  const inputRef = useRef();
  const formRef = useRef();
  const currentLang = useCurrentLang();
  const [t] = useTranslation(['refer', 'common']);

  const isTablet = useMediaQuery({ maxWidth: 1280 });
  const [openMenu, setOpenMenu] = useState(false);

  const onBannerClick = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  };

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

  const quickLinks = [
    {
      title: 'Speaking Course',
      href: 'https://www.naonow.com/curriculum',
    },
    {
      title: 'Writing Course',
      href: 'https://www.naonow.com/writing',
    },
    {
      title: 'Mentors',
      href: 'https://www.naonow.com/mentors',
    },
    {
      title: 'FAQ',
      href: 'https://www.naonow.com/faq',
    },
    {
      title: 'Purchase',
      href: 'https://www.naonow.com/onboarding',
    },
    {
      title: 'Contact Us',
      href: 'https://www.naonow.com/contact-us',
    },
  ];

  const socialLinks = [
    {
      icon: <FaInstagram />,
      href: 'https://www.instagram.com/naonowmentoring/',
    },
    {
      icon: <RiKakaoTalkFill />,
      href: 'https://pf.kakao.com/_XdGUb',
    },
    {
      icon: <IoLogoFacebook />,
      href: 'https://www.facebook.com/naonowmentoring',
    },
    {
      icon: <FaLinkedin />,
      href: 'https://www.linkedin.com/company/nao-now-mentoring',
    },
    {
      icon: <SiNaver />,
      href: 'https://blog.naver.com/naonowmentoring/',
    },
  ];

  const contactInfo = [
    {
      icon: <IoMdMail className="text-xl" />,
      text: 'support@naonow.com',
    },
    {
      icon: <FaPhone className="text-xl" />,
      text: '02-3498-6970',
    },
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      text: '325 N. Saint Paul Street, Suite 3100, Dallas, TX 75201',
    },
  ];

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

  return (
    <>
      <section className="break-keep">
        <header className="flex mb-6 justify-between items-center gap-2 px-5 py-[10px] xl:px-20 md:py-6 md:mb-0">
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
        )}

        <div
          onClick={onBannerClick}
          className="mb-10 flex gap-3 items-center bg-[#00D986] hover:bg-opacity-80 hover:cursor-pointer transition-colors min-h-16 p-3 rounded-none mx-0"
        >
          <div className="flex items-center w-full justify-between sm:justify-center sm:gap-3">
            <span className="block text-xl">🎁</span>
            <div className="sm:flex sm:gap-2">
              <p className="font-semibold text-sm">{t('claim_your_offer')}</p>
              <p className="text-sm">{t('get_trial_and_discount')}</p>
            </div>
            <span className="block text-xl">🎁</span>
          </div>
        </div>

        <main className="max-w-[1280px] mx-auto space-y-28 mb-16">
          <div className="w-full flex flex-col items-center xl:flex-row justify-between xl:items-start">
            <ReferalIntro student={student} />

            <FormCard inputRef={inputRef} formRef={formRef} />
          </div>

          <WhyNaoNow />

          <Reviews />
        </main>

        <footer className="w-full bg-black text-white p-5 md:px-20 md:py-6">
          <section className="space-y-5 md:space-y-0 md:flex md:gap-4 justify-between items-start">
            <div className="text-sm space-y-5">
              <img src={whiteLogo} alt="NAONOW" className="h-5 md:h-6" />
              <div className="space-y-[10px]">
                <p>Nao Now Today.</p>
                <p>Opportunities Tomorrow.</p>
              </div>
              {contactInfo.map((elem) => (
                <p
                  key={elem.text}
                  className="flex items-center gap-2 hover:text-color-purple hover:cursor-pointer"
                >
                  {elem.icon} {elem.text}
                </p>
              ))}
            </div>
            <div>
              <div className="hidden md:block mb-4">
                <p className="font-bold text-lg mb-2">QUICK LINKS</p>
                <ul className="text-sm space-y-2">
                  {quickLinks.map((link) => (
                    <li
                      key={link.title}
                      className="hover:text-color-purple transition-colors"
                    >
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-semibold text-lg mb-2">Follow us</p>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-[10px] block bg-white bg-opacity-20 text-xl w-10 rounded-lg hover:bg-opacity-100 hover:text-color-dark-violet transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <span className="block w-full border-b border-white border-opacity-15 my-5" />
          <section className="md:flex md:justify-between text-sm">
            <p className="text-[#C0C0C3]">
              Copyright @ {new Date().getFullYear()} | All rights reserved.
            </p>
            <p>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.naonow.com/terms-and-conditions"
                className="whitespace-nowrap"
              >
                Terms & Conditions
              </a>{' '}
              |{' '}
              <a
                href="https://www.naonow.com/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>
        </footer>
      </section>
    </>
  );
};

export default ReferalLanding;
