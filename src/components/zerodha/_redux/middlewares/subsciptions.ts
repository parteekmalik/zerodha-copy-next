import { ThunkMiddleware } from "@reduxjs/toolkit";
import { update_Last24hrdata } from "../Slices/Livestream";
import { RootState } from "../store";

const subsciptionsMddleware: ThunkMiddleware =
  (Store) => (next) => (action) => {
    next(action);
    const { type } = JSON.parse(JSON.stringify(action)) as { type: string };

    if (type === "BinanceWSStatsType/updateBinanceWSSubsriptions") {
      const newState = Store.getState() as RootState;
      Store.dispatch(
        update_Last24hrdata(newState.BinanceWSStats.subsciptions),
      ).catch((err) => console.log(err));
    }
  };
export default subsciptionsMddleware;
