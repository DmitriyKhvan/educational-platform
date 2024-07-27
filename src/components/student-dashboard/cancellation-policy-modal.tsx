
import { useTranslation } from "react-i18next";
import { FaChevronLeft } from "react-icons/fa6";

const CancellationPolicyModal = ({ setTabIndex }: {
	setTabIndex: (index: number) => void;
}) => {
	const [t] = useTranslation("modals");
	return (
		<div className="flex flex-col max-w-[400px] w-full mx-auto p-4">
			<h2 className="text-[22px] font-bold mb-6 justify-center relative flex items-center">
				<button className="absolute left-0 ms-0" onClick={() => setTabIndex(0)}>
					<FaChevronLeft className="w-5 h-5" />
				</button>
				Cancellation Policy
			</h2>
			<div className="font-normal text-sm mb-4">
				{t("cancellation_policy_1")}
			</div>
			<div className="font-normal text-sm mb-4">
				{t("cancellation_policy_2")}
			</div>
			<div className="font-normal text-sm mb-4">
				{t("cancellation_policy_3")}
			</div>
			<div className="font-normal text-sm mb-4">
				{t("cancellation_policy_4")}
			</div>
		</div>
	);
};

export default CancellationPolicyModal;
