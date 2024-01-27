import React from "react";
import { Tdata, TrightSideType } from "../../page";
import Chart from "./chart";

function RightSide({ data }: { data: TrightSideType }) {
  switch (data.type) {
    case "chart": {
      return (
        <Chart
          symbolName={"FOREXCOM:" + "XAUUSD"}
          chartewidth={"100%"}
          charteheight={"100%"}
        />
      );
    }
    default:return(<div>{data.type}</div>)
  }
}

export default RightSide;
