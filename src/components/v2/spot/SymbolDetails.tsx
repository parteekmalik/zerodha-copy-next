import React from "react";
import { twMerge } from "tailwind-merge";
import { Card, CardContent } from "~/components/v2/ui/card";

function SymbolDetails({ className }: { className?: string }) {
  return (
    <Card className={twMerge("mb-1 grow-[3] border-border", className)}>
      <CardContent></CardContent>
    </Card>
  );
}

export default SymbolDetails;
