import purpleLogo from 'src/shared/assets/images/logo_purple.svg';
import whiteLogo from 'src/shared/assets/images/logo_white.svg';

import {
  FaAngleRight,
  FaInstagram,
  FaLinkedin,
  FaPhone,
} from 'react-icons/fa6';
import Button from 'src/components/Form/Button';
import { IoLogoFacebook, IoMdMail } from 'react-icons/io';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import { useRef } from 'react';
import Reviews from './Reviews';
import WhyNaoNow from './WhyNaoNow';
import ReferalIntro from './ReferalIntro';
import FormCard from './FormCard';

const ReferalLanding = ({ student }) => {
  const inputRef = useRef();

  const onBannerClick = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    { title: 'Courses', href: 'https://www.naonow.com' },
    { title: 'Mentors', href: 'https://www.naonow.com/mentors' },
    { title: 'Free Trial', href: 'https://www.naonow.com' },
    { title: 'Blog', href: 'https://www.naonow.com/blog' },
    { title: 'Become a Mentor', href: 'https://www.naonow.com/mentors-apply' },
  ];

  return (
    <>
      <section className="">
        <header className="flex mb-6 justify-between items-center gap-2 px-5 py-[10px] md:px-20 md:py-6 md:mb-0">
          <img src={purpleLogo} alt="NAONOW" className="h-5 md:h-6" />

          <nav className="flex lg:gap-5 xl:gap-12">
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

          <div className="flex gap-4">
            <Button
              className="px-8 py-4 text-color-purple border-color-purple hover:text-white"
              theme="outline"
            >
              Login
            </Button>
            <Button className="px-8 py-4">Sign Up</Button>
          </div>
        </header>

        <div
          onClick={onBannerClick}
          className="mx-5 mb-10 flex gap-3 items-center bg-[#00D986] hover:bg-opacity-80 hover:cursor-pointer transition-colors min-h-16 rounded-[10px] p-3 md md:rounded-none md:mx-0"
        >
          <span className="md:hidden text-2xl flex justify-center items-center w-12 h-12 rounded-lg bg-white bg-opacity-10">
            🎁
          </span>
          <div className="md:flex md:justify-center md:items-center md:w-full gap-2">
            <span className="hidden md:block text-xl">🎁</span>
            <p className="font-semibold text-sm">Claim your exclusive offer!</p>
            <p className="text-sm">Get a free trial and 10% discount</p>
            <span className="hidden md:block text-xl">🎁</span>
          </div>
          <FaAngleRight className="ml-auto md:hidden" />
        </div>

        <main className="max-w-[1280px] mx-auto space-y-28 mb-16">
          <div className="w-full flex justify-between items-start">
            <ReferalIntro student={student} />

            <FormCard inputRef={inputRef} />
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
