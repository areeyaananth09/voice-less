"use client";

import Link from "next/link";
import Image from "next/image";

export default function About() {
    return (
        <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed text-gray-900 dark:text-white overflow-x-hidden font-sans">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none"></div>

            {/* Navbar - Consistent with Home */}
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
                        <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">VOICELESS</Link>
                        <span className="text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-300">By Tech Gen Innovations</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Link href="/about" className="text-purple-700 dark:text-white font-semibold">About</Link>
                    <Link href="/#how-it-works" className="hover:text-purple-700 dark:hover:text-white transition-colors">How it works</Link>
                    <Link href="/features" className="hover:text-purple-700 dark:hover:text-white transition-colors">Features</Link>
                    <Link href="/blog" className="hover:text-purple-700 dark:hover:text-white transition-colors">Blog</Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-20">

                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Header / Hero Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Our Mission: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">Connecting Every Voice</span>
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-200 font-light">
                            Building Bridges for the Deaf & Hard of Hearing Community
                        </p>
                    </div>
                    <div className="relative h-[300px] w-full flex justify-center md:justify-end">
                        <div className="relative w-full max-w-[400px] h-full">
                            <Image
                                src="/about-hero.png"
                                alt="Connecting Every Voice"
                                fill
                                className="object-contain animate-float drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* The Problem We're Solving (Large Box Left) */}
                    <div className="md:col-span-5 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 hover:bg-white/80 dark:hover:bg-white/15 transition-all duration-300 flex flex-col justify-between shadow-sm dark:shadow-none">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">The Problem We're Solving</h2>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                The isolation faced by the deaf community is profound. Simple daily interactions can become insurmountable barriers, leading to social exclusion and frustration. We aim to break down these walls.
                            </p>
                        </div>
                        <div className="relative w-full h-48 mt-4 rounded-xl overflow-hidden">
                            <Image
                                src="/about-problem.png"
                                alt="Communication Barrier Illustration"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Introducing Seamless Interaction (Wide Box Right) */}
                    <div className="md:col-span-7 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 hover:bg-white/80 dark:hover:bg-white/15 transition-all duration-300 shadow-sm dark:shadow-none">
                        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Introducing Seamless Interaction</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                </div>
                                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white">Real-Time Translation</h3>
                                <p className="text-xs text-gray-700 dark:text-gray-300">Instantly convert speech to text and sign breaking down communication barriers.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white">Accessible Conversations</h3>
                                <p className="text-xs text-gray-700 dark:text-gray-300">Seamlessly convert in any situation for instant language changes and clarity.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-pink-500/20 rounded-full flex items-center justify-center mb-4 text-pink-600 dark:text-pink-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                </div>
                                <h3 className="font-bold text-sm mb-2 text-gray-900 dark:text-white">Accessibility & Inclusion</h3>
                                <p className="text-xs text-gray-700 dark:text-gray-300">Engage freely beyond borders and finding our us in daily life.</p>
                            </div>
                        </div>
                    </div>

                    {/* Our Solution (Medium Box Left) */}
                    <div className="md:col-span-6 lg:col-span-5 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 hover:bg-white/80 dark:hover:bg-white/15 transition-all duration-300 flex flex-col-reverse md:flex-col shadow-sm dark:shadow-none">
                        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                            <Image
                                src="/about-solution.png"
                                alt="Our Solution"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Solution</h2>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                Top-notch real-time tools that enable a seamless link back to great outcomes and stories. Visit us and experience a large life like never before. A truly core compatible safe mechanism that possess of any time discussions daily life.
                            </p>
                        </div>
                    </div>

                    {/* Our Story / Minds Behind (Medium Box Right) */}
                    <div className="md:col-span-6 lg:col-span-7 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 hover:bg-white/80 dark:hover:bg-white/15 transition-all duration-300 shadow-sm dark:shadow-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center h-full">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Our Story</h2>
                                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200 mb-4">The Minds Behind Voiceless</h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
                                    Join us in creating for a more inclusive world. We are a passionate team dedicated to using technology for social good.
                                </p>
                                <div className="flex gap-4">
                                    {/* Small Avatars/Names - Placeholder Text for Names as in image */}
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-300/20 mx-auto mb-1"></div>
                                        <span className="text-[10px] block opacity-70 text-gray-800 dark:text-gray-300">Fame True Nocoe</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-purple-300/20 mx-auto mb-1"></div>
                                        <span className="text-[10px] block opacity-70 text-gray-800 dark:text-gray-300">Des whil of Twaiver</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full h-56 rounded-xl overflow-hidden">
                                <Image
                                    src="/about-team.png"
                                    alt="Team Illustration"
                                    fill
                                    className="object-contain"
                                />
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
