import React from 'react';
import { useMenuList } from './lib/useMenuList';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge';
import { MdMoreHoriz } from 'react-icons/md';
import { useNotifications } from 'src/modules/notifications';

export const MobileMenu = () => {
  const [t] = useTranslation('sidebar');
  const navLinks = useMenuList();
  const { getCountNotification } = useNotifications();

  return (
    <div className="sticky bottom-0 left-0 flex justify-center items-center w-full h-16 sm:h-20 bg-white shadow-[4px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
      <ul className="flex">
        {navLinks.slice(0, 4).map((menu) => {
          return (
            <li key={menu.link}>
              {getCountNotification(menu.label) > 0 && (
                <Badge count={getCountNotification(menu.label)} />
              )}

              {menu.external ? (
                <a
                  className="group flex flex-col items-center gap-[5px] w-[118px] cursor-pointer"
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
                  className="group flex flex-col items-center gap-[5px] w-[118px] cursor-pointer"
                >
                  <menu.icon className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
                  <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple">
                    {t(menu.label)}
                  </span>
                </NavLink>
              )}
            </li>
          );
        })}
        <li>
          <button className="group flex flex-col items-center gap-[5px] w-[118px] cursor-pointer">
            <MdMoreHoriz className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
            <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple">
              More
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
};
