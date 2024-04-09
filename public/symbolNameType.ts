type FilterType =
  | "PRICE_FILTER"
  | "LOT_SIZE"
  | "ICEBERG_PARTS"
  | "MARKET_LOT_SIZE"
  | "TRAILING_DELTA"
  | "PERCENT_PRICE"
  | "MIN_NOTIONAL"
  | "PERCENT_PRICE_BY_SIDE"
  | "NOTIONAL"
  | "MAX_NUM_ORDERS"
  | "MAX_NUM_ALGO_ORDERS";

interface Filter {
  filterType: FilterType;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  minQty?: string;
  maxQty?: string;
  stepSize?: string;
  limit?: number;
  minTrailingAboveDelta?: number;
  maxTrailingAboveDelta?: number;
  minTrailingBelowDelta?: number;
  maxTrailingBelowDelta?: number;
  bidMultiplierUp?: string;
  bidMultiplierDown?: string;
  askMultiplierUp?: string;
  askMultiplierDown?: string;
  avgPriceMins?: number;
  minNotional?: string;
  applyMinToMarket?: boolean;
  maxNotional?: string;
  applyMaxToMarket?: boolean;
  maxNumOrders?: number;
  maxNumAlgoOrders?: number;
  multiplierUp?: string;
  multiplierDown?: string;
  applyToMarket?: boolean;
}

type Permission =
  | "SPOT"
  | "MARGIN"
  | "TRD_GRP_004"
  | "TRD_GRP_005"
  | "TRD_GRP_006"
  | "TRD_GRP_009"
  | "TRD_GRP_010"
  | "TRD_GRP_011"
  | "TRD_GRP_012"
  | "TRD_GRP_013"
  | "TRD_GRP_014"
  | "TRD_GRP_015"
  | "TRD_GRP_016"
  | "TRD_GRP_017"
  | "TRD_GRP_018"
  | "TRD_GRP_019"
  | "TRD_GRP_020"
  | "TRD_GRP_021"
  | "TRD_GRP_022"
  | "TRD_GRP_023"
  | "TRD_GRP_024"
  | "TRD_GRP_025";

type SelfTradePreventionMode = "EXPIRE_TAKER" | "EXPIRE_MAKER" | "EXPIRE_BOTH";

export interface JSONType {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: Filter[];
  permissions: Permission[];
  defaultSelfTradePreventionMode: SelfTradePreventionMode;
  allowedSelfTradePreventionModes: SelfTradePreventionMode[];
  name: string;
}