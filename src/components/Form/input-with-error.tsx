import { forwardRef } from "react";

const InputWithError = forwardRef(function InputWithError(
	{ errorsField, children },
	ref,
) {
	return (
		<div ref={ref}>
			{children}

			{errorsField && (
				<p className="text-[#df1b41] mt-1">{errorsField.message}</p>
			)}
			{/* {JSON.stringify(errorsField, null, 2)} */}
		</div>
	);
});

export default InputWithError;
