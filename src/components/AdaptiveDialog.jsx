import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { MyDrawer } from './Drawer';
import { MyDialog } from './Dialog';

export const AdaptiveDialog = ({
  open,
  setOpen,
  button,
  classNameDrawer,
  children,
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
    <MyDialog open={open} setOpen={setOpen} button={button}>
      {children}
    </MyDialog>
  );
};
