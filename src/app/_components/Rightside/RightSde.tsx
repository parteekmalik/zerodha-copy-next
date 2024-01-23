import React from "react";
import { Tdata } from "../../page";
import Chart from "../chart";

function RightSide({ data }: { data: Tdata }) {
  switch (data.rightSide) {
    case "chart": {
      return (
        <Chart
          symbolName={"BINANCE:" + "BTCUSDT"}
          chartewidth={"100%"}
          charteheight={"100%"}
        />
      );
    }
  }
}

export default RightSide;
