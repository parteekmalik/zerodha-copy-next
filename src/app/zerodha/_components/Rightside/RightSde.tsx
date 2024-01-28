import React from "react";
import { Tdata, TrightSideType } from "../../page";
import Chart from "./chart";
import Dashboard from "./Dashboard";

function RightSide({ data }: { data: TrightSideType }) {
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
      return <div>{data.type}</div>;
  }
}

export default RightSide;
