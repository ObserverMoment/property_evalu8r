import { PropsWithChildren } from "react";
import { useMediaSize } from "../../../common/useMediaSize";
import { Drawer } from "antd";

interface ResponsiveDrawerProps {
  drawerKey: string;
  closable: boolean;
  maskClosable: boolean;
  onClose: () => void;
  open: boolean;
}

export const ResponsiveDrawer = ({
  drawerKey,
  closable,
  maskClosable,
  onClose,
  open,
  children,
}: PropsWithChildren<ResponsiveDrawerProps>) => {
  const deviceSize = useMediaSize();
  return (
    <Drawer
      key={drawerKey}
      placement="right"
      closable={closable}
      maskClosable={maskClosable}
      onClose={onClose}
      open={open}
      width={deviceSize === "small" ? "100%" : "400px"}
      zIndex={9999999}
    >
      {children}
    </Drawer>
  );
};
