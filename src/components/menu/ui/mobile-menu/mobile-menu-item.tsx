import Button from '@/components/form/button';

import { useAuth } from '@/app/providers/auth-provider';
import { useNotifications } from '@/app/providers/notification-provider';
import { Badge } from '@/components/badge';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import type { MentorNavLink, StudentNavLink } from '../../lib/use-menuList';

export const MobileMenuItem = ({ menu }: { menu: MentorNavLink | StudentNavLink }) => {
  const { currentStudent } = useAuth();
  const [t] = useTranslation('sidebar');
  const { getCountNotification } = useNotifications();

  return (
    <li>
      {getCountNotification(menu.label) > 0 && <Badge count={getCountNotification(menu.label)} />}

      {menu.type === 'external' ? (
        <button
          type="button"
          className="group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer"
          // href="#"
          onClick={(e) => {
            e.preventDefault();
            window.open(menu.link);
          }}
        >
          <menu.icon className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple" />
          <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple group-[.active]:text-color-purple">
            {t(menu.label)}
          </span>
        </button>
      ) : menu.type === 'modal' || (menu.type === 'trial' && currentStudent?.isTrial) ? (
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
            `group flex flex-col items-center gap-[5px] sm:w-[118px] cursor-pointer${isActive ? ' active' : ''}`
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
