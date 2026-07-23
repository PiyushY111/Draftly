"use client";
import { Button } from "@/components/ui";


import { Mic, MicOff, PhoneCall, PhoneOff, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useVoiceWebRTC } from "../../hooks/use-voice-webrtc";

const AudioPlayer = ({ stream }: { stream: MediaStream }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.play().catch(() => {});
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay playsInline className="hidden" />;
};

export const VoiceTalk = () => {
    const {
        isInVoice,
        isMuted,
        remoteStreams,
        voiceParticipants,
        joinVoice,
        leaveVoice,
        toggleMute,
    } = useVoiceWebRTC();

    return (
        <div className="flex items-center gap-2 print:hidden select-none">
            {/* Audio streams players */}
            {Object.entries(remoteStreams).map(([connId, stream]) => (
                <AudioPlayer key={connId} stream={stream} />
            ))}

            {isInVoice ? (
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200/80 rounded-full px-3 py-1 animate-pulse">
                    <div className="flex items-center gap-1">
                        <Users className="size-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">
                            {voiceParticipants.length + 1}
                        </span>
                    </div>

                    <Button
                        onClick={toggleMute}
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-full text-green-700 hover:bg-green-100"
                        title={isMuted ? "Unmute Mic" : "Mute Mic"}
                    >
                        {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                    </Button>

                    <Button
                        onClick={leaveVoice}
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700"
                        title="Leave Call"
                    >
                        <PhoneOff className="size-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={joinVoice}
                    variant="outline"
                    size="sm"
                    className="gap-2 border-slate-200 text-slate-600 hover:text-slate-900 rounded-full text-xs font-semibold h-8"
                >
                    <PhoneCall className="size-3.5 text-blue-500" />
                    Join Talk
                </Button>
            )}
        </div>
    );
};
