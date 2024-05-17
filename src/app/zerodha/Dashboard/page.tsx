"use client"

import React from "react";

function Dashboard() {
  return (
    <div className="flex h-full w-full flex-col p-[30px] pl-[20px] bg-white ">
      <div className="mb-[30px] pb-[15px] text-[24px]">Hi, UserName</div>
      <div className="mb-[50px] flex w-full pb-[50px]">
        <div className="flex grow flex-col">
          <div className="mb-[20px] text-[16px] text-[#444444]">logo Spot</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-[2.625rem] font-light text-[#444444] ">
                19.0
              </div>
              <div className="text-[.75rem] text-[#9b9b9b]">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-[.75rem] text-[#4184f3]">view statement</div>
            </div>
          </div>
        </div>
        <div className="flex grow flex-col">
          <div className="mb-[20px] text-[16px] text-[#444444]">
            logo Margin
          </div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-[2.625rem] font-light text-[#444444]">
                0.8
              </div>
              <div className="text-[.75rem] text-[#9b9b9b]">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-[.75rem] text-[#4184f3]">view statement</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-[20px] text-[16px] text-[#444444]">
          logo Holdings (8)
        </div>
        <div className="flex w-full">
          <div className="flex grow flex-col">
            <div className="flex">
              <div className="text-[2.625rem] font-light text-[#4caf50]">
                20.02k
              </div>
              <div className="mt-auto text-[.75rem] text-[#4caf50] ">
                <div>+19.01%</div>
              </div>
            </div>
            <div className="text-[.75rem] text-[#9b9b9b]">P&L</div>
          </div>
          <div className="flex grow flex-col">
            <div className="flex">
              <div className="grow">Current value</div>
              <div className="grow">37.24k</div>
            </div>
            <div className="flex">
              <div  className="grow">Invested</div>
              <div  className="grow">27.24k</div>
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
