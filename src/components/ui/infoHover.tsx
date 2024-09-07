import React, { ReactNode } from "react";

function InfoHover({ children, info }: { info: string; children: ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <div className="invisible absolute left-1/2 top-full -translate-x-1/2  rounded-lg bg-black px-2  text-white group-hover:visible">
        <Triangle size={10} color="black" />
        <span className="text-nowrap">{info}</span>
      </div>
    </div>
  );
}

export default InfoHover;

interface TriangleProps {
  size: number | string; // Size of the triangle
  color: string; // Color of the triangle (e.g., black for the tooltip)
}

const Triangle: React.FC<TriangleProps> = ({ size, color }) => {
  const borderSize = `${size}px`;

  return (
    <div
      className="absolute -top-1"
      style={{
        borderLeft: `${borderSize} solid transparent`,
        borderRight: `${borderSize} solid transparent`,
        borderBottom: `${borderSize} solid ${color}`,
        width: 0,
        height: 0,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    />
  );
};
