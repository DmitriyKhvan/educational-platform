import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useNotifications } from 'src/modules/notifications';

import { Badge } from '../../Badge';

import { useMenuList } from '../lib/useMenuList';

export const Menu = () => {
  const [t] = useTranslation('sidebar');

  const { getCountNotification } = useNotifications();

  const navLinks = useMenuList();

  return (
    <ul className="flex flex-col gap-[10px] pt-10 pb-12">
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
  );
};
