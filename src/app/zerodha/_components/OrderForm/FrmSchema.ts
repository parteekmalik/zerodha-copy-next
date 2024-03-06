import { z } from "zod";

export const FormSchema = z.object({
  orderType: z.enum(["BUY", "SELL"]),
  trigerType: z.enum(["LIMIT", "STOP","MARKET"]),
  quantity: z.number().min(0.0001),
  price: z.number().min(0),
  sl: z.number().min(0),
  tp: z.number().min(0),
  symbolName: z.string(),
  marketType: z.enum(["SPOT", "MARGIN"]),
});
export type TFormSchema = typeof FormSchema;
