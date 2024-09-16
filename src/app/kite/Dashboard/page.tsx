import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { RootState } from "~/components/zerodha/_redux/store";
import { api } from "~/trpc/server";
import { getColor } from "../utils";

async function Dashboard() {
  const UserInfo = await api.getAccountInfo.getInitInfo.query();
  const data = await api.Console.getPositionCurrentDetails.query();
  console.log("rendered dashboard")
  return (
    <div className="flex h-full w-full flex-col p-[30px] pl-[20px] ">
      <div className="mb-[30px] pb-[15px] text-[24px]">
        Hi, {UserInfo?.userInfo.name}
      </div>
      <div className="mb-[50px] flex w-full pb-[50px]">
        <div className="flex grow flex-col">
          <div className="mb-[20px] text-[16px] text-textDark">Spot</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-[2.625rem] font-light text-textDark ">
                {data.usdtBalance}
              </div>
              <div className="text-xs text-darkGrayApp">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-xs text-blueApp">view statement</div>
            </div>
          </div>
        </div>
        <div className="flex grow flex-col">
          <div className="mb-[20px] text-[16px] text-textDark">Margin</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-[2.625rem] font-light text-textDark">
                0.00
              </div>
              <div className="text-xs text-darkGrayApp">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-xs text-blueApp">view statement</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-[20px] text-[16px] text-textDark">
          Holdings ({data.count})
        </div>
        <div className="text-xs text-darkGrayApp">Net Worth</div>
        <div className="flex w-full">
          <div className="flex grow flex-col">
            <div className="text-[2.25rem] font-light">
              {Number(data.currentTotal) + Number(data.usdtBalance)}
            </div>
          </div>
          <div className="flex grow flex-col">
            <div className="flex">
              <div className="grow">Current value</div>
              <div className="">{data.currentTotal}</div>
            </div>
            <div className="flex">
              <div className="grow">Invested</div>
              <div className="">{data.totalPrice}</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-darkGrayApp">P&L</div>
        <div className={twMerge("flex", getColor(Number(data.profit)))}>
          <div className="text-[2.625rem] font-light ">{data.profit}</div>
          <div className={"mt-auto text-xs  "}>
            <div>{data.profitPercent}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
