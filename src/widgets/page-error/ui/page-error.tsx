import Button from "@/components/form/button";
import React from "react";
import { IoIosWarning } from "react-icons/io";

export const PageError = () => {
	const reloadPage = () => {
		location.reload();
	};

	return (
		<div className="flex w-screen h-screen">
			<div className="max-w-[440px] m-auto flex flex-col items-center">
				<div className="p-3 rounded-lg bg-[rgba(234,_33,_33,_0.10)]">
					<IoIosWarning className="text-2xl text-[#EA2121]" />
				</div>
				<h2 className="text-[clamp(1rem,8vw,2rem)] sm:text-[38px] font-bold leading-8 mt-8">
					Something went wrong
				</h2>
				<p className="text-center mt-4">
					Sorry, random error occurred. Please refresh the page
				</p>

				<Button className="h-[57px] px-12 mt-10" onClick={reloadPage}>
					Refresh the page
				</Button>
			</div>
		</div>
	);
};
