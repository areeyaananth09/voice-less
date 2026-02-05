import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Transcribing - VoiceLess",
    description: "Real-time sign language gesture recognition using AI-powered hand tracking",
};

export default function LiveTranscribeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
