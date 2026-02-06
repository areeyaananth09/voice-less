"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BlogPage() {
    return (
        <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-gray-900 dark:text-white overflow-x-hidden font-sans">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none"></div>

            {/* Navbar */}
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
                        <Link href="/" className="text-2xl font-bold tracking-tight">VOICELESS</Link>
                        <span className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-300">By Tech Gen Innovations</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Link href="/about" className="hover:text-purple-700 dark:hover:text-white transition-colors">About</Link>
                        <Link href="/#how-it-works" className="hover:text-purple-700 dark:hover:text-white transition-colors">How it works</Link>
                        <Link href="/features" className="hover:text-purple-700 dark:hover:text-white transition-colors">Features</Link>
                        <Link href="/blog" className="text-purple-700 dark:text-white font-bold transition-colors">Blog</Link>
                    </div>
                    <ThemeToggle />
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-24">
                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Our Blog: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">
                                Stories & Innovations
                            </span>
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-lg">
                            Building Bridges for a More Connected World, One Post a Time.
                        </p>
                    </div>
                    <div className="relative h-[300px] md:h-[400px] w-full">
                        <Image
                            src="/blog_hero_illustration.png"
                            alt="Blog Hero Illustration"
                            fill
                            className="object-contain drop-shadow-2xl animate-float"
                        />
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Featured Article */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-purple-600 dark:text-purple-300">
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">Featured Article</span>
                            </div>

                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6">
                                <Image
                                    src="/blog_featured_priya.png"
                                    alt="Priya Success Story"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <h2 className="text-2xl font-bold mb-4 leading-tight text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                                Success Story: How Voiceless Helped Priya Ace Her Job Interview!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-4">
                                "The real-time transcription gave me the confidence to express my ideas clearly. I didn't feel like I was missing out on anything," shares Priya. Read about her journey to landing her dream job at a top tech firm.
                            </p>

                            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5">
                                Read More
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Categories & Grid */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Categories */}
                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all font-semibold text-gray-700 dark:text-gray-200">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                TECHNOLOGY
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all font-semibold text-gray-700 dark:text-gray-200">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                COMMUNITY
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all font-semibold text-gray-700 dark:text-gray-200">
                                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                STORIES
                            </button>
                        </div>

                        {/* Articles Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">

                            {/* Card 1 */}
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 group">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Accessible Technology</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Understanding impact of modern tools on inclusion.
                                </p>
                                <span className="text-xs font-semibold text-[#D946EF] dark:text-[#A855F7] cursor-pointer hover:underline">Read Article →</span>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 group">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Image src="/blog_community_workshop.png" width={48} height={48} alt="Community" className="rounded-full object-cover" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Community Spotlight</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Local Workshop Boosts Digital Inclusion.
                                </p>
                                <span className="text-xs font-semibold text-[#D946EF] dark:text-[#A855F7] cursor-pointer hover:underline">Read Article →</span>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 group">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Image src="/blog_ai_translation.png" width={30} height={30} alt="AI" className="object-contain" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">New AI Powers Real-Time Translation</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Breaking down language barriers faster than ever.
                                </p>
                                <span className="text-xs font-semibold text-[#D946EF] dark:text-[#A855F7] cursor-pointer hover:underline">Read Article →</span>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-white/10 transition-all hover:-translate-y-1 group">
                                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Image src="/blog_tips_tricks.png" width={30} height={30} alt="Tips" className="object-contain" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Tips & Tricks: Maximize your Experience</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Getting the most out of features like offline mode.
                                </p>
                                <span className="text-xs font-semibold text-[#D946EF] dark:text-[#A855F7] cursor-pointer hover:underline">Read Article →</span>
                            </div>

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
