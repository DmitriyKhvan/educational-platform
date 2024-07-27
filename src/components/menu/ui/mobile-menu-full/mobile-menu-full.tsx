import { useMenuList } from "@/components/menu/lib/use-menuList";
import { MobileMenuFullItem } from "@/components/menu/ui/mobile-menu-full/mobile-menu-full-item";

import { ReferBanner } from "@/components/refer-banner";
import { LangCurrencySwitcher } from "@/widgets/lang-currency-switcher";
import { FaXmark } from "react-icons/fa6";

export const MobileMenuFull = ({ setOpen }: {
	setOpen: (open: boolean) => void;
}) => {
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
