import React from 'react';
import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from '../../Badge';
import { StudentTriggerAction } from 'src/components/StudentTriggerAction';
import Button from 'src/components/Form/Button';

export const MenuItem = ({ menu }) => {
  const [t] = useTranslation('sidebar');
  const { getCountNotification } = useNotifications();
  return (
    <li className="relative list-none">
      {getCountNotification(menu.label) > 0 && (
        <Badge count={getCountNotification(menu.label)} />
      )}

      {menu.external ? (
        <StudentTriggerAction
          trialStudentAction={
            <Button
              theme="clear"
              className="flex items-center justify-start w-full h-auto gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple"
            >
              <menu.icon className="text-[22px] text-color-dark-purple transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white" />
              <span className="text-color-dark-purple font-medium transition ease-in-out delay-150 group-hover:text-white group-[.active]:text-white">
                {t(menu.label)}
              </span>
            </Button>
          }
          studentAction={
            <a
              className="flex items-center  gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple leading-4"
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
          }
        />
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
