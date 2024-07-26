
import { useMediaQuery } from "react-responsive";
import { MyDrawer } from "@/components/drawer";
import { MyDialog } from "@/components/my-dialog";

export const AdaptiveDialog = ({
	open,
	setOpen,
	button,
	classNameDrawer,
	children,
	hideCloseBtn,
	dismissible,
}) => {
	const isMobile = useMediaQuery({ maxWidth: 639 });
	return isMobile ? (
		<MyDrawer
			open={open}
			setOpen={setOpen}
			button={button}
			className={classNameDrawer}
			dismissible={dismissible}
		>
			{children}
		</MyDrawer>
	) : (
		<MyDialog
			open={open}
			setOpen={setOpen}
			button={button}
			hideCloseBtn={hideCloseBtn}
		>
			{children}
		</MyDialog>
	);
};
