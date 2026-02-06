"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, CameraOff } from "lucide-react";

// Define MediaPipe types
declare global {
    interface Window {
        Hands: any;
        Camera: any;
        HAND_CONNECTIONS: any;
    }
}

export default function LiveTranscribe() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [detectedWord, setDetectedWord] = useState<string>("None");
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const handsRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);

    // Gesture detection function
    const detectGesture = (landmarks: any[]) => {
        const thumbOpen = landmarks[4].x < landmarks[3].x;
        const indexOpen = landmarks[8].y < landmarks[6].y;
        const middleOpen = landmarks[12].y < landmarks[10].y;
        const ringOpen = landmarks[16].y < landmarks[14].y;
        const pinkyOpen = landmarks[20].y < landmarks[18].y;

        const indexMiddleDist = Math.abs(landmarks[8].x - landmarks[12].x);
        const middleRingDist = Math.abs(landmarks[12].x - landmarks[16].x);
        const ringPinkyDist = Math.abs(landmarks[16].x - landmarks[20].x);

        const fingersClose = indexMiddleDist < 0.07 && middleRingDist < 0.07 && ringPinkyDist < 0.07;
        const fingersSpread = indexMiddleDist > 0.1 && middleRingDist > 0.1 && ringPinkyDist > 0.1;

        if (thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && fingersSpread) return "Hello";
        if (thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && fingersClose) return "Thank You";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Sorry";
        if (!indexOpen && !middleOpen && !ringOpen && !pinkyOpen && thumbOpen) return "Yes";
        if (indexOpen && !middleOpen && !ringOpen && !pinkyOpen && !thumbOpen) return "No";
        if (thumbOpen && indexOpen && !middleOpen && !ringOpen && pinkyOpen) return "I Love You";
        if (thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && !fingersSpread && !fingersClose) return "Please";
        if (thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen && fingersSpread) return "Stop";
        if (!indexOpen && !middleOpen && !ringOpen && !pinkyOpen && thumbOpen) return "Help";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Good";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Bad";
        if (thumbOpen && indexOpen && middleOpen && !ringOpen && !pinkyOpen) return "Friend";
        if (!thumbOpen && indexOpen && middleOpen && !ringOpen && !pinkyOpen) return "Love";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Eat / Food";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Drink / Water";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Sleep";
        if (thumbOpen && indexOpen && middleOpen && ringOpen && pinkyOpen) return "Happy";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Sad";
        if (!thumbOpen && indexOpen && middleOpen && !ringOpen && !pinkyOpen) return "Play";
        if (!thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return "Go";

        return "Unknown";
    };

    useEffect(() => {
        // Load MediaPipe scripts
        const loadScripts = async () => {
            // Check if scripts are already loaded
            if (window.Hands && window.Camera) {
                setIsLoading(false);
                return;
            }

            // Load Hands script
            const handsScript = document.createElement("script");
            handsScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
            handsScript.async = true;

            // Load Camera Utils script
            const cameraScript = document.createElement("script");
            cameraScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
            cameraScript.async = true;

            document.body.appendChild(handsScript);
            document.body.appendChild(cameraScript);

            // Wait for both scripts to load
            await Promise.all([
                new Promise((resolve) => (handsScript.onload = resolve)),
                new Promise((resolve) => (cameraScript.onload = resolve)),
            ]);

            setIsLoading(false);
        };

        loadScripts();
    }, []);

    const startCamera = async () => {
        if (!videoRef.current || !canvasRef.current || !window.Hands || !window.Camera) return;

        setIsCameraActive(true);

        // Initialize MediaPipe Hands
        const hands = new window.Hands({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            if (!canvas || !video) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];

                // Draw connections (gradient lines)
                for (const connection of window.HAND_CONNECTIONS) {
                    const start = landmarks[connection[0]];
                    const end = landmarks[connection[1]];
                    ctx.beginPath();
                    ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
                    ctx.lineTo(end.x * canvas.width, end.y * canvas.height);

                    // Create gradient for connections
                    const gradient = ctx.createLinearGradient(
                        start.x * canvas.width,
                        start.y * canvas.height,
                        end.x * canvas.width,
                        end.y * canvas.height
                    );
                    gradient.addColorStop(0, "#a855f7");
                    gradient.addColorStop(1, "#ec4899");
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }

                // Draw landmarks (glowing dots)
                for (const landmark of landmarks) {
                    ctx.beginPath();
                    ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 6, 0, 2 * Math.PI);

                    // Glow effect
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "#a855f7";
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                const gesture = detectGesture(landmarks);
                setDetectedWord(gesture);
            } else {
                setDetectedWord("None");
            }

            ctx.restore();
        });

        handsRef.current = hands;

        // Initialize camera
        const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current) {
                    await hands.send({ image: videoRef.current });
                }
            },
            width: 1280,
            height: 720,
        });

        cameraRef.current = camera;
        camera.start();
    };

    const stopCamera = () => {
        if (cameraRef.current) {
            cameraRef.current.stop();
        }
        setIsCameraActive(false);
        setDetectedWord("None");
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-[url('/light-bg.png')] dark:bg-[url('/background-test.jpg')] bg-cover bg-center bg-no-repeat bg-fixed px-4 py-8 relative">
            <div className="absolute inset-0 bg-white/30 dark:bg-black/20 pointer-events-none"></div>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors backdrop-blur-sm z-20 flex items-center gap-2 text-gray-600 dark:text-gray-400"
                aria-label="Go back"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
            </button>

            <main className="relative z-10 max-w-5xl mx-auto pt-16 pb-24">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                        Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">Transcribing</span>
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                        Real-time sign language gesture recognition
                    </p>
                </div>

                {/* Camera Container */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-transparent">
                    <div className="relative w-full max-w-4xl mx-auto">
                        {/* Video and Canvas */}
                        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ transform: "scaleX(-1)" }}
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full"
                                style={{ transform: "scaleX(-1)" }}
                            />

                            {/* Overlay when camera is off */}
                            {!isCameraActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
                                    <div className="text-center">
                                        <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                        <p className="text-white/70 text-lg">Camera is off</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Camera Toggle Button */}
                            <button
                                onClick={isCameraActive ? stopCamera : startCamera}
                                disabled={isLoading}
                                className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg ${isCameraActive
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isCameraActive ? (
                                    <>
                                        <CameraOff className="w-5 h-5" />
                                        <span>Stop Camera</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-5 h-5" />
                                        <span>{isLoading ? "Loading..." : "Start Camera"}</span>
                                    </>
                                )}
                            </button>

                            {/* Detected Word Display */}
                            <div className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Detected Word:</p>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">
                                    {detectedWord}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gesture Guide */}
                <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-2 border-transparent">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Supported Gestures</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {[
                            "Hello", "Thank You", "Sorry", "Yes", "No",
                            "I Love You", "Please", "Stop", "Help", "Good",
                            "Bad", "Friend", "Love", "Happy", "Play"
                        ].map((gesture) => (
                            <div
                                key={gesture}
                                className={`px-3 py-2 rounded-lg text-center text-sm font-medium transition-all ${detectedWord === gesture
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {gesture}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-white/10 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>VOICELESS – A project by Tech Gen Innovations.</p>
                </div>
            </main>
        </div>
    );
}
