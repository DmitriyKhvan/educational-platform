import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from '../../../Badge';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'src/modules/auth';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';

export const MobileMenuFullItem = ({ menu }) => {
  const { currentStudent } = useAuth();
  const [t] = useTranslation('sidebar');
  const { getCountNotification } = useNotifications();

  return (
    <li>
      {getCountNotification(menu.label) > 0 && (
        <Badge count={getCountNotification(menu.label)} />
      )}

      {menu.type === 'external' ? (
        <a
          className="group flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 bg-[#F7F8FA]  hover:bg-color-purple cursor-pointer"
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
      ) : menu.type === 'modal' ||
        (menu.type === 'trial' && currentStudent?.isTrial) ? (
        <AdaptiveDialog
          button={
            <span className="group flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 bg-[#F7F8FA] hover:bg-color-purple cursor-pointer">
              <menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white" />
              <span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white">
                {t(menu.label)}
              </span>
            </span>
          }
        >
          {menu.modal}
        </AdaptiveDialog>
      ) : (
        <NavLink
          to={menu.link}
          activeClassName="group/active active bg-color-purple"
          className="group/item flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 bg-[#F7F8FA] hover:bg-color-purple cursor-pointer"
        >
          <menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover/item:text-white group-[.active]/active:text-white" />
          <span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover/item:text-white group-[.active]/active:text-white">
            {t(menu.label)}
          </span>
        </NavLink>
      )}
    </li>
  );
};
