import { useContext } from "react";
import { ScheduleContext } from "./schedule-context";

export const useSchedule = () => {
	return useContext(ScheduleContext);
};
