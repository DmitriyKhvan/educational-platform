import { forwardRef } from "react";
import cls from "@/components/form/button/button.module.css";

const Button = forwardRef(function Button(props, ref) {
	const {
		type = "button",
		disabled = false,
		children,
		className,
		theme = "purple",
		...otherProps
	} = props;

	return (
		<button
			disabled={disabled}
			type={type}
			{...otherProps}
			className={`${cls.btn} ${cls[theme]} ${className}`}
			ref={ref}
		>
			{children}
		</button>
	);
});

export default Button;
