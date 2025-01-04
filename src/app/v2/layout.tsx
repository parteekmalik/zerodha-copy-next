import "~/styles/globals.css";

import Providers from "~/app/v2/provider";
import Header from "~/components/v2/header";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col items-center overflow-hidden  bg-background font-['Open_Sans','sans-serif']  ">
      <Providers>
        <Header />
        {children}
      </Providers>
    </main>
  );
}
