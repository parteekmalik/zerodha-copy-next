import React, { type ReactNode } from "react";

async function layout({ children, total }: { children: ReactNode; total: ReactNode }) {
  return (
    <div className="container mx-auto py-6">
      {total}
      {children}
    </div>
  );
}

export default layout;
