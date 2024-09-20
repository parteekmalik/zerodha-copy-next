import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

function InputDiv({
  data: { label, isDisabled },
  register,
  Type,
  className,
  step = 2,
}: {
  data: { label: string; isDisabled: boolean };
  register: UseFormRegisterReturn<string>;
  className?: string;
  Type: string;
  step?: number;
}) {
  return (
    <div className={className}>
      <div className={twMerge("relative")}>
        <input
          {...register}
          className={twMerge(
            "m-2 rounded-[3px] border border-borderApp p-[10px_15px] focus:border-foreground focus:outline-none ",
          )}
          type={Type === "float" ? "number" : Type}
          step={Type === "float" ? step : 1}
          autoFocus={false}
          autoComplete="off"
          disabled={isDisabled}
          style={
            isDisabled
              ? {
                  backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg width="6" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M5 0h1L0 6V5zm1 5v1H5z" fill="%23ddd" fill-rule="evenodd"/></svg>')`,
                }
              : {}
          }
        />
        <div className=" absolute " style={{ top: "0px", left: "0px" }}>
          <div className="ml-5 bg-background px-[1px] ">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default InputDiv;
