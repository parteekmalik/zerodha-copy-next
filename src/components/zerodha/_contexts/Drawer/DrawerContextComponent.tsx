import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  Drawer,
  DrawerContent,
  DrawerTitle
} from "~/components/ui/drawer"; // Assuming these components are pre-configured in your project
import useDeviceType from "../../_hooks/useDeviceType";
import { RootState } from "../../_redux/store";
import TempOrderForm from "../../OrderForm/orderForm";

// Define the DrawerContext type
interface DrawerContextType {
  openDrawer: (content: ReactNode, title?: string) => void;
  closeDrawer: () => void;
}

// Create the DrawerContext
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

// DrawerProvider component that manages state and content
export const DrawerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<ReactNode>(null);
  const [drawerTitle, setDrawerTitle] = useState<string | undefined>(undefined);

  // Function to open the drawer with content and an optional title
  const openDrawer = (content: ReactNode, title?: string) => {
    setDrawerContent(content);
    setDrawerTitle(title ?? ""); // Set the title if provided
    setIsOpen(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsOpen(false);
    setDrawerContent(null);
    setDrawerTitle(undefined);
  };
  const FormData = useSelector((state: RootState) => state.FormData);

  useEffect(() => {
    setIsOpen(FormData.isvisible);
    setTimeout(() => {
      const inputs = document.getElementsByTagName("input");
      Array.from(inputs).forEach((input) => input.blur());
    }, 0);
  }, [FormData]);
  const {DeviceType,isDeviceCompatible}=useDeviceType();
  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}

      {/* Drawer rendering */}
      {isDeviceCompatible("lg") ? null : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTitle></DrawerTitle>
          <DrawerContent>
            <div className="flex flex-col">
              {drawerContent ?? <TempOrderForm isdraggable={false} />}
            </div>
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
