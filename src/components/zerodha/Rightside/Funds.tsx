import { useQueryClient } from "@tanstack/react-query";
import React, { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { api } from "~/trpc/react";
import InputDiv from "../OrderForm/InputDiv";
import { shadowBox } from "../tcss";

import Modal from "@mui/material/Modal";
import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";
import { RootState } from "~/components/zerodha/_redux/store";

type Tlabel = "" | "Withdraw" | "Add funds";
function Funds() {
  const [data, setData] = useState<{ isvisible: boolean; label: Tlabel }>({
    isvisible: false,
    label: "",
  });
  const TradingAccountId = useSelector(
    (state: RootState) => state.UserInfo.TradingAccountId,
  );

  const balance = api.getAccountInfo.getBalance.useQuery(TradingAccountId).data;
  if (!balance) return <>error fro server</>;
  return (
    <div className="h-full w-full bg-white p-[30px_20px]">
      <div className="mb-3 flex justify-end gap-5">
        <span className=" flex items-center text-[.75rem] text-[#9b9b9b]">
          Instant, zerro-cost fund transfers with fake money
        </span>
        <div className="test-[.925rem] flex gap-1 text-white">
          <div
            className="rounded bg-[#4caf50] p-[8px_20px] hover:cursor-pointer "
            onClick={(e) => setData({ isvisible: true, label: "Add funds" })}
          >
            Add funds
          </div>
          <div
            className="rounded bg-[#4184f3] p-[8px_20px] hover:cursor-pointer "
            onClick={(e) => setData({ isvisible: true, label: "Withdraw" })}
          >
            Withdraw
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-[48%] ">
          <h3 className="mx-1 my-3 flex">
            <div className="grow text-[1.17em]">Equity</div>
            <div className="flex gap-2 text-[.625rem] text-[#4184f3]">
              <div>View Statement</div>
              <div>Help</div>
            </div>
          </h3>
          <ListBox Style={{ textColor: " text-[#444444] " }}>
            <MainBox
              data={[
                {
                  name: "TOTAL bal",
                  value: balance.freeAmount + balance.lockedAmount ?? 0,
                },
                { name: "FREE bal", value: balance.freeAmount },
                { name: "LOCKED bal", value: balance.lockedAmount },
              ]}
              isMain={true}
              Style={["  ", " text-[2em] "]}
            />
          </ListBox>
          <ListBox Style={{ textColor: " text-[#444444] " }}>
            <MainBox
              data={[
                { name: "Avl bal", value: 40 },
                { name: "Avl bal", value: 40 },
                { name: "Avl bal", value: 40 },
              ]}
              isMain={false}
            />
          </ListBox>
        </div>
      </div>
      {/* <Modal
        isOpen={data.isvisible}
        onRequestClose={() => setData({ isvisible: false, label: "" })}
      >
        <AddFunds
          label={data.label}
          account={TradingAccountId}
          setData={setData}
        />
      </Modal> */}
      <Modal
        open={data.isvisible}
        onClose={() => setData({ isvisible: false, label: "" })}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AddFunds
          label={data.label}
          account={TradingAccountId}
          setData={setData}
        />
        {/* <Box sx={{ backgroundColor: "white" }}>
          
        </Box> */}
      </Modal>
    </div>
  );
}
const addfundsSchema = z.object({ value: z.number() });

function AddFunds({
  label,
  account,
  setData,
}: {
  label: Tlabel;
  account: string;
  setData: React.Dispatch<
    React.SetStateAction<{
      isvisible: boolean;
      label: Tlabel;
    }>
  >;
}) {
  const queryClient = useQueryClient(); // Initialize queryClient
  const toast = useToast();

  const orderapi = api.upadteAccountInfo.addBalance.useMutation({
    onSuccess: (msg) => {
      queryClient.refetchQueries().catch((err) => console.log(err));
      if (typeof msg !== "string") {
        setData({ isvisible: false, label: "" });
      } else if (toast) {
        console.log("mutation error -> ", msg);
        toast.open({
          state: "error",
          errorMessage: msg,
        });
      }
    },
    onError: (msg) => {
      console.log("mutation error", msg);
      setData({ isvisible: false, label: "" });
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.output<typeof addfundsSchema>>({
    defaultValues: { value: 0 },
  });
  function Submit(data: z.output<typeof addfundsSchema>) {
    orderapi.mutate({
      account,
      amount: Number(data.value) * (label === "Withdraw" ? -1 : 1),
    });
  }
  return (
    <form
      onSubmit={handleSubmit(Submit)}
      className=" fixed left-[50vw] top-[50vh] z-20   rounded bg-[#f9f9f9] p-[10px_12px]"
      style={
        {
          // transform: "translateX(50%) translateY(50%)",
          // transform: `translate(  100%, 100%)`,
        }
      }
    >
      <div className="flex flex-col gap-2">
        <InputDiv
          data={{ isDisabled: false, label: "Amount" }}
          Type="number"
          register={{ ...register("value"), min: 1 }}
        />
        <input
          className=" rounded bg-[#4caf50] p-[8px_20px] hover:cursor-pointer "
          type="submit"
          value={label}
        />
      </div>
    </form>
  );
}

function MainBox(props: {
  data: Trow[];
  Style?: [string, string];
  isMain: boolean;
}) {
  const { data, Style = ["", ""], isMain } = props;
  return (
    <div className="border-b-1">
      {data.map((item, i) => {
        return (
          <div className="flex" key={i}>
            <div
              className={
                " flex grow items-center p-[10px_12px] opacity-[.7]  " +
                Style[0]
              }
            >
              {item.name}
            </div>
            <div
              className={
                " p-[10px_12px] " +
                Style[1] +
                (i === 0 && isMain ? " text-[#4184f3] " : "")
              }
            >
              {Number(item.value).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
type Trow = { name: string; value: number | string };
interface IListBox {
  Style: { textColor: string };
}
const ListBox: React.FunctionComponent<PropsWithChildren<IListBox>> = (
  props,
) => {
  const { children, Style } = props;
  return (
    <div
      className={
        "w-full border border-[#eeeeee] bg-white p-[20px] text-[.875rem] " +
        Style.textColor +
        " " +
        shadowBox
      }
    >
      {children}
    </div>
  );
};
export default Funds;
