import { useContext } from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import Dashboard from "./Dashboard";
import Chart from "./chart";
import DataContext from "../../_contexts/data/data";

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
        <div>
          <div>{JSON.stringify(symbolLiveState.Livestream)}</div>
          <div>{JSON.stringify(Object.keys(symbolLiveState.symbolsList))}</div>
        </div>
      );
  }
}

export default RightSide;
