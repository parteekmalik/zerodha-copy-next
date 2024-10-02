import { api } from "~/trpc/react";
import { useBackendWS } from "../../_contexts/backendWS/backendWSContextComponent";
import { useToast } from "../../_contexts/Toast/toast-context";
import { UPDATE_OR_ADD_ORDER } from "WStypes/typeForSocketToFrontend";

const useCreateOrderApi = () => {
  const APIutils = api.useUtils();
  const { WSsendOrder } = useBackendWS();
  const toast = useToast();
  const CreateOrderAPI = api.Order.createOrder.useMutation({
    onSuccess: (messages) => {
      messages.map((msg) => {
        if (msg && toast) {
          console.log("mutation nsucess -> ", msg);
          if (typeof msg === "string" || "error" in msg) {
            toast.open({
              state: "error",
              errorMessage: JSON.stringify(msg),
            });
          } else {
            toast.open({
              name: msg.name,
              state:
                msg.status === "OPEN"
                  ? "placed"
                  : msg.status === "COMPLETED" || msg.status === "CANCELLED"
                    ? "sucess"
                    : "error",
              quantity: msg.quantity,
              orderId: msg.id,
              type: msg.type,
            });
            WSsendOrder({ type: UPDATE_OR_ADD_ORDER, payload: msg });
          }
        }
      });
    },
    onSettled() {
      APIutils.Order.getOrders.refetch().catch((err) => console.log(err));
      APIutils.Console.getRemainingFilledOrders.refetch().catch((err) => console.log(err));
      APIutils.getAccountInfo.getAllBalance.refetch().catch((err) => console.log(err));
    },
  });
  return { CreateOrderAPI };
};
export default useCreateOrderApi;
