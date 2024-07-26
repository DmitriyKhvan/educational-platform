import { APPOINTMENTS_QUERY } from "@/shared/apollo/graphql";
import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/auth-provider";
import {
	DiscountType,
	getItemToLocalStorage,
} from "@/shared/constants/global";

import { PromoBanner } from "@/components/buy-package/promo-banner";
import Loader from "@/components/loader/loader";
import { useActivePackages } from "@/shared/utils/use-active-packages";
import { useMediaQuery } from "react-responsive";
import DashboardCard from "@/pages/students/student-dashboard/dashboard-card";
import MyLessons from "@/pages/students/student-dashboard/my-lessons";
import MyProgress from "@/pages/students/student-dashboard/my-progress";
import ScheduleBanner from "@/pages/students/student-dashboard/schedule-banner";

import { currencyFormat } from "@/shared/utils/currency-format";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
	const isDesktop = useMediaQuery({ minWidth: 1400 });

	const [t] = useTranslation("dashboard");

	const { user } = useAuth();

	const discount = useMemo(() => {
		if (user?.personalPromotionCodes?.length > 0) {
			return user.personalPromotionCodes[0]?.discountType ===
				DiscountType.PERCENT
				? `${user.personalPromotionCodes[0].value}%`
				: currencyFormat({ number: user.personalPromotionCodes[0].value });
		}
	}, [user]);

	const { activePackages, isLoading } = useActivePackages();

	const {
		data: { lessons: appointments } = {},
		loading: lessonLoading,
		refetch,
	} = useQuery(APPOINTMENTS_QUERY, {
		fetchPolicy: "network-only",
		notifyOnNetworkStatusChange: true,
		variables: {
			status: "scheduled,rescheduled,paid,completed,in_progress,approved",
			studentId: getItemToLocalStorage("studentId"),
		},
	});

	return (
		<>
			{lessonLoading || isLoading ? (
				<Loader height="100%" />
			) : (
				<div className="bg-color-dashboard-bg min-h-full pb-8 flex flex-wrap -m-5 sm:-mx-10 sm:-my-8">
					<div className="space-y-1 sm:space-y-8 sm:max-w-[524px] mx-auto sm:mt-10 w-full">
						<DashboardCard
							title={t("student_dashboard_welcome", {
								ns: "dashboard",
								name: user.firstName,
							})}
							subtitle={t("student_dashboard_subtitle", { ns: "dashboard" })}
						>
							<ScheduleBanner activePackages={activePackages} />
						</DashboardCard>

						{!isDesktop && (
							<div className="space-y-1 sm:space-y-8">
								<MyLessons
									fetchAppointments={refetch}
									appointments={appointments}
									packageSubscriptions={activePackages}
								/>

								{user.personalPromotionCodes.length > 0 && (
									<Link className="block" to="/purchase">
										<PromoBanner
											icon={<span className="text-xl">🎁</span>}
											title={`You received a ${discount} discount`}
											text="Purchase a package to use it now!"
											className="flex bg-[#F14E1C]"
										/>
									</Link>
								)}
							</div>
						)}
						<MyProgress
							fetchAppointments={refetch}
							appointments={appointments}
						/>
					</div>

					{isDesktop && (
						<div className="w-full mx-auto sm:max-w-[524px] sm:mt-10 mt-1 space-y-1 sm:space-y-8">
							<MyLessons
								fetchAppointments={refetch}
								appointments={appointments}
								packageSubscriptions={activePackages}
							/>

							{user.personalPromotionCodes.length > 0 && (
								<Link className="block" to="/purchase">
									<PromoBanner
										icon={<span className="text-xl">🎁</span>}
										title={`You received a ${discount} discount`}
										text="Purchase a package to use it now!"
										className="flex bg-[#F14E1C]"
									/>
								</Link>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
};
export default StudentDashboard;
