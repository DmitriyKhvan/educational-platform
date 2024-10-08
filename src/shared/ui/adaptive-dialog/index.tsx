import { MyDrawer } from '@/components/drawer';
import { MyDialog } from '@/components/my-dialog';
import type { Dispatch, SetStateAction } from 'react';
import type { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

interface AdaptiveDialogProps {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  button?: ReactNode;
  classNameDrawer?: string;
  children: ReactNode;
  hideCloseBtn?: boolean;
  dismissible?: boolean;
  className?: string;
  overlayClassname?: string;
}

export const AdaptiveDialog = ({
  open,
  setOpen,
  button,
  classNameDrawer,
  children,
  hideCloseBtn,
  dismissible,
  className,
  overlayClassname,
}: AdaptiveDialogProps) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });

  return isMobile ? (
    <MyDrawer
      open={open}
      setOpen={setOpen}
      button={button}
      className={`${className} ${classNameDrawer}`}
      overlayClassname={overlayClassname}
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
      className={className}
      overlayClassname={overlayClassname}
    >
      {children}
    </MyDialog>
  );
};
