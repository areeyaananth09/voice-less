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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <main className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Who are you?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select your role to continue
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Deaf / Mute User Card */}
          <button
            onClick={() => handleRoleSelect("deaf-mute")}
            className={`group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 md:p-12 border-4 ${
              selectedRole === "deaf-mute"
                ? "border-indigo-600 dark:border-indigo-400 scale-105"
                : "border-transparent hover:border-indigo-300 dark:hover:border-indigo-700"
            } focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-4`}
            aria-label="Select Deaf or Mute User role"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-16 h-16 md:w-20 md:h-20 text-indigo-600 dark:text-indigo-400"
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
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
              Deaf / Mute User
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Text and Sign Language interface
            </p>

            {/* Accessibility Indicator */}
            <div className="mt-6 flex justify-center">
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
            className={`group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 md:p-12 border-4 ${
              selectedRole === "hearing"
                ? "border-purple-600 dark:border-purple-400 scale-105"
                : "border-transparent hover:border-purple-300 dark:hover:border-purple-700"
            } focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-4`}
            aria-label="Select Hearing User role"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-16 h-16 md:w-20 md:h-20 text-purple-600 dark:text-purple-400"
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
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
              Hearing User
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Speech-to-Text interface
            </p>

            {/* Microphone Indicator */}
            <div className="mt-6 flex justify-center">
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
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your selection will customize your experience
          </p>
        </div>
      </main>
    </div>
  );
}

