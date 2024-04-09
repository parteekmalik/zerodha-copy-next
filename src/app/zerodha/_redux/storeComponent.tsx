import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { updateHeaderPin } from "./headerPin/headerPin";
import { AppDispatch, RootState } from "./store";
import { updateUserInfo } from "./userInfo/userInfo";
import { updateWatchList } from "./watchList/watchList";
import { updateSymbolsList } from "./symbolsList/symbolsList";
import { TOrderCalculations } from "../_components/Rightside/Positions/functions/OrderCalculations";
import TsMap from "ts-map";
import { TLivestreamType } from "./Livestream/Livestream";
import axios from "axios";

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
export type TtickerChangeType = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

const StoreComponent: React.FunctionComponent = (props) => {
  const initData = api.accountInfo.getInitInfo.useQuery().data;
  const symbolList = api.symbolList.getSymbolList.useQuery().data;

  const userDetails = useSelector((state: RootState) => state.UserInfo);
  const state = useSelector((state: RootState) => state);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (initData && userDetails?.name === "not_found" && symbolList) {
      console.log("REDUX");
      dispatch(updateWatchList(initData.watchList));
      dispatch(updateHeaderPin(initData.Pins));
      dispatch(updateUserInfo(initData.userInfo));
    }
  }, [initData]);
  useEffect(() => {
    if (symbolList) dispatch(updateSymbolsList(symbolList));
  }, [symbolList]);

  useEffect(() => {
    console.log(state);
  }, [state]);
  return null;
};

export default StoreComponent;
