import React from "react";

export const InfoItem = ({ info }) => {
	const { title, text, icon, color } = info;
	return (
		<div
			style={{ backgroundColor: `rgba(${color},0.1)` }}
			className={`flex items-center gap-4 p-4 rounded-lg`}
		>
			<div
				style={{ backgroundColor: `rgba(${color},0.16)` }}
				className={`min-w-8 min-h-8 flex items-center justify-center rounded`}
			>
				{icon}
			</div>
			<div className="space-y-2">
				<h4
					style={{ color: `rgba(${color},1)` }}
					className={`text-lg font-bold leading-6`}
				>
					{title}
				</h4>
				<p
					style={{ color: `rgba(${color},1)` }}
					className={`text-[15px] leading-[22px]`}
				>
					{text}
				</p>
			</div>
		</div>
	);
};
