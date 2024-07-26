import Button from "@/components/form/button";
import { GENERATE_REFERRAL_LINK } from "@/shared/apollo/mutations/referral-codes";
import notify from "@/shared/utils/notify";
import { useMutation } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaCopy } from "react-icons/fa";
import {
	IoEllipseSharp,
	IoSquareSharp,
	IoTriangleSharp,
} from "react-icons/io5";
import { getItemToLocalStorage } from "src/shared/constants/global";
import { InfoItem } from "./info-item";

export const Info = () => {
	const { t } = useTranslation(["refer"]);

	const info = [
		{
			title: t("share_how_1_title"),
			text: t("share_how_1_subtitle"),
			icon: <IoSquareSharp className="rotate-45 text-[rgba(255,147,53,1)]" />,
			color: "255,147,53",
		},
		{
			title: t("share_how_2_title"),
			text: t("share_how_2_subtitle"),
			icon: <IoEllipseSharp className="text-[rgba(0,217,134,1)]" />,
			color: "0,217,134",
		},
		{
			title: t("share_how_3_title"),
			text: t("share_how_3_subtitle"),
			icon: <IoTriangleSharp className="text-[rgba(25,187,254,1)]" />,
			color: "25,187,254",
		},
	];

	const [generateReferralLink] = useMutation(GENERATE_REFERRAL_LINK);

	const copyReferralLink = async () => {
		try {
			const referralUrl = await generateReferralLink({
				variables: {
					studentId: getItemToLocalStorage("studentId"),
				},
				fetchPolicy: "no-cache",
			});

			await navigator.clipboard.writeText(
				referralUrl.data?.generateReferralLink?.referralUrl,
			);
			notify("Referral link copied to clipboard");
		} catch (error) {
			notify("Error in copying referral link: ", error, "error");
		}
	};

	return (
		<div className="w-full sm:w-[436px]">
			<h2 className="text-[28px] font-bold text-color-dark-purple text-center">
				{t("share_title")}{" "}
			</h2>
			<h5 className="text-gray-400 leading-6 text-center mt-4">
				{t("share_subtitle")}
			</h5>
			<h5 className="text-gray-400 leading-6 text-center">
				{t("share_subtitle_2")}
			</h5>

			<div className="space-y-3 mt-6">
				{info.map((item) => {
					return <InfoItem key={item.color} info={item} />;
				})}
			</div>

			<Button
				onClick={() => copyReferralLink()}
				className="w-full h-[60px] space-x-3 mt-6"
			>
				<FaCopy />
				<span className="text-[15px] font-semibold">{t("copy_link")}</span>
			</Button>
		</div>
	);
};
