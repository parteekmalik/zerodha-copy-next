// src/components/DragContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { useDrag } from "./useDrag";

interface DragContextType {
  position: null | { x: number; y: number };
  isDragging: boolean;
  handleMouseDown: (event: React.MouseEvent) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const DragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { position, isDragging,boxSize , parentDivRef, handleMouseDown } = useDrag();

  return (
    <DragContext.Provider value={{ position, isDragging, handleMouseDown }}>
      <div
        className="fixed z-50 h-fit w-fit"
        style={
          position
            ? {
                top: position.y,
                left: position.x,
              }
            : {
                bottom: 0,
                left: `calc(50% - ${boxSize? boxSize.width / 2 : 0}px)`, // Center horizontally
              }
        }
        ref={parentDivRef}
      >
        {children}
      </div>
    </DragContext.Provider>
  );
};

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragContext must be used within a DragProvider");
  }
  return context;
};
