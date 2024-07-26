// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

export const SessionsPerWeek = memo(function SessionsPerWeek({
	uniqueSessionsPerWeek,
	setSelectedSessionsPerWeek,
	selectedSessionsPerWeek,
}: {
	uniqueSessionsPerWeek: number[];
	setSelectedSessionsPerWeek: (sessionsPerWeek: number) => void;
	selectedSessionsPerWeek: number | null;
}) {
	const [t] = useTranslation("purchase");
	const [parent] = useAutoAnimate();

	return (
		<div>
			<h4 className="text-[15px] font-semibold leading-[18px] mb-4">
				2. {t("choose_schedule")}
			</h4>
			<div className="grid grid-cols-2 md:flex md:flex-wrap gap-3" ref={parent}>
				{uniqueSessionsPerWeek.map((sessionsPerWeek) => {
					return (
						<label key={sessionsPerWeek}>
							<input
								type="radio"
								name="sessionsPerWeek"
								checked={sessionsPerWeek === selectedSessionsPerWeek}
								className="hidden peer"
								onChange={() => {
									setSelectedSessionsPerWeek(sessionsPerWeek);
								}}
							/>

							<div className="flex justify-center md:w-[188px] p-4 rounded-lg border border-color-border-grey peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] hover:border-color-purple/50 transition duration-300 ease-in-out cursor-pointer ">
								<span className="text-sm truncate">
									{t("times_per_week", {
										count: sessionsPerWeek,
										interpolation: {},
									})}
								</span>
							</div>
						</label>
					);
				})}
			</div>
		</div>
	);
});
