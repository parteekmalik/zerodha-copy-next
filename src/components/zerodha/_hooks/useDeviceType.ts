import { useSelector } from "react-redux";
import { type RootState } from "../_redux/store";
import { type TDeviceTypeType } from "../_redux/Slices/DeviceType";
const deviceSizeMap: Record<TDeviceTypeType, number> = {
  sm: 0,
  md: 1,
  lg: 2,
  xl: 3,
  "2xl": 4,
};
export default function useDeviceType() {
  const DeviceType = useSelector((state: RootState) => state.DeviceType);
  function isDeviceCompatible(size: TDeviceTypeType) {
    // Compare the numerical values of the input size and the current screen size
    return deviceSizeMap[DeviceType] > deviceSizeMap[size];
  }
  return { DeviceType, isDeviceCompatible };
}
