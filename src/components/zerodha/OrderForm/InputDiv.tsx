import { UseFormRegisterReturn } from "react-hook-form";

function InputDiv<T>({
  data: { label, isDisabled },
  register,
  Type,
}: {
  data: { label: string; isDisabled: boolean };
  register: UseFormRegisterReturn<string>;

  Type: string;
}) {
  return (
    <div className="relative">
      <input
        type={Type}
        className="m-2 rounded-[3px] border p-[10px_15px] focus:border-black focus:outline-none "
        disabled={isDisabled}
        style={
          isDisabled
            ? {
                backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg width="6" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M5 0h1L0 6V5zm1 5v1H5z" fill="%23ddd" fill-rule="evenodd"/></svg>')`,
              }
            : {}
        }
        {...register}
      />
      <div className=" absolute " style={{ top: "0px", left: "0px" }}>
        <div className="ml-5 px-[1px] bg-background ">{label}</div>
      </div>
    </div>
  );
}

export default InputDiv;
