export function OrderTypeDiv({
  isMarketOrder,
  setFormdata,
}: {
  isMarketOrder: boolean;
  setFormdata: (isSelected: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <CheckBox
        data={{ isSelected: !isMarketOrder, type: "LIMIT" }}
        clickHandler={() => setFormdata(false)}
      />
      <CheckBox
        data={{ isSelected: isMarketOrder, type: "MARKET" }}
        clickHandler={() => setFormdata(true)}
      />
    </div>
  );
}
export function CheckBox({
  data: { isSelected, type },
  clickHandler,
}: {
  data: { isSelected: boolean; type: string };
  clickHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div
      className="flex cursor-pointer items-center justify-center gap-1"
      onClick={clickHandler}
    >
      {!isSelected ? (
        <div className="h-[10px] w-[10px]  rounded-full border border-black opacity-[.75]"></div>
      ) : (
        <div className="flex h-[10px] w-[10px] items-center justify-center rounded-full border border-black ">
          <div className="h-[6px] w-[6px] rounded-full bg-blue-500 "></div>
        </div>
      )}
      <div>{type}</div>
    </div>
  );
}
