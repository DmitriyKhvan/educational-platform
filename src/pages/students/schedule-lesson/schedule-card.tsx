import Button from "@/components/form/button";
import React from "react";
import { FaPencil } from "react-icons/fa6";

const ScheduleCard = ({ startTime, endTime, date, setTabIndex }) => {
	return (
		<div className="flex justify-between items-center border border-color-border-grey rounded-lg bg-white p-5 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.04)] w-full">
			<div className="space-y-4">
				<h3 className="text-color-dark-purple text-base sm:text-lg font-bold">
					{`${startTime} - ${endTime}`}
				</h3>

				<p className="text-color-light-grey text-sm">{date}</p>
			</div>

			<div>
				<Button
					className="bg-opacity-10 text-color-purple hover:bg-opacity-100 hover:text-white aspect-square p-1 w-8 h-8"
					onClick={() => setTabIndex(1)}
				>
					<FaPencil className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
};

export default ScheduleCard;
