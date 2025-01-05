"use client";

import { useTheme } from "next-themes";
import { Switch } from "~/components/v2/ui/switch";
import { Sun, Moon } from "lucide-react";
import { twMerge } from "tailwind-merge";

function ThemeSwitch({ className }: { className: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-slate-200"
        aria-label="Toggle theme"
      />
    </div>
  );
}

export default ThemeSwitch;
