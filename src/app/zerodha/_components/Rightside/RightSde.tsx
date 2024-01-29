import React, { useContext } from "react";
import { Tdata, TrightSideType } from "../../page";
import Chart from "./chart";
import Dashboard from "./Dashboard";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";

function RightSide({ data }: { data: TrightSideType }) {
  const { symbolLiveState, symbolLiveDispatch, socketSend } =
    useContext(SymbolLiveContext);
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
      return <div>{JSON.stringify(symbolLiveState)}</div>;
  }
}

export default RightSide;
