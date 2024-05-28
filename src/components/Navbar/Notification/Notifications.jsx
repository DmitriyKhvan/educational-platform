import React, { memo } from 'react';

import { IoNotifications } from 'react-icons/io5';
import { Badge } from 'src/components/Badge';
import { FaAngleDown } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';
import { MyDrawer } from 'src/components/Drawer';
import MyDropdownMenu from 'src/components/DropdownMenu';
import NotificationsModal from './NotificationsModal';
import { useTranslation } from 'react-i18next';
import { useNotifications } from 'src/app/providers/NotificationProvider';

// eslint-disable-next-line react/display-name
export const Notifications = memo(() => {
  const [t] = useTranslation('notifications');
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const { notifications, removeNotifications } = useNotifications();

  const triggerButton = (
    <div className="flex flex-col relative items-center cursor-pointer">
      <div className="relative">
        {notifications.length > 0 && <Badge count={notifications.length} />}
        <IoNotifications className="text-[30px]" />
      </div>

      {!isMobile && (
        <div className="flex items-center gap-1">
          <span className="font-bold">{t('title')}</span>
          {<FaAngleDown className="w-3" />}
        </div>
      )}
    </div>
  );

  return isMobile ? (
    <MyDrawer button={triggerButton} className="max-h-dvh">
      <NotificationsModal
        notifications={notifications}
        removeNotifications={removeNotifications}
      />
    </MyDrawer>
  ) : (
    <MyDropdownMenu
      button={triggerButton}
      contentClassName="min-w-[210px] overflow-hidden"
      align="end"
    >
      <NotificationsModal
        notifications={notifications}
        removeNotifications={removeNotifications}
      />
    </MyDropdownMenu>
  );
});
