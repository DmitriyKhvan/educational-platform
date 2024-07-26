import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { FaXmark } from "react-icons/fa6";

export const MyDialog = ({ open, setOpen, button, children, hideCloseBtn }) => {
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{button}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
				<Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[calc(100vh-200px)] overflow-auto rounded-[6px] bg-white px-8 py-10 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-30">
					{!hideCloseBtn && (
						<Dialog.Close className="absolute right-4 top-4 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-color-border-grey/20">
							<FaXmark className="text-color-light-grey" />
						</Dialog.Close>
					)}
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
