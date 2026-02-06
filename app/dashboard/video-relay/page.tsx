"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VideoRelayDashboard() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        // Check if user has selected a role
        if (typeof window !== "undefined") {
            const role = localStorage.getItem("userRole");
            if (role && role !== "video-relay" && role !== "hearing" && role !== "deaf-mute") {
                // Allow access if they selected video-relay, but also leniently allow others for now or redirect
                // Ideally strict: if (role !== "video-relay") router.push("/role-selection");
            }
            setUserRole(role);
        }
    }, [router]);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("userRole");
        }
        router.push("/");
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/20 pointer-events-none"></div>

            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md border-b border-pink-200/50 dark:border-pink-800/50 sticky top-0 z-50">
                <div className="w-full mx-auto px-4 sm:px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {/* Back Button */}
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Go back"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>

                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    Voiceless
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Video Relay Service</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-24">

                {/* Welcome Section */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to Video Relay
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                        Connect with certified sign language interpreters for real-time translation assistance in your calls and meetings.
                    </p>
                </div>

                {/* Action Card */}
                <div className="max-w-md mx-auto">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-pink-100 dark:border-pink-900 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-pink-500 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Start Video Call</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
                            Initiate a secure video session with an available interpreter.
                        </p>

                        <button
                            onClick={() => router.push('/video-call')}
                            className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/30 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Connect Now
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/10 py-2 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            12 Interpreters Online
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 pt-6 border-t border-gray-200 dark:border-white/10 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>VOICELESS – A project by Tech Gen Innovations.</p>
                </div>
            </main>
        </div>
    );
}
