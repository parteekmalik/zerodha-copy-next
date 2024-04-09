import { useContext } from "react";
import { useSelector } from "react-redux";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import { RootState } from "../../_redux/store";
import Dashboard from "./Dashboard";
import Funds from "./Funds";
import Order from "./Order";
import Chart from "./chart";

function RightSide() {
  const data = useSelector((state: RootState) => state.rightSide);
  const symbolsList = useSelector((state: RootState) => state.symbolsList);
  const Livestream = useSelector((state: RootState) => state.Livestream);

  switch (data.type) {
    case "chart": {
      return (
        <Chart
          symbolName={"BINANCE:" + data.symbol}
          chartewidth={"100%"}
          charteheight={"100%"}
        />
      );
    }
    case "Dashboard": {
      return <Dashboard />;
    }
    case "Orders": {
      return <Order />;
    }
    // case "Positions": {
    //   return <Positions />;
    // }
    case "Funds": {
      return <Funds />;
    }
    // case "Holdings": {
    //   return <Holdings />;
    // }
    default:
      return (
        <div className="text-">
          <div>
            {Object.keys(Livestream).map((key) => {
              const item = Livestream[key];
              return (
                <div className="" key={key}>
                  {JSON.stringify(item)}
                </div>
              );
            })}
          </div>
          {/* <div>{symbolLiveState.Livestream}</div> */}
          <div>{JSON.stringify(Object.keys(symbolsList))}</div>
        </div>
      );
  }
}

export default RightSide;
