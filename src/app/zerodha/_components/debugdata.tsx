import React, { useContext } from "react";
import DataContext from "../_contexts/data/data";

function Debugdata() {
  const { dataDispatch, dataState } = useContext(DataContext);

  return <div>{JSON.stringify(dataState)}</div>;
}

export default Debugdata;
