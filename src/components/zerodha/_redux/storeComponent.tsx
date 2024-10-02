import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "~/trpc/react";
import { updateHeaderPin } from "./Slices/headerPin";
import { updateSymbolsList } from "./Slices/symbolsList";
import { updateUserInfo } from "./Slices/userInfo";
import { updateWatchList } from "./Slices/watchList";
import { type AppDispatch, type RootState } from "./store";
import { updateDeviceType } from "./Slices/DeviceType";

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

// export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}

const StoreComponent: React.FunctionComponent = () => {
  const initData = api.getAccountInfo.getInitInfo.useQuery().data;
  const symbolList = api.symbolList.getSymbolList.useQuery().data;

  const userDetails = useSelector((state: RootState) => state.UserInfo);
  // const state = useSelector((state: RootState) => state);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // console.log(initData);
    if (initData && userDetails?.name === "not_found" && symbolList) {
      dispatch(updateWatchList(initData.watchList));
      dispatch(updateHeaderPin(initData.Pins));
      dispatch(updateUserInfo(initData.userInfo));
    }
  }, [initData, dispatch, symbolList, userDetails?.name]);

  useEffect(() => {
    if (symbolList) dispatch(updateSymbolsList(symbolList));
  }, [symbolList, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Dispatch action based on window size
      if (width < 640) {
        dispatch(updateDeviceType("sm"));
      } else if (width >= 640 && width < 768) {
        dispatch(updateDeviceType("md"));
      } else if (width >= 768 && width < 1024) {
        dispatch(updateDeviceType("lg"));
      } else if (width >= 1024 && width < 1280) {
        dispatch(updateDeviceType("xl"));
      } else {
        dispatch(updateDeviceType("2xl"));
      }
    };

    // Set the initial device type
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return null;
};
export default StoreComponent;
