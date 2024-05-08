import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { MyDrawer } from './Drawer';
// import { MyDialog } from './Dialog';
import { MyDialog } from './MyDialog';

export const AdaptiveDialog = ({
  open,
  setOpen,
  button,
  classNameDrawer,
  children,
  hideCloseBtn,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  return isMobile ? (
    <MyDrawer
      open={open}
      setOpen={setOpen}
      button={button}
      className={classNameDrawer}
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
