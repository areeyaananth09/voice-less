"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, LogOut, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                            src="/logo-fixed.png"
                            alt="Voiceless Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">VOICELESS</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-300">By Tech Gen Innovations</span>
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-200">
                    <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">{t("about")}</Link>
                    <Link href="/#how-it-works" className="hover:text-black dark:hover:text-white transition-colors">{t("howItWorks")}</Link>
                    <Link href="/features" className="hover:text-black dark:hover:text-white transition-colors">{t("features")}</Link>
                    <Link href="/blog" className="hover:text-black dark:hover:text-white transition-colors">{t("blog")}</Link>
                </div>

                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 transition-all"
                    >
                        <Languages className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 uppercase">{language}</span>
                    </button>
                    {isLanguageDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        setLanguage("en");
                                        setIsLanguageDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${language === "en" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium" : "text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => {
                                        setLanguage("ta");
                                        setIsLanguageDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${language === "ta" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium" : "text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    தமிழ் (Tamil)
                                </button>
                                <button
                                    onClick={() => {
                                        setLanguage("hi");
                                        setIsLanguageDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${language === "hi" ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium" : "text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    हिंदी (Hindi)
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <ThemeToggle />

                {session ? (
                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <Link href="/profile" className="relative group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-[0_0_15px_rgba(217,70,239,0.5)] group-hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] transition-all duration-300">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            width={36}
                                            height={36}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    )}
                                </div>
                            </div>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <span>{t("logout")}</span>
                        </button>
                    </div>
                ) : (
                    <div className="hidden md:block pl-4 border-l border-gray-200 dark:border-gray-700">
                        <Link href="/login" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                            {t("signIn")}
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
