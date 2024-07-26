import { addHours, differenceInHours } from "date-fns";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSchedule } from "@/pages/students/schedule-lesson/schedule-selector/schedule-provider";

import Button from "@/components/form/button";

export const TimeOfDay = memo(function TimeOfDay({ timeOfDay, idx }) {
	const {
		setTimeOfDayInterval,
		setTimeClicked,
		timeClicked,
		todayUserTimezone,
		morningInterval,
		afternoonInterval,
		eveningInterval,
		endMonth,
		hourPrior, //48(prod) or 0(dev)
	} = useSchedule();
	const [t] = useTranslation("common");

	const selectTimeOfDay = () => {
		setTimeClicked(idx);

		if (timeOfDay === "Morning") {
			if (
				differenceInHours(morningInterval.start, todayUserTimezone) <= hourPrior
			) {
				setTimeOfDayInterval({
					start: addHours(todayUserTimezone, hourPrior),
					end: morningInterval.end,
				});
			} else if (differenceInHours(morningInterval.end, endMonth) > 0) {
				setTimeOfDayInterval({
					start: morningInterval.start,
					end: endMonth,
				});
			} else {
				setTimeOfDayInterval(morningInterval);
			}
		}

		if (timeOfDay === "Afternoon") {
			if (
				differenceInHours(afternoonInterval.start, todayUserTimezone) <=
				hourPrior
			) {
				setTimeOfDayInterval({
					start: addHours(todayUserTimezone, hourPrior),
					end: afternoonInterval.end,
				});
			} else if (differenceInHours(afternoonInterval.end, endMonth) > 0) {
				setTimeOfDayInterval({
					start: afternoonInterval.start,
					end: endMonth,
				});
			} else {
				setTimeOfDayInterval(afternoonInterval);
			}
		}

		if (timeOfDay === "Evening") {
			if (
				differenceInHours(eveningInterval.start, todayUserTimezone) <= hourPrior
			) {
				setTimeOfDayInterval({
					start: addHours(todayUserTimezone, hourPrior),
					end: eveningInterval.end,
				});
			} else if (differenceInHours(eveningInterval.end, endMonth) > 0) {
				setTimeOfDayInterval({
					start: eveningInterval.start,
					end: endMonth,
				});
			} else {
				setTimeOfDayInterval(eveningInterval);
			}
		}
	};

	return (
		<Button
			theme="outline"
			className={`
        w-full h-[50px] text-sm font-normal my-3
        ${idx === timeClicked && "text-white bg-color-purple"}
      `}
			onClick={selectTimeOfDay}
		>
			{t(timeOfDay)}
		</Button>
	);
});
