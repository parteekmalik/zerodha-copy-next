import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Drawer, DrawerContent, DrawerTitle } from "~/components/ui/drawer"; // Assuming these components are pre-configured in your project
import useDeviceType from "../../_hooks/useDeviceType";
import { type RootState } from "../../_redux/store";
import TempOrderForm from "../../OrderForm/orderForm";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/react";

// Define the DrawerContext type
interface DrawerContextType {
  openDrawer: (content: ReactNode, title?: string) => void;
  closeDrawer: () => void;
}

// Create the DrawerContext
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

type sizes = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
// DrawerProvider component that manages state and content
export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<ReactNode>(null);
  const [drawerTitle, setDrawerTitle] = useState<string | undefined>(undefined);

  // Function to open the drawer with content and an optional title
  const openDrawer = (content: ReactNode, title?: string) => {
    setDrawerContent(content);
    setDrawerTitle(title);
    // setIsOpen(true);
    onOpen();
  };

  // Function to close the drawer
  const closeDrawer = () => {
    // setIsOpen(false);
    onClose();
    setDrawerContent(null);
    setDrawerTitle(undefined);
  };
  const FormData = useSelector((state: RootState) => state.FormData);

  useEffect(() => {
    // setIsOpen(FormData.isvisible);
    setTimeout(() => {
      const inputs = document.getElementsByTagName("input");
      Array.from(inputs).forEach((input) => input.blur());
    }, 0);
  }, [FormData]);
  const { isDeviceCompatible } = useDeviceType();
  const { onOpenChange, isOpen, onClose, onOpen } = useDisclosure();
  const [size, setSize] = useState<sizes>("md");

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}

      {isDeviceCompatible("lg") ? (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">{drawerTitle}</ModalHeader>
            <ModalBody className="h-fit w-fit">{"drawerContent"}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeDrawer}>
                Close
              </Button>
              <Button color="primary" onPress={closeDrawer}>
                Action
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerTitle>{drawerTitle && <div>{drawerTitle}</div>}</DrawerTitle>
          <DrawerContent>
            <div className="flex flex-col">{drawerContent ?? <TempOrderForm isdraggable={false} />}</div>
          </DrawerContent>
        </Drawer>
      )}
    </DrawerContext.Provider>
  );
};

// Custom hook to use DrawerContext
export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
