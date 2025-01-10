import React, { type ReactNode } from "react";

async function layout({ children, total }: { children: ReactNode; total: ReactNode }) {
  return (
    <>
      {total}
      {children}
    </>
  );
}

export default layout;
