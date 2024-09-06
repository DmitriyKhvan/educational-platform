import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/app/providers/notification-provider';
import { Badge } from '@/components/badge';
import Button from '@/components/form/button';
import { useAuth } from '@/app/providers/auth-provider';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import type { MentorNavLink, StudentNavLink } from '@/components/menu/lib/use-menuList';

interface MenuItemProps {
  menu: MentorNavLink | StudentNavLink;
}

export const MenuItem: React.FC<MenuItemProps> = ({ menu }) => {
  const { currentStudent } = useAuth();
  const [t] = useTranslation('sidebar');
  const { notifications } = useNotifications();

  const getCountNotification = (type = '') => {
    const count = notifications.filter((notification) => notification?.meta?.dashboard === type);
    return count.length;
  };

  return (
    <li className="relative list-none">
      {getCountNotification(menu.notificationType) > 0 && (
        <Badge count={getCountNotification(menu.notificationType)} />
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
      ) : menu.type === 'modal' || (menu.type === 'trial' && currentStudent?.isTrial) ? (
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
          className={({ isActive }) =>
            'flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple' +
            (isActive ? ' bg-color-purple active' : '')
          }
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
