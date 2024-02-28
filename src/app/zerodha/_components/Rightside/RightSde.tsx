import { useContext } from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import DataContext from "../../_contexts/data/data";
import Dashboard from "./Dashboard";
import Chart from "./chart";

function RightSide() {
  const { symbolLiveState } = useContext(SymbolLiveContext);
  const data = useContext(DataContext).dataState.rightSideData;
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
    default:
      return (
        <div className="text-">
          <div>{JSON.stringify(symbolLiveState.last24hrdata)}</div>
          <div>
            {Object.keys(symbolLiveState.Livestream).map((key) => {
              const item = symbolLiveState.Livestream[key];
              return (
                <div className="" key={key}>
                  {JSON.stringify(item)}
                </div>
              );
            })}
          </div>
          {/* <div>{symbolLiveState.Livestream}</div> */}
          <div>{JSON.stringify(Object.keys(symbolLiveState.symbolsList))}</div>
        </div>
      );
  }
}

export default RightSide;
