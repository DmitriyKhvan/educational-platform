import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from '../../Badge';
import { NavLink } from 'react-router-dom';

export const MobileMenuFullItem = ({ menu }) => {
  const [t] = useTranslation('sidebar');
  const { getCountNotification } = useNotifications();

  return (
    <li>
      {getCountNotification(menu.label) > 0 && (
        <Badge count={getCountNotification(menu.label)} />
      )}

      {menu.external ? (
        <div className="bg-[#F7F8FA] rounded-lg">
          <a
            className="group flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 hover:bg-color-purple cursor-pointer"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(menu.link);
            }}
          >
            <menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white" />
            <span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white">
              {t(menu.label)}
            </span>
          </a>
        </div>
      ) : (
        <div className="bg-[#F7F8FA] rounded-lg">
          <NavLink
            to={menu.link}
            activeClassName="group/active active bg-color-purple"
            className="group/item flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px]  rounded-lg transition ease-in-out delay-150 hover:bg-color-purple cursor-pointer"
          >
            <menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover/item:text-white group-[.active]/active:text-white" />
            <span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover/item:text-white group-[.active]/active:text-white">
              {t(menu.label)}
            </span>
          </NavLink>
        </div>
      )}
    </li>
  );
};
