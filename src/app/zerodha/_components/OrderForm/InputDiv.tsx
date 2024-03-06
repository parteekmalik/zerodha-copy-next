import { UseFormRegister } from "react-hook-form";

function InputDiv({
  data: { label, isSelected },
  register,
  fileldName,
  Type,
}: {
  data: { label: string; isSelected: boolean };
  register: UseFormRegister<{
    orderType: "BUY" | "SELL";
    quantity: number;
    price: number;
    sl: number;
    tp: number;
    symbolName: string;
    marketType: "SPOT" | "MARGIN";
  }>;
  Type: string;
  fileldName:
    | "orderType"
    | "quantity"
    | "price"
    | "sl"
    | "tp"
    | "symbolName"
    | "marketType";
}) {
  return (
    <div className="relative">
      <input
        type={Type}
        className="m-2 rounded-[3px] border p-[10px_15px] focus:border-black focus:outline-none "
        disabled={!isSelected}
        style={
          !isSelected
            ? {
                backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg width="6" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M5 0h1L0 6V5zm1 5v1H5z" fill="%23ddd" fill-rule="evenodd"/></svg>')`,
              }
            : {}
        }
        {...register(fileldName)}
      />
      <div className=" absolute " style={{ top: "0px", left: "0px" }}>
        <div className="ml-5 bg-white ">{label}</div>
      </div>
    </div>
  );
}
export default InputDiv;
