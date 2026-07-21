"use client";

import { useBroadcastEvent, useEventListener, useMyPresence, useOthers, useSelf } from "@liveblocks/react/suspense";
import { Mic, MicOff, PhoneCall, PhoneOff, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type VoiceRoomEvent =
    | { type: "join-voice"; connectionId: number }
    | { type: "webrtc-offer"; from: number; to: number; sdp: RTCSessionDescriptionInit }
    | { type: "webrtc-answer"; from: number; to: number; sdp: RTCSessionDescriptionInit }
    | { type: "webrtc-ice-candidate"; from: number; to: number; candidate: RTCIceCandidateInit };

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
    const me = useSelf();
    const activeOthers = useOthers();
    const [myPresence, updateMyPresence] = useMyPresence();
    const broadcast = useBroadcastEvent();

    const [isInVoice, setIsInVoice] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [remoteStreams, setRemoteStreams] = useState<Record<number, MediaStream>>({});

    const myConnectionId = me.connectionId;

    const pcsRef = useRef<Record<number, RTCPeerConnection>>({});
    const iceQueuesRef = useRef<Record<number, RTCIceCandidateInit[]>>({});
    const localStreamRef = useRef<MediaStream | null>(null);

    // Create RTCPeerConnection for a peer
    const createPC = (otherConnectionId: number) => {
        console.log(`[VoiceTalk] Creating peer connection for connectionId: ${otherConnectionId}`);
        if (pcsRef.current[otherConnectionId]) {
            pcsRef.current[otherConnectionId].close();
        }
        
        iceQueuesRef.current[otherConnectionId] = [];

        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302",
                    ],
                },
            ],
        });

        pc.onconnectionstatechange = () => {
            console.log(`[VoiceTalk] Peer ${otherConnectionId} ConnectionState: ${pc.connectionState}`);
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`[VoiceTalk] Peer ${otherConnectionId} ICE ConnectionState: ${pc.iceConnectionState}`);
        };

        pcsRef.current[otherConnectionId] = pc;

        // Add local tracks to peer connection
        if (localStreamRef.current) {
            console.log(`[VoiceTalk] Adding local tracks to peer: ${otherConnectionId}`);
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });
        } else {
            console.warn(`[VoiceTalk] No local stream found to share with peer: ${otherConnectionId}`);
        }

        // Send local ICE candidates to peer
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log(`[VoiceTalk] Local ICE candidate generated for peer ${otherConnectionId}:`, e.candidate.candidate);
                broadcast({
                    type: "webrtc-ice-candidate",
                    from: myConnectionId,
                    to: otherConnectionId,
                    candidate: e.candidate.toJSON(),
                });
            }
        };

        // Capture remote stream
        pc.ontrack = (e) => {
            const remoteStream = e.streams[0];
            console.log(`[VoiceTalk] Received remote stream track from peer: ${otherConnectionId}`, remoteStream);
            if (remoteStream) {
                setRemoteStreams((prev) => ({
                    ...prev,
                    [otherConnectionId]: remoteStream,
                }));
            }
        };

        return pc;
    };

    const processQueue = async (fromId: number, pc: RTCPeerConnection) => {
        const queue = iceQueuesRef.current[fromId] || [];
        console.log(`[VoiceTalk] Draining ${queue.length} queued ICE candidates for peer: ${fromId}`);
        for (const candidate of queue) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error(`[VoiceTalk] Error applying queued candidate for peer ${fromId}:`, e);
            }
        }
        iceQueuesRef.current[fromId] = [];
    };

    const handleOffer = async (fromId: number, sdp: RTCSessionDescriptionInit) => {
        console.log(`[VoiceTalk] Handling SDP Offer from peer: ${fromId}`);
        const pc = pcsRef.current[fromId] || createPC(fromId);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        
        // Process any queued candidates after remote description is set
        await processQueue(fromId, pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        console.log(`[VoiceTalk] Sending SDP Answer to peer: ${fromId}`);
        broadcast({
            type: "webrtc-answer",
            from: myConnectionId,
            to: fromId,
            sdp: answer,
        });
    };

    const handleAnswer = async (fromId: number, sdp: RTCSessionDescriptionInit) => {
        console.log(`[VoiceTalk] Handling SDP Answer from peer: ${fromId}`);
        const pc = pcsRef.current[fromId];
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            // Process any queued candidates after remote description is set
            await processQueue(fromId, pc);
        } else {
            console.error(`[VoiceTalk] Received answer for missing peer connection: ${fromId}`);
        }
    };

    const handleIceCandidate = async (fromId: number, candidate: RTCIceCandidateInit) => {
        const pc = pcsRef.current[fromId];
        if (pc && pc.remoteDescription) {
            try {
                console.log(`[VoiceTalk] Directly applying remote ICE candidate from peer: ${fromId}`);
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error(`[VoiceTalk] Error applying ICE candidate from peer ${fromId}:`, e);
            }
        } else {
            console.log(`[VoiceTalk] Queuing remote ICE candidate from peer: ${fromId}`);
            // Remote description not set yet, queue the candidate
            if (!iceQueuesRef.current[fromId]) {
                iceQueuesRef.current[fromId] = [];
            }
            iceQueuesRef.current[fromId].push(candidate);
        }
    };

    // Listen to signaling events
    useEventListener(({ connectionId: senderConnectionId, event: data }) => {
        const event = data as VoiceRoomEvent;
        if (!isInVoice) return;

        if (event.type === "join-voice") {
            const otherId = event.connectionId;
            if (otherId === myConnectionId) return;

            if (!pcsRef.current[otherId]) {
                const pc = createPC(otherId);
                // Lower connectionId initiates the offer
                if (myConnectionId < otherId) {
                    pc.createOffer().then(async (offer) => {
                        await pc.setLocalDescription(offer);
                        broadcast({
                            type: "webrtc-offer",
                            from: myConnectionId,
                            to: otherId,
                            sdp: offer,
                        });
                    });
                }
            }
        }

        // Events directed specifically to this client
        if ("to" in event && event.to === myConnectionId) {
            const fromId = event.from;
            if (event.type === "webrtc-offer") {
                handleOffer(fromId, event.sdp);
            } else if (event.type === "webrtc-answer") {
                handleAnswer(fromId, event.sdp);
            } else if (event.type === "webrtc-ice-candidate") {
                handleIceCandidate(fromId, event.candidate);
            }
        }
    });

    // Clean up peers who disconnected or left the call
    useEffect(() => {
        const activeIds = new Set(
            activeOthers
                .filter((o) => ((o.presence as unknown) as { isInVoice?: boolean })?.isInVoice)
                .map((o) => o.connectionId)
        );

        Object.keys(pcsRef.current).forEach((idStr) => {
            const id = parseInt(idStr);
            if (!activeIds.has(id)) {
                pcsRef.current[id]?.close();
                delete pcsRef.current[id];
                delete iceQueuesRef.current[id];
                setRemoteStreams((prev) => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            }
        });
    }, [activeOthers]);

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            Object.values(pcsRef.current).forEach((pc) => pc.close());
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    const joinVoice = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;

            stream.getAudioTracks().forEach((track) => {
                track.enabled = !isMuted;
            });

            setIsInVoice(true);
            updateMyPresence({ isInVoice: true, isMuted });

            // Connect with everyone already active in call
            activeOthers
                .filter((o) => ((o.presence as unknown) as { isInVoice?: boolean })?.isInVoice)
                .forEach(async (user) => {
                    const otherId = user.connectionId;
                    const pc = createPC(otherId);

                    if (myConnectionId < otherId) {
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        broadcast({
                            type: "webrtc-offer",
                            from: myConnectionId,
                            to: otherId,
                            sdp: offer,
                        });
                    }
                });

            broadcast({ type: "join-voice", connectionId: myConnectionId });
            toast.success("Joined Voice Room");
        } catch (err) {
            toast.error("Microphone access is required for Voice Rooms");
        }
    };

    const leaveVoice = () => {
        Object.values(pcsRef.current).forEach((pc) => pc.close());
        pcsRef.current = {};
        iceQueuesRef.current = {};
        setRemoteStreams({});

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }

        setIsInVoice(false);
        updateMyPresence({ isInVoice: false, isMuted: false });
        toast.success("Left Voice Room");
    };

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        updateMyPresence({ isMuted: nextMute });

        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !nextMute;
            });
        }
    };

    const voiceParticipants = activeOthers.filter(
        (o) => ((o.presence as unknown) as { isInVoice?: boolean })?.isInVoice
    );

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
