import React, { type ReactNode } from "react";
import Provider from "./provider";

async function layout({ children, total, panel }: { children: ReactNode; total: ReactNode; panel: ReactNode }) {
  return (
    <Provider>
      <div className="flex grow gap-1">
        <div className="flex grow flex-col">
          {total}
          {children}
        </div>
        {panel}
      </div>
    </Provider>
  );
}

export default layout;
