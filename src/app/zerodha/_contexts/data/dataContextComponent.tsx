import type { PropsWithChildren } from "react";
import React, { useEffect, useReducer, useState } from "react";
import { DataContextProvider, defaultdataContextState } from "./data";
import { dataReducer } from "./dataReduer";
import { api } from "~/trpc/react";

// export interface IdataContextComponentProps extends PropsWithChildren {}

const DataContextComponent: React.FunctionComponent<PropsWithChildren> = (
  props,
) => {
  const { children } = props;

  const [dataState, dataDispatch] = useReducer(
    dataReducer,
    defaultdataContextState,
  );
  const [loading, setoading] = useState(true);
  const initData = api.accountInfo.getInitInfo.useQuery().data;
  useEffect(() => {
    if (loading && initData && dataState.userDetails?.name === "not_found") {
      dataDispatch({ type: "update_userDetails", payload: initData.userInfo });
      dataDispatch({ type: "update_watchList", payload: initData.watchList });
      dataDispatch({ type: "update_Pins", payload: initData.Pins });
      setoading(false);
    }
  }, [initData]);

  return (
    <DataContextProvider value={{ dataState, dataDispatch, loading }}>
      {children}
    </DataContextProvider>
  );
};

export default DataContextComponent;
