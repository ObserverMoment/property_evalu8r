import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { PrimaryButton, SecondaryButton } from "./styled";

interface DrawerOpeningButtonProps {
  btnText: string;
  showheader: boolean;
}

/// A button which opens a drawer...
export const DrawerOpeningButton = ({
  btnText,
  children,
  showheader,
}: PropsWithChildren<DrawerOpeningButtonProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <PrimaryButton onClick={onOpen}>{btnText}</PrimaryButton>
      <MyDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        showheader={showheader}
      >
        {children}
      </MyDrawer>
    </>
  );
};

interface MyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef: React.MutableRefObject<any>;
  showheader: boolean;
}

export const MyDrawer = ({
  isOpen,
  onClose,
  btnRef,
  children,
  showheader,
}: PropsWithChildren<MyDrawerProps>) => {
  return (
    <Drawer
      size="xs"
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        {showheader && (
          <DrawerHeader>
            Drawer Title
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => {}}>Save</PrimaryButton>
          </DrawerHeader>
        )}
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MyDrawer;
