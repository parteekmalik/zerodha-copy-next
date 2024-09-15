import { ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function InfoHover({
  children,
  info,
  options = { position: "center",isHoverOn:true },
}: {
  info: string | ReactNode;
  children: ReactNode;
  options?: {
    isClick?: boolean;
    isHoverOn?: boolean;
    isHoverOnChild?: boolean;
    paddingFromTop?: number | string;
    position?: "center" | "left" | "right";
  };
}) {
  const [isopened, setisopened] = useState(false);
  const [isVisible, setisVisible] = useState(false);
  useEffect(() => {
    if (isopened) {
      const handleClickOutside = (event: MouseEvent) => {
        // Close the component if it's open
        setisopened(false);
        setisVisible(false);
      };

      // Add event listener to handle clicks anywhere on the DOM
      document.addEventListener("click", handleClickOutside);

      // Cleanup the event listener on component unmount
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isopened]);
  return (
    <div className="relative">
      <div
        {...(options?.isHoverOn && {
          onMouseEnter: () => setisVisible(true),
          onMouseLeave: () => setisVisible(false),
        })}
        onClick={
          options?.isClick ? () => setisopened((prev) => !prev) : undefined
        }
      >
        {info}
      </div>
      <div
        className={twMerge(
          isopened || isVisible ? "visible" : "invisible",
          options.position === "right"
            ? "right-0"
            : options.position === "left"
              ? "left-0"
              : "left-1/2 -translate-x-1/2",
          " absolute top-full z-50  flex flex-col items-center  p-2  pt-0  text-background ",
        )}
        style={{ paddingTop: options?.paddingFromTop }}
        onClick={() => setisopened(false)}
        {...(options?.isHoverOnChild && {
          onMouseEnter: () => setisVisible(true),
          onMouseLeave: () => setisVisible(false),
        })}
      >
        {typeof children === "string" ? (
          <span className="mt-3 text-nowrap rounded-md bg-foreground px-2">
            {children}
          </span>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
export default InfoHover;
