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

    // Text-to-Sign State
    const [message, setMessage] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const [showSignLanguage, setShowSignLanguage] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWord, setCurrentWord] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [wordList, setWordList] = useState<string[]>([]);
    const [videoError, setVideoError] = useState(false);

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

    // Text-to-Sign Effects
    useEffect(() => {
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

    // Text-to-Sign Handlers
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

            // Extract sequence of video paths
            const words: string[] = [];

            // Map the video sequence
            // Note: If 'found' is false, you might want to spell it out or handle differently
            // For now, we just skip "not found" ones or add to list to trigger fallback UI
            // However, your video player expects "words" which map to "/gestures/word.mp4"
            // The API returns { word: string, video: string | null, found: boolean }

            // Wait, the existing video player logic uses `src={\`/gestures/${currentWord}.mp4\`}`
            // This means `currentWord` must be the filename base.
            // If the API returns a full path like "/gestures/hello.mp4", 
            // we should probably adjust either the frontend logic or the API response.
            // The API uses existing DB data: `video_path`='/gestures/hello.mp4'.
            // The frontend uses: `src={\`/gestures/${currentWord}.mp4\`}` -> turns into `/gestures//gestures/hello.mp4.mp4` -> BROKEN.

            // FIX: We need to adapt the frontend to use the FULL path returned by the API
            // OR change the API to return just the word if it maps 1:1.
            // Since the API returns specific video paths that might not match the word exactly (e.g. synonyms),
            // it's better to use the path directly.

            // Refactoring to store objects { word: string, videoSrc: string } in state would be better,
            // but to minimize changes, let's see.
            // Current state: `wordList` is `string[]`. `currentWord` is `string`.
            // Video src is derived: `/gestures/${currentWord}.mp4`.

            // Let's change `wordList` to store the WORD identifiers that match the filenames
            // derived from the API response. 
            // BUT wait, the API returns existing paths from DB which are like `/gestures/hello.mp4`.
            // If I just extract 'hello' from that, it works with current frontend.

            const sequence = data.sequence || [];
            const newWordList = sequence.map((item: any) => {
                if (item.found && item.video) {
                    // Extract filename without extension and path
                    // e.g. "/gestures/hello.mp4" -> "hello"
                    const filename = item.video.split('/').pop().replace('.mp4', '');
                    return filename;
                } else {
                    // For now, return the word itself to trigger fallback (or specific error UI)
                    return item.word;
                }
            });

            setWordList(newWordList);

        } catch (error) {
            console.error("Error converting message:", error);
            alert("An error occurred. Please try again.");
        } finally {
            // Simulate conversion delay for UX
            setTimeout(() => {
                setIsConverting(false);
                setShowSignLanguage(true);
                setIsPlaying(true);
                setWordIndex(0);
                // Scroll to video player
                document.getElementById("sign-display")?.scrollIntoView({ behavior: "smooth" });
            }, 500);
        }
    };

    const handleVideoEnded = () => {
        setWordIndex((prev) => prev + 1);
    };

    const handleVideoError = () => {
        console.warn(`Video not found for word: ${currentWord}`);
        setVideoError(true);
        // Fallback delay
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

                {/* Text-to-Sign Section */}
                <div className="mt-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Type to Sign
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Translate your text into sign language videos
                        </p>
                    </div>

                    {/* Text Input Area */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg p-5 border border-purple-200 dark:border-purple-800 mb-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <label htmlFor="message-input" className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Your Message
                            </label>
                            {message && (
                                <button
                                    onClick={handleClearText}
                                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </button>
                            )}
                        </div>

                        <textarea
                            id="message-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type here to convert to sign language..."
                            className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none min-h-[100px]"
                            rows={3}
                        />

                        <button
                            onClick={handleConvertToSign}
                            disabled={!message.trim() || isConverting}
                            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg p-3 flex items-center justify-center gap-2 font-bold transition-all"
                        >
                            {isConverting ? "Converting..." : "Convert to Sign Language"}
                        </button>
                    </div>

                    {/* Sign Language Video Display */}
                    {showSignLanguage && (
                        <div id="sign-display" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-xl p-5 border border-purple-200 dark:border-purple-800 mb-8 max-w-4xl mx-auto animate-fadeIn">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Sign Playback
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={handleReplay} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-lg">Replay</button>
                                    <button onClick={handlePlayPause} className="px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs font-medium rounded-lg">
                                        {isPlaying ? "Pause" : "Play"}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-black/5 dark:bg-black/20 rounded-lg p-4 min-h-[300px] flex flex-col items-center justify-center relative">
                                {isPlaying && currentWord ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        {!videoError ? (
                                            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
                                                <video
                                                    key={currentWord}
                                                    src={`/gestures/${currentWord}.mp4`}
                                                    autoPlay
                                                    playsInline
                                                    onEnded={handleVideoEnded}
                                                    onError={handleVideoError}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                                                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm capitalize">
                                                        {currentWord}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center animate-pulse mb-6">
                                                <div className="w-24 h-24 mx-auto bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                </div>
                                                <p className="text-red-500 font-medium bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full inline-block">
                                                    Video not found
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-1">{currentWord}</p>
                                        <p className="text-sm text-gray-500">Word {wordIndex + 1} of {wordList.length}</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-gray-500">Animation complete or paused.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
