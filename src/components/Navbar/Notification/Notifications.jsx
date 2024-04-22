import React, { memo } from 'react';

import { IoNotifications } from 'react-icons/io5';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from 'src/components/Badge';
import { FaAngleDown } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';
import { MyDrawer } from 'src/components/Drawer';
import MyDropdownMenu from 'src/components/DropdownMenu';
import NotificationsModal from './NotificationsModal';

// eslint-disable-next-line react/display-name
export const Notifications = memo(() => {
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
          <span className="font-bold">Notifications</span>
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
