import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from '../../Badge';
import { NavLink } from 'react-router-dom';

export const MobileMenuItem = ({ menu }) => {
  const [t] = useTranslation('sidebar');
  const { getCountNotification } = useNotifications();

  return (
    <li>
      {getCountNotification(menu.label) > 0 && (
        <Badge count={getCountNotification(menu.label)} />
      )}

      {menu.external ? (
        <a
          className="group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.open(menu.link);
          }}
        >
          <menu.icon className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
          <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple">
            {t(menu.label)}
          </span>
        </a>
      ) : (
        <NavLink
          to={menu.link}
          activeClassName="active"
          className="group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer"
        >
          <menu.icon className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
          <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple">
            {t(menu.label)}
          </span>
        </NavLink>
      )}
    </li>
  );
};
