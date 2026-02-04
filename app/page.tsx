"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";

export default function Home() {
    return (
        <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed text-gray-900 dark:bg-[url('/background-test.jpg')] dark:text-white overflow-x-hidden">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/30 pointer-events-none transition-colors duration-300"></div>

            {/* Navbar */}
            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">

                {/* Hero Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-sm dark:drop-shadow-lg">
                            VOICELESS: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">Connect.</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">Communicate.</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">Empower.</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-200 max-w-lg font-light">
                            Bridging Communication Gaps for the Deaf & Hard of Hearing.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/login"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-purple-500/40 transition-all transform hover:-translate-y-1"
                            >
                                GET STARTED
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        {/* 3D Illustration Placeholder */}
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            <Image
                                src="/hero-illustration.png"
                                alt="3D Illustration of Communication"
                                fill
                                className="object-contain drop-shadow-2xl animate-float"
                            />
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div id="how-it-works" className="grid md:grid-cols-3 gap-8 mt-20">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 p-8 rounded-3xl shadow-lg dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Real-Time Translation</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Break down barriers with instant speech-to-text and sign language translation.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 p-8 rounded-3xl shadow-lg dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Accessible Conversations</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Engage easily in scenarios from casual hangouts to professional meetings.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 p-8 rounded-3xl shadow-lg dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-pink-100 dark:bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-600 dark:text-pink-300 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Empowering Connection</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Engage equally across distances and platforms with seamless integration.
                        </p>
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
