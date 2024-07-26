import Button from "@/components/form/button";
import { isAfter, subMonths, subWeeks, subYears } from "date-fns";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import { AdaptiveDialog } from "src/shared/ui/adaptive-dialog";
import { NotificationItem } from "./notification-item";

const NotificationsModal = ({ notifications, removeNotifications }) => {
	const [t] = useTranslation(["notifications", "common", "translations"]);
	const [openDialog, setOpenDialog] = useState(false);

	const lastLabel = useMemo(() => {
		if (!notifications?.length) return t("no_notifications");
		if (isAfter(new Date(notifications[0].createdAt), subWeeks(new Date(), 1)))
			return t("last_week");
		if (isAfter(new Date(notifications[0].createdAt), subMonths(new Date(), 1)))
			return t("last_month");
		if (isAfter(new Date(notifications[0].createdAt), subYears(new Date(), 1)))
			return t("last_year");
		return "";
	}, [notifications]);

	return (
		<div className="w-full sm:w-[368px]">
			<h2 className="m-5 font-bold text-xl leading-6">{t("title")}</h2>

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
								<HiTrash className="text-xl" /> {t("clear_all_messages")}
							</Button>
						}
					>
						<h2 className="text-[22px] leading-[26px] font-bold text-center mb-4">
							{t("clear_all_messages")}
						</h2>
						<p className="text-[15px] min-w-[300px] leading-6 mb-6 text-center">
							{t("are_you_sure_to_clear")}
						</p>
						<Button
							theme="red"
							onClick={() => removeNotifications()}
							className="w-full mb-3 bg-color-red text-white"
						>
							{t("yes", { ns: "translations" })}
						</Button>

						<Button
							theme="gray"
							onClick={() => setOpenDialog(false)}
							className="w-full"
						>
							{t("cancel", { ns: "translations" })}
						</Button>
					</AdaptiveDialog>
				)}
			</div>
		</div>
	);
};

export default NotificationsModal;
