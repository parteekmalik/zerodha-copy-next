import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { updateHeaderPin } from "./headerPin/headerPin";
import { AppDispatch, RootState } from "./store";
import { updateUserInfo } from "./userInfo/userInfo";
import { updateWatchList } from "./watchList/watchList";
import { updateSymbolsList } from "./symbolsList/symbolsList";

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
