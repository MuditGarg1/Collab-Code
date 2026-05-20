import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import {
  createPeerConnection,
  addLocalTracks,
  createOffer,
  handleOffer,
  handleAnswer,
  addIce,
  replaceVideoTrack,
  replaceCameraTrack,
} from "../../utils/webrtc";

const toRoleKey = role => {
  if (role === "interviewer") return "host";
  if (role === "interviewee") return "client";
  return role;
};

export default function useVideoRoom(socket, roomId, role) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const shouldCreateOfferRef = useRef(false);
  const pendingOfferRef = useRef(null);
  const meetingEndedRef = useRef(false);

  const [micOn, setMicOn] = useState(() => {
    const v = localStorage.getItem("micOn");
    return v === null ? true : v === "true";
  });

  const [camOn, setCamOn] = useState(() => {
    const v = localStorage.getItem("camOn");
    return v === null ? true : v === "true";
  });

  const [sharing, setSharing] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  // Expose meeting-ended state so Host/Client can show their modal
  const [meetingEndedState, setMeetingEndedState] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("micOn", micOn);
  }, [micOn]);

  useEffect(() => {
    localStorage.setItem("camOn", camOn);
  }, [camOn]);

  const cleanupMeeting = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
  };

  const endMeeting = async () => {
    if (meetingEndedRef.current) return; // prevent double-fire
    meetingEndedRef.current = true;

    const roleKey = toRoleKey(role);

    if (roleKey === "host") {
      // 1. Mark room ended in DB so feedback submission works
      try {
        await api.post("/interview/end", { roomId });
      } catch (err) {
        console.error("Failed to end room in DB:", err);
      }
      // 2. Notify all participants via socket
      socket.emit("host-end-room", roomId);
      cleanupMeeting();
      // Modal will appear via "meeting-ended" socket event (looped back in sockets.js)
    } else {
      // Interviewee leaves — notify host via socket
      socket.emit("client-leave-room", roomId);
      socket.emit("leave-video-room", roomId);
      socket.emit("leave-chat-room", roomId);
      cleanupMeeting();
      // Show modal locally for the interviewee
      setMeetingEndedState(true);
    }
  };

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    blockBack();

    const handlePopState = () => {
      const ok = window.confirm("Do you want to leave the meeting?");
      if (ok) {
        endMeeting();
      } else {
        blockBack();
      }
    };

    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const micOnRef = useRef(micOn);
  const camOnRef = useRef(camOn);

  useEffect(() => { micOnRef.current = micOn; }, [micOn]);
  useEffect(() => { camOnRef.current = camOn; }, [camOn]);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const roleKey = toRoleKey(role);

      try {
        await api.post("/interview/verify", { roomId, role: roleKey });
      } catch (err) {
        navigate("/", { replace: true });
        return;
      }

      if (!active) return;

      socket.emit("join-video-room", { roomId, role: roleKey });

      const pc = createPeerConnection(
        socket,
        roomId,
        s => {
          if (remoteRef.current) remoteRef.current.srcObject = s;
          setRemoteConnected(true);
        }
      );

      // Handle connection state changes for cross-browser reliability
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setRemoteConnected(false);
        }
      };

      pcRef.current = pc;

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (err) {
        console.error("Camera/Mic access denied or device in use:", err);
        return;
      }

      if (!active) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      localStreamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;

      stream.getAudioTracks().forEach(t => (t.enabled = micOnRef.current));
      stream.getVideoTracks().forEach(t => (t.enabled = camOnRef.current));

      addLocalTracks(pc, stream);

      if (roleKey === "host" && shouldCreateOfferRef.current) {
        shouldCreateOfferRef.current = false;
        createOffer(pcRef.current, socket, roomId);
      }

      if (pendingOfferRef.current) {
        handleOffer(pcRef.current, pendingOfferRef.current, socket, roomId);
        pendingOfferRef.current = null;
      }
    };

    init();

    const onOffer = o => {
      if (toRoleKey(role) !== "client") return;

      if (!localStreamRef.current) {
        pendingOfferRef.current = o;
        return;
      }

      handleOffer(pcRef.current, o, socket, roomId);
    };

    const onAnswer = a => pcRef.current && handleAnswer(pcRef.current, a);
    const onIce = c => pcRef.current && addIce(pcRef.current, c);

    const onPeerJoined = () => {
      if (toRoleKey(role) === "host") {
        if (!localStreamRef.current) {
          shouldCreateOfferRef.current = true;
        } else {
          // Re-create offer even if pc already had one (handles reconnect case)
          createOffer(pcRef.current, socket, roomId);
        }
      }
    };

    const onMeetingEnded = () => {
      cleanupMeeting();
      setMeetingEndedState(true);
    };

    const onPeerLeft = () => {
      setRemoteConnected(false);
      if (remoteRef.current) remoteRef.current.srcObject = null;
    };

    // Handle interviewee leaving gracefully (host side)
    const onClientLeft = () => {
      setRemoteConnected(false);
      if (remoteRef.current) remoteRef.current.srcObject = null;
    };

    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice", onIce);
    socket.on("peer-joined", onPeerJoined);
    socket.on("peer-left", onPeerLeft);
    socket.on("meeting-ended", onMeetingEnded);
    socket.on("client-left", onClientLeft);

    return () => {
      active = false;

      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice", onIce);
      socket.off("peer-joined", onPeerJoined);
      socket.off("peer-left", onPeerLeft);
      socket.off("meeting-ended", onMeetingEnded);
      socket.off("client-left", onClientLeft);

      cleanupMeeting();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, role, socket, navigate]);

  const toggleMic = () => {
    const s = localStreamRef.current;
    if (!s) return;

    s.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    const enabled = s.getAudioTracks().some(t => t.enabled);
    setMicOn(enabled);
  };

  const toggleCam = () => {
    const s = localStreamRef.current;
    if (!s) return;

    s.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    const enabled = s.getVideoTracks().some(t => t.enabled);
    setCamOn(enabled);
  };

  const toggleScreen = async () => {
    if (!pcRef.current) return;

    if (!sharing) {
      await replaceVideoTrack(pcRef.current);
      setSharing(true);
    } else {
      await replaceCameraTrack(pcRef.current);
      setSharing(false);
    }
  };

  return {
    localRef, remoteRef, micOn, camOn, sharing, remoteConnected,
    meetingEndedState,
    toggleMic, toggleCam, toggleScreen, endMeeting,
  };
}
