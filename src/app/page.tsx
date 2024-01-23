"use client";
import { useState } from "react";
import RightSide from "./_components/Rightside/RightSde";
import Header from "./_components/hearder";
import WatchList from "./_components/watchList";

export type Tdata = {
  rightSide:
    | "chart"
    | "holdings"
    | "positions"
    | "funds"
    | "bills"
    | "Dashboard";
  watchList: string[][];
};
export const shadowBox = " shadow-[0_0_5px_0_rgba(0,0,0,.1)] ";
export default async function Home() {
  const [data, setData] = useState<Tdata>({
    rightSide: "chart",
    watchList: [["gold", "silver"]],
  });

  return (
    <main className=" max-w-screen flex h-screen max-h-screen w-screen flex-col  items-center justify-center bg-[#f9f9f9]  ">
      <Header />
      <div className="text-red flex w-full max-w-[1536px] grow  gap-1 p-2">
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
