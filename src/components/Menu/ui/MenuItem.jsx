import React from 'react';
import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from '../../Badge';
import Button from 'src/components/Form/Button';
import { useAuth } from 'src/modules/auth';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';

export const MenuItem = ({ menu }) => {
  const { currentStudent } = useAuth();
  const [t] = useTranslation('sidebar');
  const { notifications } = useNotifications();

  const getCountNotification = (type) => {
    const count = notifications.filter(
      (notification) => notification?.meta?.dashboard === type,
    );
    return count.length;
  };
  return (
    <li className="relative list-none">
      {getCountNotification(menu.label) > 0 && (
        <Badge count={getCountNotification(menu.label)} />
      )}
      {menu.type === 'external' ? (
        <a
          className="flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple leading-4"
          href={menu.link}
          target="_blank"
          rel="noreferrer"
        >
          <menu.icon className="text-[22px] text-color-dark-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />
          <span className="text-sm text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
            {t(menu.label)}
          </span>
        </a>
      ) : menu.type === 'modal' ||
        (menu.type === 'trial' && currentStudent?.isTrial) ? (
        <AdaptiveDialog
          button={
            <Button
              theme="clear"
              className="flex items-center justify-start w-full h-auto gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple"
            >
              <menu.icon className="text-[22px] text-color-dark-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />

              <span className="text-sm text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
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
  );
};
