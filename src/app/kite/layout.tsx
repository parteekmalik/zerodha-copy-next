import "~/styles/globals.css";

import ContextLayer from "./page";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContextLayer>{children}</ContextLayer>;
}
