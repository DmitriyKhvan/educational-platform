import React, { useState, memo } from 'react';

import { useOutsideClick } from 'src/utils/useOutsideClick';
import { IoNotifications } from 'react-icons/io5';
import { NotificationItem } from './NotificationItem';
import { Link } from 'react-router-dom';
import { useNotifications } from 'src/modules/notifications';
import { Badge } from 'src/components/Badge';

// eslint-disable-next-line react/display-name
export const NotificationDropdownMenu = memo(() => {
  const { notifications } = useNotifications();

  const [visible, setVisible] = useState(false);

  const ref = useOutsideClick(() => setVisible(false));

  return (
    <div ref={ref} className={`dropdown ml-[20px]`}>
      <div
        onClick={() =>
          notifications.length ? setVisible((val) => !val) : undefined
        }
        className="flex relative items-center cursor-pointer"
      >
        <IoNotifications className="text-2xl" />
      </div>

      {notifications.length > 0 && <Badge count={notifications.length} />}

      {visible && notifications.length > 0 && (
        <>
          {/* <div className="background" onClick={() => setVisible(false)} /> */}
          <div className="menu absolute right-0 top-[40px] w-[500px] bg-white rounded-[9px] py-[6px] border-[0.5px] border-color-border-grey shadow-[1px_3px_5px_rgba(0,0,0,0.1)] z-[3001]">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                setVisible={setVisible}
                notification={notification}
              />
            ))}
            <Link
              to="#"
              className="flex p-4 border-t border-border-color-border-grey"
            >
              SEE ALL ACTIVITIES
            </Link>
          </div>
        </>
      )}
    </div>
  );
});
