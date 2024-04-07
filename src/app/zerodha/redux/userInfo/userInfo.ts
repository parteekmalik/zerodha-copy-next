import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TuserInfo = {
  name: "not_found",
  email: "not_found@gmail.com",
  image: "not_found",
  id: "not_found",
  TradingAccountId: "",
};
type TuserInfo = {
  id: string;
  TradingAccountId: string;
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};
const userInfoSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateUserInfo: (state, action: PayloadAction<TuserInfo>) => {
      console.log(action);
      return action.payload;
    },
  },
});

export const { updateUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
