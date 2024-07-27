import { NavLink } from "react-router-dom";

import { useAuth } from "@/app/providers/auth-provider";
import { useNotifications } from "@/app/providers/notification-provider";
import { Badge } from "@/components/badge";
import Button from "@/components/form/button";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog";
import { useTranslation } from "react-i18next";

export const MenuItem = ({ menu }: {
	menu: {
		label: string;
		link: string;
		icon: any;
		type: "modal" | "internal" | "external" | "trial";
		modal?: any;
	};
}) => {
	const { currentStudent } = useAuth();
	const [t] = useTranslation("sidebar");
	const { notifications } = useNotifications();

	const getCountNotification = (type: string) => {
		const count = notifications.filter(
			(notification) => notification?.meta?.dashboard === type,
		);
		return count.length;
	};
	return (
		<li className="relative list-none">
			{getCountNotification(menu.label) > 0 && (
				<Badge count={getCountNotification(menu.label)} />
			)}
			{menu.type === "external" ? (
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
			) : menu.type === "modal" ||
				(menu.type === "trial" && currentStudent?.isTrial) ? (
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
						"flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple" +
						(isActive ? " bg-color-purple active" : "")
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
