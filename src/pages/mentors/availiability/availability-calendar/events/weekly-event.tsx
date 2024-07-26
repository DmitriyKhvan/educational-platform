import { cn } from "@/shared/utils/functions";
import React from "react";
import { COURSE_COLORS, courseColorsDict } from "src/shared/constants/global";
import { EventType } from "./lib/event-type";

const WeeklyEvent = ({ data, eventInfo }) => {
	return (
		<div
			className={cn(
				"px-1 h-full",
				data.type === EventType.EXCEPTION && "px-0",
				data.type === EventType.LESSON && "px-[10px]",
			)}
		>
			<div
				className={cn(
					"px-2 min-h-[41px] w-full flex items-center h-full bg-white text-black rounded-lg overflow-hidden truncate",
					data.type === EventType.REGULAR &&
						"bg-color-purple bg-opacity-15 backdrop-blur-[2px]",
					data.type === EventType.TRIAL &&
						"bg-[#FF9335] bg-opacity-15 backdrop-blur-[2px]",
					data.type === EventType.LESSON &&
						"border-l-4 bg-opacity-15 rounded-[4px] mt-[2px] px-2",
					data.type === EventType.LESSON &&
						!data.isTrial &&
						courseColorsDict[COURSE_COLORS.PURPLE]?.event,
					data.type === EventType.LESSON &&
						data.isTrial &&
						courseColorsDict[COURSE_COLORS.ORANGE]?.event,
					data.type === EventType.EXCEPTION && "bg-[#D1D5DB] ml-[2px]",
				)}
			>
				<p className="w-full overflow-hidden truncate">
					{eventInfo.event.title}
				</p>
			</div>
		</div>
	);
};

export default WeeklyEvent;
