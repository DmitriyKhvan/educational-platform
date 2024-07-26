import React, { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { MyDrawer } from "../../../drawer";
import { useMenuList } from "../../lib/use-menuList";
import { MobileMenuFull } from "../mobile-menu-full";
import { MobileMenuItem } from "./mobile-menu-item";

export const MobileMenu = () => {
	const navLinks = useMenuList();
	const minNavLinks = navLinks.slice(0, 4);
	const gridStyle = {
		gridTemplateColumns: `repeat(${minNavLinks.length + 1}, minmax(0, 1fr))`,
	};

	const [open, setOpen] = useState(false);

	return (
		<div className="sticky bottom-0 left-0 flex justify-center items-center w-full h-16 sm:h-20 bg-white shadow-[4px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
			<ul style={gridStyle} className="grid w-full sm:w-auto">
				{minNavLinks.map((menu) => {
					return <MobileMenuItem key={menu.link} menu={menu} />;
				})}
				<li className="grid justify-center">
					<MyDrawer
						open={open}
						setOpen={setOpen}
						button={
							<button className="group flex flex-col justify-center items-center gap-[5px] sm:w-[118px] cursor-pointer">
								<MdMoreHoriz className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple" />
								<span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple">
									More
								</span>
							</button>
						}
					>
						<MobileMenuFull setOpen={setOpen} />
					</MyDrawer>
				</li>
			</ul>
		</div>
	);
};
