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
                            className="w-full flex justify-center items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm backdrop-blur-sm"
                        >
                            Google Sign In
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
