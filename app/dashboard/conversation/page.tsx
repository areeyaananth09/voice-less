"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Message {
    id: string;
    type: "hearing" | "deaf-mute";
    text: string;
    timestamp: Date;
}

// Declare SpeechRecognition types
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function ConversationPage() {
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const [hearingText, setHearingText] = useState("");
    const [deafMuteText, setDeafMuteText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [showSignLanguage, setShowSignLanguage] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWord, setCurrentWord] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en-US", name: "English (US)", flag: "🇺🇸" },
        { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
        { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
        { code: "fr-FR", name: "French", flag: "🇫🇷" },
        { code: "de-DE", name: "German", flag: "🇩🇪" },
        { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    ];

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setIsSupported(false);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = selectedLanguage;

                recognition.onresult = (event: any) => {
                    let interimTranscript = "";
                    let finalTranscript = "";

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + " ";
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    setHearingText((prev) => {
                        const newText = prev + finalTranscript;
                        return newText + interimTranscript;
                    });
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error);
                    if (event.error === "no-speech") {
                        return;
                    }
                    setIsRecording(false);
                };

                recognition.onend = () => {
                    if (isRecording) {
                        recognition.start();
                    }
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [selectedLanguage, isRecording]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isPlaying && showSignLanguage && deafMuteText) {
            const words = deafMuteText.split(" ").filter(word => word.trim());
            if (wordIndex < words.length) {
                setCurrentWord(words[wordIndex]);
                const timer = setTimeout(() => {
                    setWordIndex(wordIndex + 1);
                }, 1500);
                return () => clearTimeout(timer);
            } else {
                setIsPlaying(false);
                setWordIndex(0);
            }
        }
    }, [isPlaying, wordIndex, deafMuteText, showSignLanguage]);

    const handleStartRecording = () => {
        if (!isSupported) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }
        setIsRecording(true);
        setHearingText("");
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error("Error starting recognition:", error);
            }
        }
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (hearingText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                type: "hearing",
                text: hearingText.trim(),
                timestamp: new Date(),
            };
            setMessages([...messages, newMessage]);
            setHearingText("");
        }
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    const handleConvertToSign = () => {
        if (!deafMuteText.trim()) {
            alert("Please type a message first");
            return;
        }
        setShowSignLanguage(true);
        setIsPlaying(true);
        setWordIndex(0);
    };

    const handleSendDeafMuteMessage = () => {
        if (!deafMuteText.trim()) {
            return;
        }
        const newMessage: Message = {
            id: Date.now().toString(),
            type: "deaf-mute",
            text: deafMuteText.trim(),
            timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);
        setDeafMuteText("");
        setShowSignLanguage(false);
        setIsPlaying(false);
    };

    const handleClearConversation = () => {
        if (confirm("Are you sure you want to clear the entire conversation?")) {
            setMessages([]);
            setHearingText("");
            setDeafMuteText("");
            setShowSignLanguage(false);
            setIsPlaying(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const selectedLang = languages.find((l) => l.code === selectedLanguage) || languages[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md border-b border-purple-200/50 dark:border-purple-800/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Go back"
                            >
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    Two-Way Communication
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Real-time conversation</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-purple-200 dark:border-purple-800"
                                    aria-label="Select language"
                                >
                                    <span className="text-base">{selectedLang.flag}</span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{selectedLang.name}</span>
                                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${showLanguageMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showLanguageMenu && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-purple-200 dark:border-purple-800 max-h-72 overflow-y-auto z-50">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setSelectedLanguage(lang.code);
                                                    setShowLanguageMenu(false);
                                                }}
                                                className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-sm ${lang.code === selectedLanguage ? "bg-purple-100 dark:bg-purple-900/50" : ""
                                                    }`}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{lang.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleClearConversation}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                aria-label="Clear conversation"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Screen with Equal Heights */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* LEFT SIDE - HEARING USER SECTION */}
                    <div className="flex flex-col h-full">
                        {/* Header Card */}
                        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-xl p-3 border border-purple-300 dark:border-purple-700 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-purple-900 dark:text-purple-100">Hearing User</h2>
                                    <p className="text-xs text-purple-700 dark:text-purple-300">Speak to communicate</p>
                                </div>
                            </div>
                        </div>

                        {/* Microphone Button */}
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={handleToggleRecording}
                                disabled={!isSupported}
                                className={`group relative rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 p-3 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
                                        ? "bg-gradient-to-br from-red-500 to-rose-600 focus:ring-red-400 animate-pulse"
                                        : "bg-gradient-to-br from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:ring-purple-400"
                                    }`}
                                aria-label={isRecording ? "Stop recording" : "Start recording"}
                            >
                                <div className="relative">
                                    {isRecording && (
                                        <>
                                            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                                            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                                        </>
                                    )}

                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className={`w-10 h-10 text-white transition-transform ${isRecording ? "scale-110" : "group-hover:scale-110"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {isRecording ? (
                                                <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth={2.5} />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            )}
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="text-center mb-4">
                            <span className="text-sm font-bold text-gray-800 dark:text-white">
                                {isRecording ? "Listening..." : "Tap to Speak"}
                            </span>
                        </div>

                        {/* Live Transcription */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-purple-200 dark:border-purple-800 flex-grow">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Live Speech-to-Text
                            </h3>
                            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 min-h-[140px] border border-purple-100 dark:border-purple-900">
                                <p className={`text-base leading-relaxed ${!hearingText ? "text-gray-400 dark:text-gray-600 text-center" : "text-gray-900 dark:text-white font-medium"}`}>
                                    {hearingText || "Your speech will appear here..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - DEAF/MUTE USER SECTION */}
                    <div className="flex flex-col h-full">
                        {/* Header Card */}
                        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl p-3 border border-indigo-300 dark:border-indigo-700 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-indigo-900 dark:text-indigo-100">Deaf / Mute User</h2>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-300">Type to communicate</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Input */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-indigo-200 dark:border-indigo-800 mb-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Type Your Message
                            </h3>
                            <textarea
                                value={deafMuteText}
                                onChange={(e) => setDeafMuteText(e.target.value)}
                                placeholder="Type your message here..."
                                className="w-full px-3 py-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none min-h-[100px]"
                                rows={4}
                            />

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleConvertToSign}
                                    disabled={!deafMuteText.trim()}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg py-2 px-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                    </svg>
                                    Convert to Sign
                                </button>
                                <button
                                    onClick={handleSendDeafMuteMessage}
                                    disabled={!deafMuteText.trim()}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all duration-200"
                                >
                                    Send
                                </button>
                            </div>
                        </div>

                        {/* Sign Language Display */}
                        {showSignLanguage && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-indigo-200 dark:border-indigo-800 animate-fadeIn flex-grow">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Sign Language Preview
                                </h3>
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg p-6 min-h-[140px] flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                                    {isPlaying && currentWord ? (
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-bounce mb-2">
                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{currentWord}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Click "Convert to Sign" to see animation</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conversation History */}
                <div className="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Conversation History
                    </h3>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.type === "hearing" ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-xl p-3 ${msg.type === "hearing"
                                                ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800"
                                                : "bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.type === "hearing" ? "bg-purple-600" : "bg-indigo-600"}`}>
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {msg.type === "hearing" ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    )}
                                                </svg>
                                            </div>
                                            <span className={`text-xs font-semibold ${msg.type === "hearing" ? "text-purple-700 dark:text-purple-300" : "text-indigo-700 dark:text-indigo-300"}`}>
                                                {msg.type === "hearing" ? "Hearing User" : "Deaf/Mute User"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No messages yet</p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Start a conversation!</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </main>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #c026d3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7e22ce, #a21caf);
        }
      `}</style>
        </div>
    );
}
