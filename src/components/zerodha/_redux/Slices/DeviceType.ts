import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define the type for the device type
export type TDeviceTypeType = "sm" | "md" | "lg" | "xl" | "2xl";

// Define the initial state with the type explicitly
const initialState: TDeviceTypeType = "lg" as TDeviceTypeType;

// Create the slice
const DeviceTypeSlice = createSlice({
  name: "DeviceTypeType",
  initialState,
  reducers: {
    // The reducer that updates the device type
    updateDeviceType: (state, action: PayloadAction<TDeviceTypeType>) => {
      // Return the new device type from the payload
      return action.payload;
    },
  },
});

// Export the actions
export const { updateDeviceType } = DeviceTypeSlice.actions;

const deviceSizeMap: Record<TDeviceTypeType, number> = {
  sm: 0,
  md: 1,
  lg: 2,
  xl: 3,
  "2xl": 4,
};

export function greaterThan(size: TDeviceTypeType, currentSize: TDeviceTypeType) {
  // Compare the numerical values of the input size and the current screen size
  return deviceSizeMap[currentSize] > deviceSizeMap[size];
}
// Export the reducer
export default DeviceTypeSlice.reducer;
