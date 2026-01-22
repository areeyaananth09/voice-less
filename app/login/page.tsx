"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isOtpLogin, setIsOtpLogin] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        console.log("Login attempt:", { email, password });
        setError("");
        router.push("/role-selection");
    };

    const handleSendOtp = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }
        setIsLoading(true);
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
            });
            setOtpSent(true);
            setError("");
            alert("OTP sent to your email!");
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpLogin = async () => {
        if (!otp) {
            setError("Please enter the OTP");
            return;
        }
        setIsLoading(true);
        try {
            await authClient.signIn.emailOtp({
                email,
                otp,
            });
            router.push("/role-selection");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/role-selection",
        });
    };

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900">
                <div className="animate-pulse text-purple-400">Loading...</div>
            </div>
        );
    }

    // If already logged in, redirect to dashboard or show simpler view
    if (session) {
        router.push("/role-selection");
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative">
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

            <main className="w-full max-w-md px-6 py-8 relative z-10">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2 drop-shadow-sm">
                            Voiceless
                        </h1>
                        <p className="text-gray-200 text-sm tracking-wide">
                            Sign in to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-black/40 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                                required
                            />
                        </div>

                        {!isOtpLogin ? (
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOtpLogin(true);
                                            setError("");
                                        }}
                                        className="text-sm font-medium text-purple-300 hover:text-purple-200"
                                    >
                                        Login with Code
                                    </button>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-black/40 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                                    required
                                />
                            </div>
                        ) : (
                            <div className="flex justify-end mb-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOtpLogin(false);
                                        setOtpSent(false);
                                        setError("");
                                    }}
                                    className="text-sm font-medium text-purple-300 hover:text-purple-200"
                                >
                                    Login with Password
                                </button>
                            </div>
                        )}

                        {isOtpLogin && !otpSent && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                            >
                                {isLoading ? "Sending OTP..." : "Send OTP Code"}
                            </button>
                        )}

                        {isOtpLogin && otpSent && (
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-200 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-black/40 text-white placeholder-gray-400 backdrop-blur-sm tracking-widest text-center text-lg"
                                    required
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isLoading}
                                        className="text-xs text-purple-300 hover:text-purple-200 font-medium"
                                    >
                                        {isLoading ? "Sending..." : "Resend OTP"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        {(!isOtpLogin || otpSent) && (
                            <button
                                type={isOtpLogin ? "button" : "submit"}
                                onClick={isOtpLogin ? handleOtpLogin : undefined}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                            >
                                {isLoading ? "Signing in..." : (isOtpLogin ? "Verify & Sign In" : "Sign In")}
                            </button>
                        )}

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full flex justify-center items-center gap-3 bg-white text-gray-700 hover:bg-gray-100 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-300">
                            New to Voiceless?{" "}
                            <Link
                                href="/signup"
                                className="text-purple-300 font-semibold hover:text-purple-200 underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
