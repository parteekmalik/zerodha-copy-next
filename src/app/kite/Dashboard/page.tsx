"use client";

function Dashboard() {
  return (
    <div className="flex h-full w-full flex-col p-[30px] pl-[20px] ">
      <div className="mb-[30px] pb-[15px] text-[24px]">Hi, UserName</div>
      <div className="mb-[50px] flex w-full pb-[50px]">
        <div className="flex grow flex-col">
          <div className="mb-[20px] text-[16px] text-textDark">logo Spot</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-[2.625rem] font-light text-textDark ">
                19.0
              </div>
              <div className="text-xs text-darkGrayApp">USDT available</div>
            </div>
            <div className="flex grow items-center justify-center ">
              <div className="text-xs text-blueApp">view statement</div>
            </div>
          </div>
        </div>
        <div className="flex grow flex-col">
          <div className="mb-[20px] text-[16px] text-textDark">logo Margin</div>
          <div className="flex">
            <div className="flex grow flex-col">
              <div className="text-[2.625rem] font-light text-textDark">
                0.8
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
          logo Holdings (8)
        </div>
        <div className="flex w-full">
          <div className="flex grow flex-col">
            <div className="flex">
              <div className="text-[2.625rem] font-light text-greenApp">
                20.02k
              </div>
              <div className="mt-auto text-xs text-greenApp ">
                <div>+19.01%</div>
              </div>
            </div>
            <div className="text-xs text-darkGrayApp">P&L</div>
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
