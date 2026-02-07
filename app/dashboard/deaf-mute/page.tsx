"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SavedMessage {
  id: string;
  text: string;
  timestamp: Date;
}

export default function DeafMuteDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showSavedMessages, setShowSavedMessages] = useState(false);
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [showSignLanguage, setShowSignLanguage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [wordList, setWordList] = useState<string[]>([]);
  const [videoError, setVideoError] = useState(false);

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

  useEffect(() => {
    // Playback logic
    if (isPlaying && showSignLanguage && wordList.length > 0) {
      if (wordIndex < wordList.length) {
        setVideoError(false);
        setCurrentWord(wordList[wordIndex]);
      } else {
        setIsPlaying(false);
        setWordIndex(0);
      }
    }
  }, [wordIndex, isPlaying, showSignLanguage, wordList]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
    }
    router.push("/");
  };

  const handleConvertToSign = async () => {
    if (!message.trim()) {
      alert("Please type a message first");
      return;
    }

    setIsConverting(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Translation Error:", data.error);
        alert("Translation failed. Please try again.");
        setIsConverting(false);
        return;
      }

      const sequence = data.sequence || [];
      const newWordList = sequence.map((item: any) => {
        if (item.found && item.video) {
          // Extract filename without extension and path to match current frontend logic
          const filename = item.video.split('/').pop().replace('.mp4', '');
          return filename;
        } else {
          return item.word;
        }
      });

      setWordList(newWordList);

    } catch (error) {
      console.error("Error converting message:", error);
      alert("An error occurred during translation.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setShowSignLanguage(true);
        setIsPlaying(true);
        setWordIndex(0);
      }, 800);
    }
  };

  const handleVideoEnded = () => {
    setWordIndex((prev) => prev + 1);
  };

  const handleVideoError = () => {
    console.warn(`Video not found for word: ${currentWord}`);
    setVideoError(true);
    // Fallback delay to show the word if video is missing
    setTimeout(() => {
      if (isPlaying) {
        setWordIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (wordIndex >= wordList.length) {
        setWordIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    setWordIndex(0);
    setIsPlaying(true);
  };

  const handleClearText = () => {
    setMessage("");
    setShowSignLanguage(false);
    setIsPlaying(false);
    setWordIndex(0);
    setCurrentWord("");
    setWordList([]);
  };

  const handleSaveMessage = () => {
    if (!message.trim()) {
      return;
    }
    const newMessage: SavedMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      timestamp: new Date(),
    };
    const updated = [newMessage, ...savedMessages];
    setSavedMessages(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("savedMessages", JSON.stringify(updated));
    }
    alert("Message saved!");
  };

  const handleUseSavedMessage = (savedMsg: string) => {
    setMessage(savedMsg);
    setShowSavedMessages(false);
    setShowSignLanguage(false);
    setIsPlaying(false);
  };

  const handleDeleteSavedMessage = (id: string) => {
    const updated = savedMessages.filter((msg) => msg.id !== id);
    setSavedMessages(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("savedMessages", JSON.stringify(updated));
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative">
      <div className="absolute inset-0 bg-white/30 dark:bg-black/20 pointer-events-none"></div>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md border-b border-indigo-200/50 dark:border-indigo-800/50 sticky top-0 z-50">
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

              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
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
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Voiceless
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Text to Sign Language</p>
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
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Express Yourself
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Type your message and convert it to sign language
          </p>
        </div>

        {/* Communication Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          {/* Text Chat Card */}
          <div
            onClick={() => router.push("/dashboard/conversation")}
            className="bg-[#1a1a2e] dark:bg-[#0f0f1a] p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-white/5 group"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Two-Way Chat</h3>
                <p className="text-gray-400 text-sm">Text-to-Sign conversation</p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Chat Enabled</span>
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

        {/* Text Input Area */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg p-5 border border-indigo-200 dark:border-indigo-800 mb-4">
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="message-input"
              className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white"
            >
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Your Message
            </label>

            {message && (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveMessage}
                  className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                  aria-label="Save message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save
                </button>
                <button
                  onClick={handleClearText}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                  aria-label="Clear text"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              </div>
            )}
          </div>

          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here... (e.g., Hello, how are you?)"
            className="w-full px-4 py-3 text-lg md:text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none min-h-[120px] font-medium"
            rows={4}
            aria-label="Message input"
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvertToSign}
          disabled={!message.trim() || isConverting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:bg-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 mb-6"
          aria-label="Convert to Sign Language"
        >
          {isConverting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg md:text-xl font-bold">Converting...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-lg md:text-xl font-bold">Convert to Sign Language</span>
            </>
          )}
        </button>

        {/* Sign Language Display Area */}
        {showSignLanguage && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-xl p-5 border border-purple-200 dark:border-purple-800 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Sign Language Display
              </h3>

              {/* Playback Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handleReplay}
                  className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                  aria-label="Replay"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Replay
                </button>
                <button
                  onClick={handlePlayPause}
                  className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Play
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sign Language Animation Display */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center border border-purple-100 dark:border-purple-900 overflow-hidden relative">
              {isPlaying && currentWord ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {!videoError ? (
                    <div className="relative w-full max-w-lg aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
                      {/* Video Player */}
                      <video
                        key={currentWord} // Key ensures video reloads on word change
                        src={`/gestures/${currentWord}.mp4`}
                        autoPlay
                        playsInline
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                      {/* Overlay Text */}
                      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          {currentWord}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center animate-pulse mb-6">
                      {/* Animated Hand Icon Fallback */}
                      <div className="mb-6 relative">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                          </svg>
                        </div>
                        {/* Ripple Effect */}
                        <div className="absolute inset-0 w-32 h-32 mx-auto bg-purple-400 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <p className="text-sm text-red-500 font-medium bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full inline-block">
                        Video not found
                      </p>
                    </div>
                  )}

                  {/* Current Word Display */}
                  <div className="mb-4 text-center">
                    <p className="text-4xl md:text-5xl font-bold text-purple-700 dark:text-purple-300 mb-2 capitalize">
                      {currentWord}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Word {wordIndex + 1} of {wordList.length}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs mx-auto">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${((wordIndex + 1) / wordList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base font-medium">
                    {wordIndex >= wordList.length && wordList.length > 0
                      ? "Animation complete! Click Replay to watch again."
                      : "Click Play to start the sign language animation"}
                  </p>
                </div>
              )}
            </div>

            {/* Full Message Display */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Message:</p>
              <p className="text-base md:text-lg text-gray-900 dark:text-gray-100 font-medium">
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Saved Messages Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg p-5 border border-green-200 dark:border-green-800">
          <button
            onClick={() => setShowSavedMessages(!showSavedMessages)}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Messages ({savedMessages.length})
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showSavedMessages ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSavedMessages && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {savedMessages.length > 0 ? (
                savedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200"
                  >
                    <button
                      onClick={() => handleUseSavedMessage(msg.text)}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium">
                        {msg.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </p>
                    </button>
                    <button
                      onClick={() => handleDeleteSavedMessage(msg.id)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      aria-label="Delete message"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    No saved messages yet
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    Save frequently used phrases for quick access
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

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
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4338ca, #6d28d9);
        }
      `}</style>
    </div>
  );
}
