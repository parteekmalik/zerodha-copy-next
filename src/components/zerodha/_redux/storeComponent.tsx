import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { updateHeaderPin } from "./Slices/headerPin";
import { updateSymbolsList } from "./Slices/symbolsList";
import { updateUserInfo } from "./Slices/userInfo";
import { updateWatchList } from "./Slices/watchList";
import { AppDispatch, RootState } from "./store";

export type TsymbolTrade = {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
  M: boolean;
};
export type TsymbolLive = {
  symbol: string;
  curPrice: number;
  isup: boolean;
  prevPrice?: number;
  PriceChange?: string;
  PriceChangePercent?: string;
};
// export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}

const StoreComponent: React.FunctionComponent = () => {
  const initData = api.getAccountInfo.getInitInfo.useQuery().data;
  const symbolList = api.symbolList.getSymbolList.useQuery().data;

  const userDetails = useSelector((state: RootState) => state.UserInfo);
  // const state = useSelector((state: RootState) => state);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (initData && userDetails?.name === "not_found" && symbolList) {
      dispatch(updateWatchList(initData.watchList));
      dispatch(updateHeaderPin(initData.Pins));
      dispatch(updateUserInfo(initData.userInfo));
    }
  }, [initData]);

  useEffect(() => {
    if (symbolList) dispatch(updateSymbolsList(symbolList));
  }, [symbolList]);

  return null;
};
export default StoreComponent;
