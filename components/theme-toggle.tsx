"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm border border-black/5 dark:border-white/10 transition-all duration-300 ease-in-out focus:outline-none ring-offset-2 focus:ring-2 ring-purple-500"
            aria-label="Toggle theme"
        >
            <Sun className="absolute h-5 w-5 text-orange-500 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rotate-0 scale-100 dark:-rotate-[360deg] dark:scale-0 dark:opacity-0" />
            <Moon className="absolute h-5 w-5 text-purple-300 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
