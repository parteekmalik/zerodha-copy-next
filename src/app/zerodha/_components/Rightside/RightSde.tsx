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
        <div>
          <div>{JSON.stringify(symbolLiveState.subscriptions)}</div>
          <div>{JSON.stringify(symbolLiveState.last24hrdata)}</div>
          <div>{JSON.stringify(symbolLiveState.Livestream)}</div>
          <div>{JSON.stringify(Object.keys(symbolLiveState.symbolsList))}</div>
        </div>
      );
  }
}

export default RightSide;
