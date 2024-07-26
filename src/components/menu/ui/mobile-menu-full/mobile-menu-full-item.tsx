
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { useNotifications } from "@/app/providers/notification-provider";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog/index.jsx";
import { Badge } from "@/components/badge";

export const MobileMenuFullItem = ({ menu }) => {
	const { currentStudent } = useAuth();
	const [t] = useTranslation("sidebar");
	const { getCountNotification } = useNotifications();

	return (
		<li>
			{getCountNotification(menu.label) > 0 && (
				<Badge count={getCountNotification(menu.label)} />
			)}

			{menu.type === "external" ? (
				<a
					className="group flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 bg-[#F7F8FA]  hover:bg-color-purple cursor-pointer"
					href="#"
					onClick={(e) => {
						e.preventDefault();
						window.open(menu.link);
					}}
				>
					<menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white" />
					<span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white">
						{t(menu.label)}
					</span>
				</a>
			) : menu.type === "modal" ||
				(menu.type === "trial" && currentStudent?.isTrial) ? (
				<AdaptiveDialog
					button={
						<span className="group flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 bg-[#F7F8FA] hover:bg-color-purple cursor-pointer">
							<menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white" />
							<span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover:text-white group-[.active]:text-white">
								{t(menu.label)}
							</span>
						</span>
					}
				>
					{menu.modal}
				</AdaptiveDialog>
			) : (
				<NavLink
					to={menu.link}
					className={({ isActive }) =>
						"group/item flex flex-col justify-center items-center gap-3 h-[84px] sm:h-[106px] rounded-lg transition ease-in-out delay-150 bg-[#F7F8FA] hover:bg-color-purple cursor-pointer" +
						(isActive ? " group/active active bg-color-purple" : "")
					}
				>
					<menu.icon className="text-[28px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover/item:text-white group-[.active]/active:text-white" />
					<span className="text-[13px] transition ease-in-out delay-150 text-color-dark-purple font-medium group-hover/item:text-white group-[.active]/active:text-white">
						{t(menu.label)}
					</span>
				</NavLink>
			)}
		</li>
	);
};
