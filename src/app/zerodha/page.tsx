"use client";
import { useState } from "react";
import RightSide from "./_components/Rightside/RightSde";
import Header from "./_components/hearder";
import WatchList, { Tsymbol } from "./_components/WatchList/watchList";
import { shadowBox } from "./_components/tcss";

export type Tdata = {
  rightSide:
    | "chart"
    | "holdings"
    | "positions"
    | "funds"
    | "bills"
    | "Dashboard";
  watchList: Tsymbol[][];
};
export default async function Home() {
  const [data, setData] = useState<Tdata>({
    rightSide: "chart",
    watchList: [
      [
        { name: "gold", prevDayClose: 100, curPrice: 200000.01 },
        { name: "silver", prevDayClose: 20, curPrice: 10.01 },
      ],
    ],
  });

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center bg-[#f9f9f9] font-['Open_Sans','sans-serif']  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow  gap-1 p-5">
        <WatchList data={data.watchList} />
        <div className={" flex grow" + shadowBox}>
          <RightSide data={data} />
        </div>
      </div>
    </main>
  );
}

// const trash = {
//   // const hello = await api.post.hello.query({ text: "from tRPC" });
//   // const session = await getServerAuthSession();
//   /* <div className="flex flex-col items-center gap-2">
// <p className="text-2xl text-white">
//   {hello ? hello.greeting : "Loading tRPC query..."}
// </p>

// <div className="flex flex-col items-center justify-center gap-4">
//   <p className="text-center text-2xl text-white">
//     {session && <span>Logged in as {session.user?.name}</span>}
//   </p>
//   <Link
//     href={session ? "/api/auth/signout" : "/api/auth/signin"}
//     className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
//   >
//     {session ? "Sign out" : "Sign in"}
//   </Link>
// </div>
// </div>
// <CrudShowcase />
// {JSON.stringify(session)} */
// };
// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
