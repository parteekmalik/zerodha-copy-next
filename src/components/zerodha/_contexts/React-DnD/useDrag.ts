// src/hooks/useDrag.ts
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export const useDrag = () => {
  // Calculate initial position to be in the middle bottom of the viewport
  const parentDivRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number, y: number }|null>(null);
  const [boxSize,setboxSize] = useState<null|DOMRect>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(()=>{if(parentDivRef.current)setboxSize(parentDivRef.current.getBoundingClientRect())},[])
  const handleMouseDown = (event: React.MouseEvent) => {
    if (parentDivRef.current && parentDivRef.current.contains(event.target as Node)) {
      setIsDragging(true);
      const { left, top } = parentDivRef.current.getBoundingClientRect();
      setOffset({
        x: event.clientX - left, // Get mouse offset from the left edge
        y: event.clientY - top, // Get mouse offset from the top edge
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // New function to calculate the new position based on the mouse movement
  const calculateNewPosition = (event: MouseEvent) => {
    if (!parentDivRef.current) return;

    const { width, height } = parentDivRef.current.getBoundingClientRect();

    // Calculate new position
    let newX = event.clientX - offset.x;
    let newY = event.clientY - offset.y;

    // Boundary checks
    const minX = 0; // Minimum X position
    const minY = 0; // Minimum Y position
    const maxX = window.innerWidth - width; // Maximum X position
    const maxY = window.innerHeight - height; // Maximum Y position

    // Constrain the position within the boundaries
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    return { newX, newY };
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;

      const newPosition = calculateNewPosition(event);
      if (newPosition) setPosition({ x: newPosition.newX, y: newPosition.newY });
    },
    [isDragging, offset],
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return { position, isDragging, handleMouseDown, parentDivRef,boxSize };
};
