"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: "deaf-mute" | "hearing") => {
    setSelectedRole(role);

    // Save role to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role);
    }

    // Navigate to appropriate dashboard with smooth transition
    setTimeout(() => {
      if (role === "deaf-mute") {
        router.push("/dashboard/deaf-mute");
      } else {
        router.push("/dashboard/hearing");
      }
    }, 300); // Small delay for visual feedback
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 px-4 py-8">
      {/* Back Button - Top Left */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors backdrop-blur-sm"
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

      <main className="w-full max-w-2xl">
        {/* Header - Compact */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Who are you?
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Select your role to continue
          </p>
        </div>

        {/* Role Selection Cards - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Deaf / Mute User Card */}
          <button
            onClick={() => handleRoleSelect("deaf-mute")}
            className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border-2 ${selectedRole === "deaf-mute"
                ? "border-indigo-600 dark:border-indigo-400 scale-105"
                : "border-transparent hover:border-indigo-300 dark:hover:border-indigo-700"
              } focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2`}
            aria-label="Select Deaf or Mute User role"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                  {/* Sign language hand representation */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h8M8 16h8"
                  />
                </svg>
              </div>
            </div>

            {/* Label */}
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Deaf / Mute User
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              Text and Sign Language interface
            </p>

            {/* Accessibility Indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Accessibility Enabled</span>
              </div>
            </div>
          </button>

          {/* Hearing User Card */}
          <button
            onClick={() => handleRoleSelect("hearing")}
            className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border-2 ${selectedRole === "hearing"
                ? "border-purple-600 dark:border-purple-400 scale-105"
                : "border-transparent hover:border-purple-300 dark:hover:border-purple-700"
              } focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2`}
            aria-label="Select Hearing User role"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Label */}
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Hearing User
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              Speech-to-Text interface
            </p>

            {/* Microphone Indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Voice Enabled</span>
              </div>
            </div>
          </button>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your selection will customize your experience
          </p>
        </div>
      </main>
    </div>
  );
}
