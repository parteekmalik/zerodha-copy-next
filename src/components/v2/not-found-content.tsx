'use client';
import Link from "next/link";
import { Button } from "~/components/v2/ui/button";

export function NotFoundContent() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404 - Not Found</h2>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist in V2.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/v1">Go to V1</Link>
        </Button>
        <Button asChild>
          <Link href="/v2">Go to V2 Home</Link>
        </Button>
      </div>
    </div>
  );
} 