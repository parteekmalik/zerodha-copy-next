import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type TwatchListType = { List: string[][]; ListNo: number };

const initialState: TwatchListType = { List: [], ListNo: 0 };
const watchListSlice = createSlice({
  name: "watchListType",
  initialState,
  reducers: {
    updateWatchList: (state, action: PayloadAction<string[][]>) => {
      state.List = action.payload;
    },
    updateWatchListNo: (state, action: PayloadAction<number>) => {
      state.ListNo = action.payload;
    },
  },
});

export const { updateWatchList, updateWatchListNo } = watchListSlice.actions;

export default watchListSlice.reducer;
