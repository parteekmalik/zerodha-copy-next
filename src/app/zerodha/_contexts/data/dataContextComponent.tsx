import type { PropsWithChildren } from "react";
import React, { useReducer } from "react";
import { DataContextProvider, defaultdataContextState } from "./data";
import { dataReducer } from "./dataReduer";

// export interface IdataContextComponentProps extends PropsWithChildren {}

const DataContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;

  const [dataState, dataDispatch] = useReducer(
    dataReducer,
    defaultdataContextState,
  );

  return (
    <DataContextProvider value={{ dataState, dataDispatch }}>
      {children}
    </DataContextProvider>
  );
};

export default DataContextComponent;
