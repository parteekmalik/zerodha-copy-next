import { shadowBox } from "./tcss";

function Header() {
  return (
    <header className={" flex w-full justify-cente bg-white" + shadowBox}>
      <div className="flex w-[1080px] max-w-[1080px]  gap-20  p-4">
        <div className="flex gap-5">
          <div>bitcoin</div>
          <div>etherium</div>
        </div>
        <div className="flex gap-4">
          <img
            className="h-[20px] w-auto"
            src="https://kite.zerodha.com/static/images/kite-logo.svg"
            alt=""
          />
          <div>Dashboard</div>
          <div>Orders</div>
          <div>Holdings</div>
          <div>Positions</div>
          <div>Bids</div>
          <div>Funds</div>
        </div>
        <div className="flex gap-4">
          <div>notification</div>
          <div> client id </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
