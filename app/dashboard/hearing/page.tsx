"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Conversation {
  id: string;
  text: string;
  timestamp: Date;
  language: string;
}

// Declare SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function HearingDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
    { code: "it-IT", name: "Italian", flag: "🇮🇹" },
    { code: "pt-BR", name: "Portuguese", flag: "🇧🇷" },
    { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
    { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
    { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "ar-SA", name: "Arabic", flag: "🇸🇦" },
  ];

  useEffect(() => {
    // Check if user has selected a role
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      if (role !== "hearing") {
        router.push("/role-selection");
      } else {
        setUserRole(role);
        // Load conversation history from localStorage
        const history = localStorage.getItem("conversationHistory");
        if (history) {
          setConversationHistory(JSON.parse(history));
        }
      }

      // Check for Speech Recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, [router]);

  useEffect(() => {
    // Initialize Speech Recognition
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

          setLiveTranscription((prev) => {
            const newText = prev + finalTranscript;
            return newText + interimTranscript;
          });
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "no-speech") {
            // Continue listening
            return;
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          if (isRecording) {
            recognition.start(); // Restart if still recording
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
    }
    router.push("/");
  };

  const handleStartRecording = () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    setIsRecording(true);
    setLiveTranscription("");

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
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleClearText = () => {
    setLiveTranscription("");
  };

  const handleSaveToHistory = () => {
    if (liveTranscription.trim()) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        text: liveTranscription.trim(),
        timestamp: new Date(),
        language: selectedLanguage,
      };
      const updated = [newConversation, ...conversationHistory];
      setConversationHistory(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("conversationHistory", JSON.stringify(updated));
      }
      setLiveTranscription("");
    }
  };

  const handleDeleteConversation = (id: string) => {
    const updated = conversationHistory.filter((c) => c.id !== id);
    setConversationHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("conversationHistory", JSON.stringify(updated));
    }
  };

  const handleClearAllHistory = () => {
    if (confirm("Are you sure you want to clear all conversation history?")) {
      setConversationHistory([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("conversationHistory");
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const selectedLang = languages.find((l) => l.code === selectedLanguage) || languages[0];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative">
      <div className="absolute inset-0 bg-white/30 dark:bg-black/20 pointer-events-none"></div>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md border-b border-purple-200/50 dark:border-purple-800/50 sticky top-0 z-50">
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

              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Voiceless
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Speech to Text</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {/* Communication Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          {/* Text Chat Card */}
          <div
            onClick={() => router.push("/dashboard/conversation")}
            className="bg-[#1a1a2e] dark:bg-[#0f0f1a] p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-white/5 group"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Two-Way Chat</h3>
                <p className="text-gray-400 text-sm">Text-based conversation</p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Text Enabled</span>
              </div>
            </div>
          </div>

          {/* Video Call Card */}
          <div
            onClick={() => router.push("/video-call")}
            className="bg-[#1a1a2e] dark:bg-[#0f0f1a] p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-white/5 group"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Video Call</h3>
                <p className="text-gray-400 text-sm">Real-time Sign & Voice</p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span>Camera Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-purple-200 dark:border-purple-800"
              aria-label="Select language"
            >
              <span className="text-lg">{selectedLang.flag}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedLang.name}</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${showLanguageMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLanguageMenu && (
              <div className="absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-purple-200 dark:border-purple-800 max-h-72 overflow-y-auto z-50">
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
        </div>

        {/* Microphone Button - Compact */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleToggleRecording}
            disabled={!isSupported}
            className={`group relative rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 p-4 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
              ? "bg-gradient-to-br from-red-500 to-rose-600 focus:ring-red-400 animate-pulse"
              : "bg-gradient-to-br from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:ring-purple-400"
              }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <div className="relative">
              {/* Ripple effect */}
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                </>
              )}

              {/* Icon */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                <svg
                  className={`w-12 h-12 md:w-14 md:h-14 text-white transition-transform ${isRecording ? "scale-110" : "group-hover:scale-110"
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isRecording ? (
                    <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth={2.5} />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* Status Text */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                {isRecording ? "Listening..." : "Tap to Speak"}
              </span>
              {isRecording && (
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">Recording</span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Live Text Display - Compact */}
        <div className="mb-6 mt-16">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Live Text
                </h3>
              </div>

              {liveTranscription && (
                <button
                  onClick={handleClearText}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                  aria-label="Clear text"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-900 dark:to-purple-900/30 rounded-xl p-5 min-h-[160px] border border-purple-100 dark:border-purple-900">
              <p
                className={`text-lg md:text-2xl leading-relaxed font-medium transition-all duration-300 ${!liveTranscription
                  ? "text-gray-400 dark:text-gray-600 text-center"
                  : "text-gray-900 dark:text-white"
                  }`}
              >
                {liveTranscription || "Your speech will appear here in real-time..."}
              </p>
            </div>

            {liveTranscription && !isRecording && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleSaveToHistory}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save to History
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conversation History - Compact */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                History
              </h3>
            </div>

            {conversationHistory.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg transition-all duration-200"
                aria-label="Clear all history"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {conversationHistory.length > 0 ? (
              conversationHistory.map((conv, index) => (
                <div
                  key={conv.id}
                  className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-900 dark:to-purple-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-900 hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {languages.find((l) => l.code === conv.language)?.flag || "🌐"}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(conv.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteConversation(conv.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      aria-label="Delete conversation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 leading-relaxed">
                    {conv.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  No conversations yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Start speaking to create your first transcription!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                  Browser Not Supported
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>VOICELESS – A project by Tech Gen Innovations.</p>
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
