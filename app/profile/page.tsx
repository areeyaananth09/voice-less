"use client";

import { Navbar } from "@/components/navbar";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, User, Settings, Clock, MessageSquare, Volume2, Globe, Heart, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ProfilePage() {
    const { data: session } = authClient.useSession();
    const { theme, setTheme } = useTheme();

    const [dialect, setDialect] = useState("ISL");
    const [sensitivity, setSensitivity] = useState(50);
    const [activeTab, setActiveTab] = useState("account");
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole');
            setUserRole(role);
        }
    }, []);

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                    <div className="text-lg font-medium">Loading Profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-fixed transition-colors duration-300">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/40 pointer-events-none sticky"></div>

            <Navbar />

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-24">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white drop-shadow-sm">Profile & Settings</h1>

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-lg">
                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 mb-4 group cursor-pointer">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-purple-500/30 group-hover:border-purple-500/60 transition-colors">
                                        {session.user?.image ? (
                                            <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <User className="w-10 h-10 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{session.user?.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center break-all">{session.user?.email}</p>
                                <div className="mt-4 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-xs font-semibold capitalize">
                                    {userRole ? userRole.replace('-', ' ') : 'User'}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'account' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'}`}
                            >
                                <User className="w-5 h-5" />
                                <span className="font-medium">Account</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'preferences' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'}`}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Preferences</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'}`}
                            >
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">History</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-lg min-h-[500px]">
                            {activeTab === 'account' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h3>

                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Full Name</label>
                                            <input type="text" value={session.user?.name || ''} disabled className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Email Address</label>
                                            <input type="text" value={session.user?.email || ''} disabled className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Account Type</label>
                                            <div className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white capitalize flex items-center justify-between">
                                                <span>{userRole ? userRole.replace('-', ' ') : 'Standard User'}</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">App Preferences</h3>

                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-500/30 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Globe className="w-6 h-6 text-purple-600" />
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">Sign Language Dialect</h4>
                                                        <p className="text-sm text-gray-500">Choose your preferred sign language</p>
                                                    </div>
                                                </div>
                                                <select
                                                    value={dialect}
                                                    onChange={(e) => setDialect(e.target.value)}
                                                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                                >
                                                    <option value="ISL">ISL (Indian Sign Language)</option>
                                                    <option value="ASL">ASL (American Sign Language)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-500/30 transition-colors">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Volume2 className="w-6 h-6 text-purple-600" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">AI Sensitivity</h4>
                                                    <p className="text-sm text-gray-500">Adjust gesture recognition speed ({sensitivity}%)</p>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={sensitivity}
                                                onChange={(e) => setSensitivity(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                <span>Slow</span>
                                                <span>Fast</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-500/30 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {theme === 'dark' ? <Moon className="w-6 h-6 text-purple-600" /> : <Sun className="w-6 h-6 text-orange-500" />}
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">Theme</h4>
                                                        <p className="text-sm text-gray-500">Switch between light and dark mode</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">History & Data</h3>

                                    {/* Mock History */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Conversations</h4>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">Conversation with Listener #{100 + i}</h4>
                                                        <p className="text-xs text-gray-500">Today, 10:{30 + i} AM • Translate Mode</p>
                                                    </div>
                                                </div>
                                                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Transcript</button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-pink-500" /> Saved Phrases
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {["Hello, how are you?", "I need help", "Where is the formatting?", "Nice to meet you", "Thank you"].map((phrase) => (
                                                <button key={phrase} className="px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 text-sm border border-pink-100 dark:border-pink-900/50 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors">
                                                    {phrase}
                                                </button>
                                            ))}
                                            <button className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                + Add New
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
