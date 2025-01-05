"use client";

import { useTheme } from "next-themes";
import { Switch } from "~/components/v2/ui/switch";
import { Sun, Moon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useMemo, useEffect, useState } from "react";

function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
        aria-label="Toggle theme"
      />
    </div>
  );
}

export default ThemeSwitch;
