import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from '../../../Badge';
import { NavLink } from 'react-router-dom';
import { StudentTriggerAction } from 'src/components/StudentTriggerAction';
import Button from 'src/components/Form/Button';

export const MobileMenuItem = ({ menu }) => {
  const [t] = useTranslation('sidebar');
  const { getCountNotification } = useNotifications();

  return (
    <li>
      {getCountNotification(menu.label) > 0 && (
        <Badge count={getCountNotification(menu.label)} />
      )}

      {menu.external ? (
        <StudentTriggerAction
          trialStudentAction={
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
          studentAction={
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
          }
        />
      ) : menu.trial ? (
        <StudentTriggerAction
          trialStudentAction={
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
          studentAction={
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
          }
        />
      ) : (
        <NavLink
          to={menu.link}
          activeClassName="active"
          className="group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer"
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
