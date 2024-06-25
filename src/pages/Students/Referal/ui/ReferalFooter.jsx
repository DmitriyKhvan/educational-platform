import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa6';
import { IoLogoFacebook, IoMdMail } from 'react-icons/io';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import whiteLogo from 'src/shared/assets/images/logo_white.svg';

function ReferalFooter() {

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

  return (<footer className="w-full bg-black text-white p-5 md:px-20 md:py-6">
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
  </footer>)
}

export default ReferalFooter