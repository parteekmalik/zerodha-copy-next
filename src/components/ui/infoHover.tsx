import { ReactNode } from "react";

function InfoHover({ children, info }: { info: string; children: ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <div className=" invisible absolute left-1/2 top-full flex -translate-x-1/2 flex-col  items-center  text-background group-hover:visible">
        <span className="bg-foreground mt-3 text-nowrap rounded-md px-2">
          {info}
        </span>
      </div>
    </div>
  );
}

export default InfoHover;
