export const parseErrorMessage = (error) => {
	try {
		const errorData = JSON.parse(error.message);
		if (typeof errorData !== "object") {
			throw new Error();
		}

		return errorData;
	} catch (e) {
		return false;
	}
};
