import { cn } from "@/shared/utils/functions";
import React from "react";

export const PromoBanner = ({ icon, title, text, className }) => {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-4 mb-10 p-4 rounded-[10px]",
				className,
			)}
		>
			<div className="flex items-center justify-center rounded-lg w-[44px] h-[44px] bg-white/30 text-white">
				{icon}
			</div>
			<div className="text-white">
				<h4 className="text-[15px] font-bold">{title}</h4>
				<p className="text-[13px]">{text}</p>
			</div>
		</div>
	);
};
