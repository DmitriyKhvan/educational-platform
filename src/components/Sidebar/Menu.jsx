import { NavLink, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { useNotifications } from 'src/modules/notifications';
import { Roles } from 'src/constants/global';

import { Badge } from '../Badge';

import Logo from 'src/assets/images/logo_purple.svg';
import { useMenuList } from './lib/useMenuList';

export const Menu = () => {
  const [t] = useTranslation('sidebar');

  const { user } = useAuth();
  const { getCountNotification } = useNotifications();

  const navLinks = useMenuList();

  return (
    <div className="sticky z-10 top-0 left-0 min-w-[280px] max-w-[280px] h-screen px-8 shadow-[4px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
      <Link
        className="flex items-center h-[79px]"
        to={
          user.role === Roles.MENTOR
            ? '/mentor/manage-appointments'
            : '/student/manage-lessons'
        }
      >
        <img src={Logo} alt="" />
      </Link>

      <ul className="flex flex-col gap-[10px] py-10">
        {navLinks?.map((menu, index) => (
          <li className="relative list-none" key={index}>
            {getCountNotification(menu.label) > 0 && (
              <Badge count={getCountNotification(menu.label)} />
            )}

            {menu.external ? (
              <a
                className="flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(menu.link);
                }}
              >
                <menu.icon className="text-[22px] text-color-dark-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />
                <span className="text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
                  {t(menu.label)}
                </span>
              </a>
            ) : (
              <NavLink
                to={menu.link}
                activeClassName="bg-color-purple active"
                className="flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple"
              >
                <menu.icon className="text-[22px] text-color-dark-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />

                <span className="text-sm text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
                  {t(menu.label)}
                </span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
