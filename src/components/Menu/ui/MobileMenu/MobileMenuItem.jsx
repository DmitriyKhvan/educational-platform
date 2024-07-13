import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/app/providers/NotificationProvider';
import { Badge } from '../../../Badge';
import { NavLink } from 'react-router-dom';
import Button from 'src/components/Form/Button';
import { useAuth } from 'src/app/providers/AuthProvider';
import { AdaptiveDialog } from 'src/shared/ui/AdaptiveDialog/index.jsx';

export const MobileMenuItem = ({ menu }) => {
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
      ) : menu.type === 'modal' ||
        (menu.type === 'trial' && currentStudent?.isTrial) ? (
        <AdaptiveDialog
          button={
            <Button
              theme="clear"
              className="group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer"
            >
              <menu.icon className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
              <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple">
                {t(menu.label)}
              </span>
            </Button>
          }
        >
          {menu.modal}
        </AdaptiveDialog>
      ) : (
        <NavLink
          to={menu.link}
          className={({ isActive }) =>
            'group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer' +
            (isActive ? ' active' : '')
          }
        >
          <menu.icon className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
          <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple text-center">
            {t(menu.label)}
          </span>
        </NavLink>
      )}
    </li>
  );
};
