"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-8" />;

  const cycle = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const label = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";
  const icon = theme === "dark" ? ")" : theme === "light" ? "O" : "*";

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-muted"
      aria-label={`Current theme: ${label}. Click to change.`}
      title={label}
    >
      {icon}
    </button>
  );
}
