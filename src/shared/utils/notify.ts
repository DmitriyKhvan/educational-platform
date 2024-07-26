import i18next from "i18next";
import toast from "react-hot-toast";

const notify = (message, type = "success") => {
	let messageParse = message;

	if (message.includes("\n") || message.includes(".js")) {
		messageParse = i18next.t("error_system", { ns: "common" });
	}

	toast[type](messageParse, {
		position: "top-center",
		duration: 5000,
	});
};

export default notify;
