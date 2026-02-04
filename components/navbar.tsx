"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export function Navbar() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
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
                    <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
                    <Link href="/#how-it-works" className="hover:text-black dark:hover:text-white transition-colors">How it works</Link>
                    <Link href="/features" className="hover:text-black dark:hover:text-white transition-colors">Features</Link>
                    <Link href="/blog" className="hover:text-black dark:hover:text-white transition-colors">Blog</Link>
                </div>

                <ThemeToggle />

                {session ? (
                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <Link href="/profile" className="relative group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
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
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="hidden md:block pl-4 border-l border-gray-200 dark:border-gray-700">
                        <Link href="/login" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
