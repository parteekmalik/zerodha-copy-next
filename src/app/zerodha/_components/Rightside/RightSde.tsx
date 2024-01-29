import { useContext } from "react";
import SymbolLiveContext from "../../_contexts/SymbolLive/SymbolLive";
import type { TrightSideType } from "../../page";
import Dashboard from "./Dashboard";
import Chart from "./chart";

function RightSide({ data }: { data: TrightSideType }) {
  const { symbolLiveState } = useContext(SymbolLiveContext);
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
