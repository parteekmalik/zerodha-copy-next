"use client";

import React from "react";

function Dashboard() {
  return (
    <div className="flex h-full w-full flex-col bg-white p-[30px] pl-[20px] ">
      <div className="mb-[30px] pb-[15px] text-[24px]">Hi, UserName</div>
      <div className="mb-[50px] flex w-full pb-[50px]">
        <div className="flex grow flex-col">
          <div className="text-textDark mb-[20px] text-[16px]">logo Spot</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-textDark text-[2.625rem] font-light ">
                19.0
              </div>
              <div className="text-darkGrayApp text-xs">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-blueApp text-xs">view statement</div>
            </div>
          </div>
        </div>
        <div className="flex grow flex-col">
          <div className="text-textDark mb-[20px] text-[16px]">logo Margin</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-textDark text-[2.625rem] font-light">
                0.8
              </div>
              <div className="text-darkGrayApp text-xs">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-blueApp text-xs">view statement</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-textDark mb-[20px] text-[16px]">
          logo Holdings (8)
        </div>
        <div className="flex w-full">
          <div className="flex grow flex-col">
            <div className="flex">
              <div className="text-greenApp text-[2.625rem] font-light">
                20.02k
              </div>
              <div className="text-greenApp mt-auto text-xs ">
                <div>+19.01%</div>
              </div>
            </div>
            <div className="text-darkGrayApp text-xs">P&L</div>
          </div>
          <div className="flex grow flex-col">
            <div className="flex">
              <div className="grow">Current value</div>
              <div className="grow">37.24k</div>
            </div>
            <div className="flex">
              <div className="grow">Invested</div>
              <div className="grow">27.24k</div>
            </div>
          </div>
        </div>
        <div></div>
        <div className="flex">
          <div className="grow">$2000.33</div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
