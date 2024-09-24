import { api } from "~/trpc/react";
import { useBackendWS } from "../../_contexts/backendWS/backendWSContextComponent";
import { useToast } from "../../_contexts/Toast/toast-context";
import { UPDATE_OR_ADD_ORDER } from "WStypes/typeForSocketToFrontend";

export const usecancelOrders = () => {
    const APIutils = api.useUtils();
    const { WSsendOrder } = useBackendWS();
    const toast = useToast();
    const cancelOrdersAPI = api.Order.cancelTrade.useMutation({
      onSuccess(messages) {
        messages.map((message) => {
          console.log("mutation nsucess -> ", message);
          if (typeof message === "string") {
            toast.open({
              state: "error",
              errorMessage: message,
            });
          } else {
            toast.open({
              name: message.name,
              state:
                message.status === "OPEN"
                  ? "placed"
                  : message.status === "COMPLETED" || message.status === "CANCELLED"
                    ? "sucess"
                    : "error",
              quantity: message.quantity,
              orderId: message.id,
              type: message.type,
            });
            WSsendOrder({ type: UPDATE_OR_ADD_ORDER, payload: message });
          }
        });
      },
      onSettled() {
        APIutils.Order.getOrders.refetch().catch((err) => console.log(err));
        APIutils.getAccountInfo.getAllBalance.refetch().catch((err) => console.log(err));
      },
    });
    return { cancelOrdersAPI };
  };
  