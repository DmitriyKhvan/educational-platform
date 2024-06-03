import logo from 'src/shared/assets/images/logo_white.svg';
import learnThinkSpeak from 'src/shared/assets/images/learn_think_speak.svg';
import duck from 'src/shared/assets/images/duck.png';
import referalGirl from 'src/shared/assets/images/referal_girl.png';

import { LangSwitcher } from 'src/components/LangSwitcher';
import {
  FaAngleRight,
  FaInstagram,
  FaLinkedin,
  FaPhone,
} from 'react-icons/fa6';
import InputField from 'src/components/Form/InputField';
import Button from 'src/components/Form/Button';
import { IoLogoFacebook, IoMdMail } from 'react-icons/io';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ReferalLanding = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const inputRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const { ref, ...rest } = register('email', {
    required: t('required_email'),
    pattern: {
      value: /^[a-z0-9_\-.]+@([a-z0-9_-]+\.)+[a-z0-9_-]{2,4}$/,
      message: t('error_invalid_email'),
    },
  });

  const onBannerClick = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = (data) => {
    localStorage.setItem('referralEmail', data?.email || '');
    navigate('/trial');
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

  return (
    <section className="bg-color-purple min-h-screen text-white relative">
      <header className="flex mb-6 justify-between items-center gap-2 px-5 py-[10px] md:px-20 md:py-6 md:mb-0">
        <img src={logo} alt="NAONOW" className="h-5 md:h-6" />
        <div className="w-40 whitespace-nowrap">
          <LangSwitcher theme="purple" />
        </div>
      </header>

      <main className="h-[1275px] md:h-[1150px]">
        <div
          onClick={onBannerClick}
          className="mx-5 mb-10 flex gap-3 items-center bg-[#0EC541] hover:bg-[#00D986] hover:cursor-pointer transition-colors min-h-16 rounded-[10px] p-3 md md:rounded-none md:mx-0"
        >
          <span className="md:hidden text-2xl flex justify-center items-center w-12 h-12 rounded-lg bg-white bg-opacity-10">
            🎁
          </span>
          <div className="md:flex md:justify-center md:items-center md:w-full gap-2">
            <span className="hidden md:block text-xl">🎁</span>
            <p className="font-semibold text-sm">Claim your exclusive offer!</p>
            <p className="text-sm">Get a $40 discount</p>
            <span className="hidden md:block text-xl">🎁</span>
          </div>
          <FaAngleRight className="ml-auto md:hidden" />
        </div>

        <div className="px-5 max-w-[605px] mx-auto mb-10 md:mb-16">
          <img src={learnThinkSpeak} className="mb-6" />
          <p className="text-center font-medium md:font-semibold text-[15px] md:text-base">
            Online English Courses on our fun, edutainment platform.
          </p>
        </div>

        <form
          className="w-full max-w-[540px] mx-auto px-5 mb-[248px] md:mb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField
            className="w-full border-white focus:ring-2 focus:shadow-none focus:ring-white border-opacity-15 bg-[#A462ED] text-white placeholder:text-[#e0e0e0]"
            placeholder="Enter your email"
            {...rest}
            name="email"
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
          />
          {errors?.email && (
            <p className="text-white font-bold mt-1">{errors?.email.message}</p>
          )}
          <Button
            type="submit"
            theme="dark_purple"
            className="w-full h-[52px] my-4 focus:ring-2 focus:shadow-none focus:ring-white"
          >
            Try for free
          </Button>
          <span className="text-center block text-sm">
            By getting started, you agree to our <br />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.naonow.com/terms-and-conditions"
              className="border-b border-white  whitespace-nowrap font-medium"
            >
              Terms of Use
            </a>{' '}
            and{' '}
            <a
              href="https://www.naonow.com/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="border-b border-white whitespace-nowrap font-medium"
            >
              Privacy Policy
            </a>
            .
          </span>
        </form>
      </main>

      <footer className="w-full bg-color-dark-violet z-10 absolute bottom-0 p-5 md:px-20 md:py-6">
        <div className="relative z-0 md:hidden">
          <img src={referalGirl} className="absolute -left-5 bottom-5" />
          <img src={duck} className="absolute -right-5 bottom-5 z-0" />
        </div>
        <section className="space-y-5 md:space-y-0 md:flex md:gap-4 justify-between items-start">
          <div className="text-sm space-y-5">
            <img src={logo} alt="NAONOW" className="h-5 md:h-6" />
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

        <span className="block w-full border-b border-white border-opacity-15 my-5"></span>
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
  );
};

export default ReferalLanding;
