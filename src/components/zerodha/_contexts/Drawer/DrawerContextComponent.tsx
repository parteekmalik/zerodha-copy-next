import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import React, { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Drawer, DrawerContent, DrawerTitle } from "~/components/ui/drawer"; // Assuming these components are pre-configured in your project
import { DragProvider } from "~/components/zerodha/_contexts/React-DnD/DragContext";
import useDeviceType from "../../_hooks/useDeviceType";
import { type RootState } from "../../_redux/store";
import TempOrderForm from "../../OrderForm/orderForm";

// Define the DrawerContext type
interface DrawerContextType {
  openDrawer: (props: drawerType) => void;
  closeDrawer: () => void;
}

// Create the DrawerContext
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

type sizes = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
type drawerType = { title?: string; type: "custom"; content: ReactNode } | { title?: string; type: "orderForm"; content?: ReactNode };
// DrawerProvider component that manages state and content
export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<drawerType | null>(null);
  const { onOpenChange, isOpen, onClose, onOpen } = useDisclosure();
  const { isDeviceCompatible } = useDeviceType();

  // Function to open the drawer with content and an optional title
  const openDrawer = useCallback(
    (props: drawerType) => {
      const content: ReactNode = props.type === "custom" ? props?.content : <TempOrderForm />;
      setDrawerContent({ type: props.type, title: props.title, content });
      onOpen();
    },
    [onOpen],
  );

  // Function to close the drawer
  const closeDrawer = () => {
    onClose();
    setDrawerContent(null);
  };
  const FormData = useSelector((state: RootState) => state.FormData);

  useEffect(() => {
    if (FormData.isvisible) openDrawer({ type: "orderForm" });
    setTimeout(() => {
      const inputs = document.getElementsByTagName("input");
      Array.from(inputs).forEach((input) => input.blur());
    }, 0);
  }, [FormData]);
  const [size, setSize] = useState<sizes>("md");

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      {drawerContent &&
        (isDeviceCompatible("lg") ? (
          drawerContent.type === "orderForm" ? (
            <DragProvider>{drawerContent?.content}</DragProvider>
          ) : (
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{drawerContent?.title}</ModalHeader>
                <ModalBody className="h-fit w-fit">{drawerContent?.content}</ModalBody>
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
          )
        ) : (
          <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerTitle>{drawerContent?.title && <div>{drawerContent?.title}</div>}</DrawerTitle>
            <DrawerContent>
              <div className="flex flex-col">{drawerContent?.content}</div>
            </DrawerContent>
          </Drawer>
        ))}
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
