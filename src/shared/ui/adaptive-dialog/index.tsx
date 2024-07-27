import { useMediaQuery } from "react-responsive";
import { MyDrawer } from "@/components/drawer";
import { MyDialog } from "@/components/my-dialog";
import type { Dispatch, SetStateAction } from "react";
import type { ReactNode } from "react";

interface AdaptiveDialogProps {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  button?: ReactNode;
  classNameDrawer?: string;
  children: ReactNode;
  hideCloseBtn?: boolean;
  dismissible?: boolean;
}

export const AdaptiveDialog = ({
  open,
  setOpen,
  button,
  classNameDrawer,
  children,
  hideCloseBtn,
  dismissible,
}: AdaptiveDialogProps) => {
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