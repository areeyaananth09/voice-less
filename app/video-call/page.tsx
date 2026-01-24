"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VideoCallPage() {
    const router = useRouter();
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [hearingTranscript, setHearingTranscript] = useState("Hello, I am listening to you clearly.");
    const [signTranslation, setSignTranslation] = useState("Nice to meet you via Voiceless.");

    // Refs for video elements
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Mock accessing user media for demo purposes (usually would be WebRTC)
    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                // For demo, we might mirror local stream to remote if no peer connection
                // BUT better to just leave remote black or placeholder for "User Signing" simulation
                // if (remoteVideoRef.current) {
                //     remoteVideoRef.current.srcObject = stream; 
                // }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };

        startVideo();

        return () => {
            // Cleanup stream
            if (localVideoRef.current && localVideoRef.current.srcObject) {
                const stream = localVideoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getAudioTracks().forEach(track => track.enabled = !isMuted); // Toggle inverse
        }
    };

    const toggleCamera = () => {
        setIsCameraOff(!isCameraOff);
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
        }
    };

    const endCall = () => {
        router.back();
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-900 text-white font-sans">
            {/* Background: Deep Purple & Magenta Wave */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2E0249] to-[#570A57]"></div>
                {/* Abstract Wave Shapes (css-based) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 pointer-events-none">
                    <div className="w-[200%] h-full animate-wave">
                        <svg viewBox="0 0 1440 320" className="w-full h-full text-[#A91079] fill-current">
                            <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none rotate-180">
                    <div className="w-[200%] h-full animate-wave" style={{ animationDirection: 'reverse', animationDuration: '20s' }}>
                        <svg viewBox="0 0 1440 320" className="w-full h-full text-[#570A57] fill-current">
                            <path fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Split Screen Video Interface */}
            <main className="relative z-10 flex flex-col md:flex-row h-screen pt-4 pb-24 px-4 gap-4">

                {/* Left Side: User Signing (You or Remote) */}
                <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black/40 backdrop-blur-sm group transition-all hover:border-[#A91079]/50">
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-white/80 z-20">
                        USER SIGNING
                    </div>
                    {/* Placeholder for Video Feed */}
                    <video ref={remoteVideoRef} autoPlay playsInline muted loop className="w-full h-full object-cover opacity-80"
                        poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    />
                    {/* Overlay Indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-white/90">Gesture Active</span>
                    </div>
                </div>

                {/* Right Side: User Listening (You or Remote) */}
                <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black/40 backdrop-blur-sm group transition-all hover:border-[#570A57]/50">
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-white/80 z-20">
                        USER LISTENING
                    </div>
                    {/* Local Video Feed */}
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />

                    {/* Overlay Indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-white/90">Voice Active</span>
                    </div>
                </div>
            </main>

            {/* Bottom Communication Bar (Transparent) */}
            <div className="absolute bottom-24 left-0 right-0 px-8 z-20 flex justify-center w-full">
                <div className="w-full max-w-5xl flex items-end justify-between gap-8 pointer-events-none">

                    {/* Left: Gesture to Text Output */}
                    <div className="flex-1 text-left space-y-2">
                        <h3 className="text-tiny uppercase tracking-widest text-[#A91079] font-bold opacity-80 mb-1">Gesture to Text</h3>
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-black/40 to-transparent backdrop-blur-md border-l-4 border-[#A91079]">
                            <p className="text-lg md:text-xl font-medium text-white leading-relaxed animate-in fade-in slide-in-from-left-4 duration-500">
                                "{signTranslation}"
                            </p>
                        </div>
                    </div>

                    {/* Right: Voice to Text Output */}
                    <div className="flex-1 text-right space-y-2">
                        <h3 className="text-tiny uppercase tracking-widest text-[#570A57] font-bold opacity-80 mb-1 text-right">Voice to Text</h3>
                        <div className="p-4 rounded-2xl bg-gradient-to-l from-black/40 to-transparent backdrop-blur-md border-r-4 border-[#570A57]">
                            <p className="text-lg md:text-xl font-medium text-white leading-relaxed animate-in fade-in slide-in-from-right-4 duration-500">
                                "{hearingTranscript}"
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-6 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-all duration-300 hover:scale-110 ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    )}
                </button>

                <button
                    onClick={endCall}
                    className="p-5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg shadow-red-600/30"
                    title="End Call"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
                </button>

                <button
                    onClick={toggleCamera}
                    className={`p-4 rounded-full transition-all duration-300 hover:scale-110 ${isCameraOff ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                    {isCameraOff ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
}
