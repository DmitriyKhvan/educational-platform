
import { Link } from "react-router-dom";

import { useMediaQuery } from "react-responsive";

import { MobileMenu } from "@/components/menu/ui/mobile-menu";
import { useAuth } from "@/app/providers/auth-provider";
import { Menu } from "src/components/menu";

import Logo from "@/shared/assets/images/logo_purple.svg";
import { Roles } from "@/shared/constants/global";
import { LangCurrencySwitcher } from "@/widgets/lang-currency-switcher";
// import { BugButton } from 'src/app/providers/ErrorBoundary';

export const Sidebar = () => {
	const { user } = useAuth();
	const isTablet = useMediaQuery({ maxWidth: 1023 });

	return (
		<>
			{isTablet ? (
				<MobileMenu />
			) : (
				<div className="sticky z-20 top-0 left-0 min-w-[280px] max-w-[280px] h-screen pl-8 pr-16 shadow-[4px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
					<Link
						className="flex items-center h-[79px]"
						to={
							user.role === Roles.MENTOR
								? "/mentor/manage-appointments"
								: "/student/manage-lessons"
						}
					>
						<img src={Logo} alt="" />
					</Link>

					<Menu />
					<LangCurrencySwitcher />

					{/* <BugButton /> */}
				</div>
			)}
		</>
	);
};
