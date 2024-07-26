import Button from "@/components/form/button";
import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineInfo } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const NotEnoughCreditsModal = ({ confirmLesson, repeat }) => {
	const navigate = useNavigate();
	const [t] = useTranslation("modals");
	return (
		<section className="w-[336px] text-center">
			<div className="mx-auto mb-4 w-12 h-12 bg-color-purple bg-opacity-10 rounded-lg flex justify-center items-center">
				<span className="w-5 h-5 bg-color-purple rounded-full flex justify-center items-center">
					<AiOutlineInfo className="text-white" />
				</span>
			</div>
			<h2 className="text-[22px] leading-8 mb-4 font-bold text-color-dark-violet whitespace-break-spaces">
				{t("not_enough_credits", { count: repeat })}
			</h2>
			<p className="text-[15px] text-color-dark-violet mb-6">
				{t("some_classes_cant_be_scheduled")}
			</p>

			<Button className="w-full h-14 mb-3" onClick={() => confirmLesson(true)}>
				{t("continue_booking")}
			</Button>
			<Button
				theme="dark_purple"
				className="w-full h-14"
				onClick={() => navigate("/purchase")}
			>
				{t("purchase_more_credits")}
			</Button>
		</section>
	);
};

export default NotEnoughCreditsModal;
