"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  text: string;
  timestamp: Date;
}

export default function HearingDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);

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
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
    }
    router.push("/");
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setLiveTranscription("");
    // TODO: Implement actual speech-to-text recording
    // Simulating real-time transcription
    setTimeout(() => {
      if (isRecording) {
        setLiveTranscription("Listening... Speak now");
      }
    }, 500);
    console.log("Recording started");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: Implement actual speech-to-text stop and transcription
    if (liveTranscription && liveTranscription !== "Listening... Speak now") {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        text: liveTranscription,
        timestamp: new Date(),
      };
      const updated = [newConversation, ...conversationHistory];
      setConversationHistory(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("conversationHistory", JSON.stringify(updated));
      }
    }
    setLiveTranscription("");
    console.log("Recording stopped");
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-purple-200 dark:border-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Voiceless
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Dashboard
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Voice-first communication
          </p>
        </div>

        {/* Speak Now Button - Large and Prominent */}
        <div className="mb-8">
          <button
            onClick={handleToggleRecording}
            className={`w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-10 md:p-12 flex flex-col items-center justify-center gap-6 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-4 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 active:bg-red-700 animate-pulse"
                : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <div
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center ${
                isRecording ? "bg-white/30 animate-bounce" : "bg-white/20"
              }`}
            >
              <svg
                className={`w-16 h-16 md:w-20 md:h-20 text-white ${
                  isRecording ? "animate-pulse" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isRecording ? (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </>
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
            <span className="text-3xl md:text-4xl font-bold text-white">
              {isRecording ? "Stop Recording" : "Speak Now"}
            </span>
            {isRecording && (
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
                <span className="text-lg font-medium">Recording...</span>
              </div>
            )}
          </button>
        </div>

        {/* Live Transcription Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-purple-200 dark:border-purple-900 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
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
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Live Transcription
            </h3>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 min-h-[200px] border-2 border-gray-200 dark:border-gray-600">
            <p
              className={`text-lg md:text-xl text-gray-900 dark:text-gray-100 whitespace-pre-wrap ${
                !liveTranscription ? "text-gray-400 dark:text-gray-500" : ""
              }`}
            >
              {liveTranscription || "Your speech will be transcribed here in real-time..."}
            </p>
          </div>
          {liveTranscription && !isRecording && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  const newConv: Conversation = {
                    id: Date.now().toString(),
                    text: liveTranscription,
                    timestamp: new Date(),
                  };
                  const updated = [newConv, ...conversationHistory];
                  setConversationHistory(updated);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("conversationHistory", JSON.stringify(updated));
                  }
                  setLiveTranscription("");
                }}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
              >
                Save to History
              </button>
              <button
                onClick={() => setLiveTranscription("")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Conversation History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-purple-200 dark:border-purple-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Conversation History
            </h3>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {conversationHistory.length > 0 ? (
              conversationHistory.map((conv) => (
                <div
                  key={conv.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(conv.timestamp).toLocaleString()}
                    </p>
                    <button
                      onClick={() => {
                        const updated = conversationHistory.filter((c) => c.id !== conv.id);
                        setConversationHistory(updated);
                        if (typeof window !== "undefined") {
                          localStorage.setItem(
                            "conversationHistory",
                            JSON.stringify(updated)
                          );
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete conversation"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-base md:text-lg text-gray-900 dark:text-gray-100">
                    {conv.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No conversations yet. Start speaking to create your first transcription!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
