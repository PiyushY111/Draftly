"use client";

import { useBroadcastEvent, useEventListener, useMyPresence, useOthers, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { initializePeerConnection, processQueue, handleIceCandidateHelper } from "../lib/webrtc-helpers";

type VoiceRoomEvent =
    | { type: "join-voice"; connectionId: number }
    | { type: "webrtc-offer"; from: number; to: number; sdp: RTCSessionDescriptionInit }
    | { type: "webrtc-answer"; from: number; to: number; sdp: RTCSessionDescriptionInit }
    | { type: "webrtc-ice-candidate"; from: number; to: number; candidate: RTCIceCandidateInit };

export const useVoiceWebRTC = () => {
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

    const createPC = (otherId: number) => {
        if (pcsRef.current[otherId]) pcsRef.current[otherId].close();
        iceQueuesRef.current[otherId] = [];

        const pc = initializePeerConnection(
            otherId,
            localStreamRef.current,
            (c) => broadcast({ type: "webrtc-ice-candidate", from: myConnectionId, to: otherId, candidate: c.toJSON() }),
            (stream) => setRemoteStreams((prev) => ({ ...prev, [otherId]: stream }))
        );
        pcsRef.current[otherId] = pc;
        return pc;
    };

    const handleOffer = async (fromId: number, sdp: RTCSessionDescriptionInit) => {
        const pc = pcsRef.current[fromId] || createPC(fromId);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        await processQueue(fromId, pc, iceQueuesRef.current);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        broadcast({ type: "webrtc-answer", from: myConnectionId, to: fromId, sdp: answer });
    };

    const handleAnswer = async (fromId: number, sdp: RTCSessionDescriptionInit) => {
        const pc = pcsRef.current[fromId];
        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            await processQueue(fromId, pc, iceQueuesRef.current);
        }
    };

    useEventListener(({ event: data }) => {
        const event = data as VoiceRoomEvent;
        if (!isInVoice) return;

        if (event.type === "join-voice" && event.connectionId !== myConnectionId) {
            const otherId = event.connectionId;
            if (!pcsRef.current[otherId]) {
                const pc = createPC(otherId);
                if (myConnectionId < otherId) {
                    pc.createOffer().then(async (offer) => {
                        await pc.setLocalDescription(offer);
                        broadcast({ type: "webrtc-offer", from: myConnectionId, to: otherId, sdp: offer });
                    });
                }
            }
        }

        if ("to" in event && event.to === myConnectionId) {
            const fromId = event.from;
            if (event.type === "webrtc-offer") handleOffer(fromId, event.sdp);
            else if (event.type === "webrtc-answer") handleAnswer(fromId, event.sdp);
            else if (event.type === "webrtc-ice-candidate") {
                handleIceCandidateHelper(pcsRef.current[fromId], fromId, event.candidate, iceQueuesRef.current);
            }
        }
    });

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

    useEffect(() => {
        return () => {
            Object.values(pcsRef.current).forEach((pc) => pc.close());
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
        };
    }, []);

    const joinVoice = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            stream.getAudioTracks().forEach((t) => { t.enabled = !isMuted; });
            setIsInVoice(true);
            updateMyPresence({ isInVoice: true, isMuted });

            activeOthers
                .filter((o) => ((o.presence as unknown) as { isInVoice?: boolean })?.isInVoice)
                .forEach(async (user) => {
                    const otherId = user.connectionId;
                    const pc = createPC(otherId);
                    if (myConnectionId < otherId) {
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        broadcast({ type: "webrtc-offer", from: myConnectionId, to: otherId, sdp: offer });
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
            localStreamRef.current.getAudioTracks().forEach((track) => { track.enabled = !nextMute; });
        }
    };

    return {
        isInVoice,
        isMuted,
        remoteStreams,
        voiceParticipants: activeOthers.filter((o) => ((o.presence as unknown) as { isInVoice?: boolean })?.isInVoice),
        joinVoice,
        leaveVoice,
        toggleMute,
    };
};
