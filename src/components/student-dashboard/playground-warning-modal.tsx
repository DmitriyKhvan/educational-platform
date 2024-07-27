import { useTranslation } from "react-i18next";
import ModalWrapper from "@/components/modal-wrapper/modal-wrapper";

const PlaygroundWarningModal = ({ isWarningOpen, closeModal }: {
	isWarningOpen: boolean;
	closeModal: () => void;
}) => {
	const [t] = useTranslation("modals");
	return (
		<ModalWrapper isOpen={isWarningOpen} closeModal={closeModal}>
			<div>
				<div className="flex items-center justify-between mb-5">
					<div>
						<h2 className="text-2xl font-semibold">
							{t("playground_modal_title")}
						</h2>
					</div>
				</div>
				<div className="w-full text-center text-lg">
					{t("playground_modal_desc")}
				</div>
			</div>
		</ModalWrapper>
	);
};

export default PlaygroundWarningModal;
