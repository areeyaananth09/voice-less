"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeafMuteDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showSavedMessages, setShowSavedMessages] = useState(false);
  const [savedMessages, setSavedMessages] = useState<string[]>([
    "Hello, how are you?",
    "Thank you",
    "Nice to meet you",
    "I need help",
    "Can you repeat that?",
  ]);

  useEffect(() => {
    // Check if user has selected a role
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      if (role !== "deaf-mute") {
        router.push("/role-selection");
      } else {
        setUserRole(role);
        // Load saved messages from localStorage
        const saved = localStorage.getItem("savedMessages");
        if (saved) {
          setSavedMessages(JSON.parse(saved));
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

  const handleTypeMessage = () => {
    // Open text input modal or focus text area
    const textArea = document.getElementById("message-input");
    if (textArea) {
      textArea.focus();
    }
  };

  const handleConvertToSign = () => {
    if (!message.trim()) {
      alert("Please type a message first");
      return;
    }
    // TODO: Implement sign language conversion
    console.log("Converting to sign language:", message);
  };

  const handleSaveMessage = () => {
    if (!message.trim()) {
      return;
    }
    const updated = [...savedMessages, message];
    setSavedMessages(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("savedMessages", JSON.stringify(updated));
    }
    setMessage("");
    alert("Message saved!");
  };

  const handleUseSavedMessage = (savedMsg: string) => {
    setMessage(savedMsg);
    setShowSavedMessages(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-indigo-200 dark:border-indigo-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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
            Communicate with ease
          </p>
        </div>

        {/* Primary Action Buttons - Large and High Contrast */}
        <div className="space-y-4 mb-8">
          {/* Type Message Button */}
          <button
            onClick={handleTypeMessage}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 md:p-8 flex items-center justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Type Message"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <span className="text-2xl md:text-3xl font-bold">Type Message</span>
          </button>

          {/* Text Input Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-indigo-200 dark:border-indigo-900">
            <label
              htmlFor="message-input"
              className="block text-lg font-semibold text-gray-900 dark:text-white mb-3"
            >
              Your Message
            </label>
            <textarea
              id="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-5 py-4 text-lg md:text-xl border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none min-h-[120px]"
              rows={5}
              aria-label="Message input"
            />
          </div>

          {/* Text → Sign Language Button */}
          <button
            onClick={handleConvertToSign}
            disabled={!message.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 md:p-8 flex items-center justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Convert to Sign Language"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <span className="text-2xl md:text-3xl font-bold">Text → Sign Language</span>
          </button>

          {/* Sign Language Display */}
          {message && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-900">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sign Language Display
              </h3>
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-8 min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Sign language animation will appear here
                </p>
              </div>
            </div>
          )}

          {/* Saved Messages Button */}
          <button
            onClick={() => setShowSavedMessages(!showSavedMessages)}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 md:p-8 flex items-center justify-center gap-4 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Saved Messages"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <span className="text-2xl md:text-3xl font-bold">Saved Messages</span>
          </button>

          {/* Saved Messages List */}
          {showSavedMessages && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-green-200 dark:border-green-900">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Frequently Used Phrases
                </h3>
                {message.trim() && (
                  <button
                    onClick={handleSaveMessage}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Save Current
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {savedMessages.length > 0 ? (
                  savedMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => handleUseSavedMessage(msg)}
                      className="w-full text-left px-5 py-4 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl transition-all duration-200"
                    >
                      <p className="text-base md:text-lg text-gray-900 dark:text-gray-100">
                        {msg}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No saved messages yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
