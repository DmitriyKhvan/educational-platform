import React, { memo, useMemo } from 'react';
import { useNotifications } from 'src/app/providers/NotificationProvider';
import { AdaptiveDialog } from 'src/shared/ui/AdaptiveDialog/index.jsx';
import { ModalConfirm } from 'src/entities/ModalConfirm';
import Button from 'src/components/Form/Button';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
export const NotificationDialog = memo(function NotificationDialog() {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  const { notifications, removeNotifications } = useNotifications();

  const bonus = useMemo(() => {
    return notifications.find(
      (notification) => notification.body === 'referral_package_purchased',
    );
  }, [notifications]);

  // So that removeNotifications doesn’t work the first time.
  // Because MyDrawer launches confirmBonus when opening
  let countOpenNotifications = useMemo(() => {
    return 1;
  }, [bonus]);

  const confirmBonus = () => {
    if (countOpenNotifications > 1) {
      removeNotifications(bonus?.body);
    }
    countOpenNotifications++;
  };

  return (
    <AdaptiveDialog
      open={bonus}
      setOpen={isMobile ? confirmBonus : () => removeNotifications(bonus?.body)}
    >
      <ModalConfirm
        icon={
          <div className="w-full flex justify-center mb-6">
            <div className="flex items-center justify-center w-[56px] h-[56px] bg-[#D7BAF7] rounded-lg">
              <span className="text-xl">🎁</span>
            </div>
          </div>
        }
        title={`You have received ${bonus?.meta?.bonusLessonsCount} FREE CLASSES`}
        text="Your friend used your referral link, and you have earned a gift!"
        btns={
          <Link to="/student/schedule-lesson/select">
            <Button
              type="button"
              onClick={
                isMobile ? confirmBonus : () => removeNotifications(bonus?.body)
              }
              className="w-full h-[56px]"
            >
              Book FREE classes
            </Button>
          </Link>
        }
      />
    </AdaptiveDialog>
  );
});
