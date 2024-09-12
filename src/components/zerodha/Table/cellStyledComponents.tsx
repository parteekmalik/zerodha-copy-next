import { twMerge } from "tailwind-merge";

export function FadedColoredCell({
  text,
  bgColor,
  textColor,
}: {
  text: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div key={"hi"} className={twMerge("relative  m-auto")}>
      <div
        className={twMerge(
          "absolute left-0 top-0 h-full w-full rounded-sm opacity-30  ",
          bgColor,
        )}
      ></div>
      <span className={textColor}>{text}</span>
    </div>
  );
}
