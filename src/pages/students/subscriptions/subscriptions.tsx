import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import { getItemToLocalStorage } from "src/shared/constants/global";
import Loader from "../../../components/loader/loader";
import { PACKAGE_QUERY } from "../../../shared/apollo/graphql";
import { SubscriptionCard } from "./subscription-card";

import Button from "@/components/form/button";
import { getTranslatedTitle } from "@/shared/utils/get-translated-title";
import { FaPlus } from "react-icons/fa6";

const Subscriptions = () => {
	const [t, i18n] = useTranslation(["common", "sidebar"]);
	const [selectedTab, setSelectedTab] = useState("current");
	const navigate = useNavigate();
	const {
		data: { packageSubscriptions: planStatus = [] } = {},
		loading,
	} = useQuery(PACKAGE_QUERY, {
		fetchPolicy: "no-cache",
		variables: {
			studentId: getItemToLocalStorage("studentId"),
		},
	});

	const toPurchase = () => {
		navigate("/purchase");
	};

	const [selectedPackages, setSelectedPackages] = useState([]);

	useEffect(() => {
		if (planStatus?.length) {
			setSelectedPackages(
				selectedTab === "current"
					? planStatus.filter((x) => x.active && x.credits)
					: planStatus.filter((x) => !x.active || !x.credits),
			);
		}
	}, [selectedTab, planStatus]);

	return (
		<div className="max-w-[440px] mx-auto px-5 py-[50px]">
			<div className="flex w-full">
				<Button
					theme="outline"
					className={`w-[50%] ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
						selectedTab === "current" && "bg-color-dark-purple text-white"
					}`}
					onClick={() => setSelectedTab("current")}
				>
					<span>{t("current")}</span>
				</Button>
				<Button
					theme="outline"
					className={`ml-[-4px] w-[50%] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
						selectedTab === "previous" && "bg-color-dark-purple text-white"
					}`}
					onClick={() => setSelectedTab("previous")}
				>
					<span>{t("previous")}</span>
				</Button>
			</div>
			<div>
				<div>
					{loading ? (
						<div className="mt-10">
							<Loader />
						</div>
					) : selectedPackages.length > 0 ? (
						<div className="rounded-[10px] mt-[30px] w-full">
							<div className="flex flex-col gap-3 items-start rounded w-full">
								{selectedPackages.map((x, i) => (
									<SubscriptionCard
										key={i}
										price={x.payment?.buyPrice}
										currency={x.payment?.currency}
										months={x.package?.period}
										duration={x.package?.sessionTime}
										title={getTranslatedTitle(x.package?.course, i18n.language)}
										totalSessions={x.package?.totalSessions}
										sessionsPerWeek={x.package?.sessionsPerWeek}
										costPerClass={x.package?.price / x.package?.totalSessions}
										credits={x.credits}
										active={x.active}
										isReferral={x.package?.isReferral}
									/>
								))}
							</div>
						</div>
					) : (
						<div className="w-fulll text-center mt-16">
							<div className="block text-center opacity-70 text-base">
								{t("no_active_subscriptions", { ns: "common" })}
							</div>
						</div>
					)}
				</div>
				<Button className="w-full mt-10 h-16" onClick={toPurchase}>
					<div className="flex items-center">
						<FaPlus className="mr-3" />
						<span className="me-2">{t("add_package", { ns: "common" })}</span>
					</div>
				</Button>
			</div>
		</div>
	);
};

export default Subscriptions;
