import React, { useMemo, useState } from 'react';
import { NotificationItem } from './NotificationItem';
import Button from 'src/components/Form/Button';
import { HiTrash } from 'react-icons/hi';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { isAfter, subMonths, subWeeks, subYears } from 'date-fns';

const NotificationsModal = ({ notifications, removeNotifications }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const lastLabel = useMemo(() => {
    if (!notifications?.length) return 'No notifications';
    if (isAfter(new Date(notifications[0].createdAt), subWeeks(new Date(), 1)))
      return 'Last week';
    if (isAfter(new Date(notifications[0].createdAt), subMonths(new Date(), 1)))
      return 'Last month';
    if (isAfter(new Date(notifications[0].createdAt), subYears(new Date(), 1)))
      return 'Last year';
    return '';
  }, [notifications]);

  return (
    <div className="w-full sm:w-[368px]">
      <h2 className="m-5 font-bold text-xl leading-6">Notifications</h2>

      <span className="block text-center text-sm text-gray-400 mb-4">
        {lastLabel}
      </span>

      <div className="max-h-[400px] overflow-auto space-y-4 px-5">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      <div className="m-5">
        {!!notifications?.length && (
          <AdaptiveDialog
            open={openDialog}
            setOpen={setOpenDialog}
            button={
              <Button theme="red" className="w-full">
                <HiTrash className="text-xl" /> Clear All Messages
              </Button>
            }
          >
            <h2 className="text-[22px] leading-[26px] font-bold text-center mb-4">
              Clear all messages
            </h2>
            <p className="text-[15px] leading-6 mb-6 text-center">
              Are you sure you want to clear all messages?
            </p>
            <Button
              theme="red"
              onClick={() => removeNotifications()}
              className="w-full mb-3 bg-color-red text-white"
            >
              Yes
            </Button>

            <Button
              theme="gray"
              onClick={() => setOpenDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </AdaptiveDialog>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;
