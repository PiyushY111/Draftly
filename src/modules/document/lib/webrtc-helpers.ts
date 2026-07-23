export const STUN_SERVERS = [
    {
        urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
        ],
    },
];

export const initializePeerConnection = (
    otherConnectionId: number,
    localStream: MediaStream | null,
    onIceCandidate: (candidate: RTCIceCandidate) => void,
    onTrack: (stream: MediaStream) => void
): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });
    }

    pc.onicecandidate = (e) => {
        if (e.candidate) {
            onIceCandidate(e.candidate);
        }
    };

    pc.ontrack = (e) => {
        const remoteStream = e.streams[0];
        if (remoteStream) {
            onTrack(remoteStream);
        }
    };

    return pc;
};

export const processQueue = async (
    fromId: number,
    pc: RTCPeerConnection,
    iceQueues: Record<number, RTCIceCandidateInit[]>
) => {
    const queue = iceQueues[fromId] || [];
    for (const candidate of queue) {
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error("Error applying queued candidate:", e);
        }
    }
    iceQueues[fromId] = [];
};

export const handleIceCandidateHelper = async (
    pc: RTCPeerConnection | undefined,
    fromId: number,
    candidate: RTCIceCandidateInit,
    iceQueues: Record<number, RTCIceCandidateInit[]>
) => {
    if (pc && pc.remoteDescription) {
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error("Error applying ICE candidate:", e);
        }
    } else {
        if (!iceQueues[fromId]) iceQueues[fromId] = [];
        iceQueues[fromId].push(candidate);
    }
};
