import React from "react";
import { useMenuList } from "../../lib/use-menuList";
import { MobileMenuFullItem } from "./mobile-menu-full-item";

import { FaXmark } from "react-icons/fa6";
import { ReferBanner } from "src/components/refer-banner";
import { LangCurrencySwitcher } from "src/widgets/lang-currency-switcher";

export const MobileMenuFull = ({ setOpen }) => {
	const navLinks = useMenuList();
	return (
		<div className="w-full sm:w-[514px] mx-auto mb-4 space-y-10">
			<div className="relative">
				<FaXmark
					onClick={() => setOpen(false)}
					className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl cursor-pointer"
				/>
				<h4 className="text-center text-xl">Menu</h4>
			</div>
			<ul className="grid grid-cols-3 gap-3">
				{navLinks.map((menu) => {
					return <MobileMenuFullItem key={menu.link} menu={menu} />;
				})}
			</ul>

			<ReferBanner />
			<LangCurrencySwitcher align="end" />
		</div>
	);
};
