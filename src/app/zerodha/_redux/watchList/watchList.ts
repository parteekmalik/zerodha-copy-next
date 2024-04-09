import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type TwatchListType = string[][];

const initialState: TwatchListType = [];
const watchListSlice = createSlice({
  name: "watchListType",
  initialState,
  reducers: {
    updateWatchList: (state, action: PayloadAction<TwatchListType>) => {
      console.log(action);
      return action.payload;
    },
  },
});

export const { updateWatchList } = watchListSlice.actions;

export default watchListSlice.reducer;
