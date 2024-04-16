import React, { useState, memo } from 'react';

import { useOutsideClick } from 'src/utils/useOutsideClick';
import { IoNotifications } from 'react-icons/io5';
import { NotificationItem } from './NotificationItem';
import { Link } from 'react-router-dom';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from 'src/components/Badge';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';

// eslint-disable-next-line react/display-name
export const NotificationDropdownMenu = memo(() => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const { notifications, removeNotifications } = useNotifications();

  const [visible, setVisible] = useState(false);

  const ref = useOutsideClick(() => setVisible(false));

  return (
    <div ref={ref} className={`dropdown`}>
      <div
        onClick={() =>
          notifications.length ? setVisible((val) => !val) : undefined
        }
        className="flex flex-col relative items-center cursor-pointer"
      >
        <div className="relative">
          {notifications.length > 0 && <Badge count={notifications.length} />}
          <IoNotifications className="text-[30px]" />
        </div>

        {!isMobile && (
          <div className="flex items-center gap-1">
            <span className="font-bold">Notifications</span>
            {visible ? (
              <FaAngleUp className="w-3" />
            ) : (
              <FaAngleDown className="w-3" />
            )}
          </div>
        )}
      </div>

      {visible && notifications.length > 0 && (
        <>
          <div className="menu absolute right-0 top-[60px] w-[500px] bg-white rounded-[9px] py-[6px] border-[0.5px] border-color-border-grey shadow-[1px_3px_5px_rgba(0,0,0,0.1)] z-[3001]">
            <div className="max-h-[225px] overflow-auto">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  setVisible={setVisible}
                  notification={notification}
                />
              ))}
            </div>

            <Link
              to="#"
              onClick={() => removeNotifications()}
              className="flex p-4 border-t border-border-color-border-grey"
            >
              CLEAR ALL MESSAGES
            </Link>
          </div>
        </>
      )}
    </div>
  );
});
