import { format, formatDistanceToNow } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';

import { localeDic } from '@/shared/constants/global';
import { Avatar } from '@/widgets/avatar/avatar';

export const NotificationItem = ({ notification }) => {
  const [i18n] = useTranslation();

  return (
    <div className={`p-4 font-semibold group border border-color-border-grey rounded-lg`}>
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          avatarUrl={notification.meta.user.avatar}
          className="w-10 h-10 rounded-full overflow-hidden"
        />

        <span className="truncate text-base font-semibold">
          {notification.meta.user.firstName}{' '}
          {notification.meta.user.lastName && `${notification.meta.user.lastName[0]}.`}
        </span>
      </div>
      <div className="mb-4">
        <span className="font-medium text-sm">
          <Trans
            i18nKey={notification.body}
            ns="lessons"
            values={{
              count: 2,
            }}
            components={{
              purple: <span className="text-color-purple" />,
            }}
          />

          {notification?.meta?.lesson?.date &&
            ` (${format(new Date(notification?.meta?.lesson?.date), 'eee, MMM do', {
              locale: localeDic[i18n.language],
            })})`}
        </span>
        {notification?.meta?.cancelReason && (
          <div className="flex gap-1 text-sm">
            <strong>Reason:</strong>
            <p>{notification?.meta?.cancelReason}</p>
          </div>
        )}

        {notification?.meta?.studentMessage && (
          <div className="flex gap-1 text-sm">
            <strong>Message:</strong>
            <p>{notification?.meta?.studentMessage}</p>
          </div>
        )}
      </div>
      <div>
        {notification?.createdAt && (
          <span className="whitespace-nowrap text-xs font-normal text-color-darker-grey">
            {formatDistanceToNow(new Date(notification?.createdAt), {
              addSuffix: true,
              locale: localeDic[i18n.language],
            })}
          </span>
        )}
      </div>
    </div>
  );
};
