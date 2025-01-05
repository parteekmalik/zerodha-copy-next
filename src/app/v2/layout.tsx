import "~/styles/globals.css";

import Providers from "~/app/v2/provider";
import Header from "~/components/v2/header";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center  bg-primary/20 font-['Open_Sans','sans-serif']  ">
        <Header />
        <div className="z-10 flex w-full grow flex-col">{children}</div>
      </main>
    </Providers>
  );
}
