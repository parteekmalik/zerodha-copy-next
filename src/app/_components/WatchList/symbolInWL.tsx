import { Tsymbol } from './watchList';

interface ISymbolInWL {
    list : Tsymbol[] | undefined
}
function SymbolInWL({list}:ISymbolInWL) {
  return (
    <div className="flex flex-col grow">
        {list?.map((symbol) => {
          const diff = Number(
            (symbol.curPrice - symbol.prevDayClose).toFixed(2),
          );

          return (
            <div
              className={"flex border-b p-[15px]   " + getColor(diff)}
              style={{ fontSize: ".8125rem" }}
              key={"symbol" + symbol.name}
            >
              <div className="grow">{symbol.name.toUpperCase()}</div>
              <div className="flex">
                <div className="flex opacity-[.7]">
                  <div className="pr-[3px] text-black opacity-[.65] ">
                    {diff}
                  </div>
                  <div className="flex   min-w-[45px]  text-right  text-black  ">
                    <div className="">
                      {(symbol.curPrice / symbol.prevDayClose) * 100}
                    </div>
                    <span className="my-auto text-[.652rem]  ">%</span>
                  </div>
                </div>
                <div className="flex ">
                  <a
                    className={
                      ` px-2 font-semibold    ` +
                      (diff > 0
                        ? "rotate-90 after:content-['<']"
                        : "rotate-90 after:content-['>']")
                    }
                  ></a>
                  <a className="min-w-[60px] text-right">{symbol.curPrice}</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
  )
}

export default SymbolInWL

const getColor = (diff: number) => {
    if (diff > 0) {
      return "text-[#4caf50]";
    } else if (diff < 0) {
      return "text-[#df514c]";
    } else {
      return "";
    }
  };