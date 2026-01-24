"use client";

import Link from "next/link";
import Image from "next/image";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-gray-900 dark:text-white overflow-x-hidden font-sans">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none"></div>

            {/* Navbar (Reused for consistency) */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                            src="/logo-fixed.png"
                            alt="Voiceless Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight">VOICELESS</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-300">By Tech Gen Innovations</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Link href="/about" className="hover:text-purple-700 dark:hover:text-white transition-colors">About</Link>
                    <Link href="/#how-it-works" className="hover:text-purple-700 dark:hover:text-white transition-colors">How it works</Link>
                    <Link href="/features" className="text-purple-700 dark:text-white font-bold transition-colors">Features</Link>
                    <Link href="/blog" className="hover:text-purple-700 dark:hover:text-white transition-colors">Blog</Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">

                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Unlock a World of Communication: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">
                            Powerful Features Designed For You
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                        Building Bridges for the Deaf & Hard of Hearing Community
                    </p>
                </div>

                {/* Content Layout - Full Width Grid */}
                <div className="w-full">

                    {/* Features Grid - Adjusted to 3 columns for better use of space */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Feature 1 */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Real-Time Voice-to-Text</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Instantly converts spoken language into text, ensuring you never miss a word in any conversation.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Accessible Conversations</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Participate in group chats and meetings with ease. Breaks down barriers in social and professional settings.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Sign Language Recognition</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Advanced AI powered translation for ASL and ISL. Converts signs into text and speech seamlessly.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 text-yellow-600 dark:text-yellow-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Customizable Profiles</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Set up your communication preferences, default languages, and display settings for a personalized experience.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 text-red-600 dark:text-red-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Offline Mode & History</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Access your conversation history and use core features even without an internet connection.
                            </p>
                        </div>

                        {/* Feature 6 - Placeholder to balance grid if needed, or just leave as 5 */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 opacity-80 border-dashed shadow-sm dark:shadow-none">
                            <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center mb-4 text-gray-600 dark:text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">More Coming Soon</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                We are constantly working on new features to help bridge communication gaps.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-gray-200 dark:border-white/10 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>VOICELESS - A project by Tech Gen Innovations.</p>
                </div>
            </main>
        </div>
    );
}
