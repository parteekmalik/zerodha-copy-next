"use client";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import { useToast } from "~/components/zerodha/_contexts/Toast/toast-context";
import { api } from "~/trpc/react";
type Tlabel = "" | "Withdraw" | "Add funds";

function Update_balance() {
  const [data, setData] = useState<{ isvisible: boolean; label: Tlabel }>({
    isvisible: false,
    label: "",
  });
  return (
    <>
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
      <Modal
        open={data.isvisible}
        onClose={() => setData({ isvisible: false, label: "" })}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AddFunds label={data.label} setData={setData} />
      </Modal>
    </>
  );
}

export default Update_balance;

function AddFunds({
  label,
  setData,
}: {
  label: Tlabel;
  setData: React.Dispatch<
    React.SetStateAction<{
      isvisible: boolean;
      label: Tlabel;
    }>
  >;
}) {
  const toast = useToast();
  const APIutils = api.useUtils();

  const orderapi = api.upadteAccountInfo.addBalance.useMutation({
    onSuccess: (msg) => {
      if (typeof msg === "string" && toast) {
        console.log("mutation error -> ", msg);
        toast.open({
          state: "error",
          errorMessage: msg,
        });
      }
    },
    onError: (msg) => {
      console.log("mutation error", msg);
    },
    onSettled() {
      setData({ isvisible: false, label: "" });
      APIutils.getAccountInfo.getBalance
        .invalidate()
        .catch((err) => console.log(err));
    },
  });
  const [value, setvalue] = useState(0);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        orderapi.mutate({
          amount: value * (label === "Withdraw" ? -1 : 1),
        });
      }}
      className=" fixed left-[50vw] top-[50vh] z-20   rounded bg-[#f9f9f9] p-[10px_12px]"
    >
      <div className="flex flex-col gap-2">
        <input
          value={value}
          onChange={(e) => setvalue(Number(e.target.value))}
          type="number"
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
