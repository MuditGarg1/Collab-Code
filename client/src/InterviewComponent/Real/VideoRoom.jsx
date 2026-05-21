import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhoneSlash, FaCopy } from "react-icons/fa";
import { MessageSquarePlus } from "lucide-react";
import useVideoRoom from "./useVideoRoom";
import { useState, useEffect } from "react";

export default function VideoRoom({ socket, roomId, role, chatOpen, onOpenChat, unreadCount = 0, onMeetingEnded }) {
  const {
    localRef,
    remoteRef,
    micOn,
    camOn,
    sharing,
    remoteConnected,
    meetingEndedState,
    toggleMic,
    toggleCam,
    toggleScreen,
    endMeeting,
  } = useVideoRoom(socket, roomId, role);

  const [copiedId, setCopiedId] = useState(false);

  // Sync hook's meetingEndedState up to the parent (Host or Client component)
  useEffect(() => {
    if (meetingEndedState && onMeetingEnded) {
      onMeetingEnded();
    }
  }, [meetingEndedState, onMeetingEnded]);

  const copyRoomId = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(roomId);
      } else {
        // Fallback for HTTP / local testing on mobile
        const textArea = document.createElement("textarea");
        textArea.value = roomId;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Copy failed! Please manually copy this ID: " + roomId);
    }
  };

  const roleLabel =
    role === "interviewer"
      ? "Interviewer"
      : role === "interviewee"
        ? "Interviewee"
        : "Participant";

  const peerLabel = roleLabel === "Interviewer" ? "Interviewee" : "Interviewer";

  return (
    <section className="flex flex-col h-full min-h-0 p-3 md:p-4 lg:p-6 gap-4 md:gap-6 flex-1 bg-transparent">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl px-4 md:px-6 py-3 md:py-4 border border-gray-200/60 bg-white/80 backdrop-blur-md shadow-sm gap-3 md:gap-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Meeting ID</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-gray-800">
                {roomId.slice(0, 10)}...
              </span>
              <button
                onClick={copyRoomId}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                  copiedId
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-gray-50 border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm"
                }`}
                title="Copy meeting ID"
              >
                <FaCopy size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live / Waiting indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs tracking-wide uppercase shadow-sm ${
            remoteConnected
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-indigo-50 border-indigo-200 text-indigo-600"
          }`}>
            <span className={`w-2 h-2 rounded-full ${remoteConnected ? "bg-emerald-500 animate-pulse" : "bg-indigo-500"}`} />
            {remoteConnected ? "Live" : "Waiting"}
          </div>

          {!chatOpen && onOpenChat && (
            <button
              onClick={onOpenChat}
              className="relative flex items-center gap-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 text-xs uppercase tracking-widest font-bold text-indigo-600 transition-colors shadow-sm"
            >
              <MessageSquarePlus size={16} /> Open Chat
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md border-2 border-red-600 animate-bounce">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          )}

          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Your Role</span>
            <span className="text-sm font-bold text-indigo-600">{roleLabel}</span>
          </div>
        </div>
      </header>

      {/* Video Section */}
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 h-full min-h-0 min-h-[500px] md:min-h-0">
          
          {/* Local Video */}
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-200/60 bg-gray-100/50 shadow-sm group">
            <video ref={localRef} autoPlay muted className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4 text-xs tracking-widest bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-bold shadow-sm">
              You
            </div>
            {!camOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shadow-inner">
                  <FaVideoSlash size={24} />
                </div>
                <span className="text-sm text-gray-500 font-semibold tracking-wide">Camera off</span>
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-200/60 bg-gray-100/50 shadow-sm group">
            <video ref={remoteRef} autoPlay className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4 text-xs tracking-widest bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-bold shadow-sm">
              {peerLabel}
            </div>
            
            {/* Waiting for peer overlay */}
            {!remoteConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-400 shadow-inner z-10 relative">
                    <span className="text-3xl">👤</span>
                  </div>
                  {/* Ping animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-300 animate-ping opacity-20"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">Waiting for {peerLabel}</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">They'll appear here when they join</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Footer */}
        <footer className="flex justify-center gap-4 pb-2 items-center">
          
          <button
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all flex items-center justify-center shadow-md border ${
              micOn
                ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-indigo-600"
                : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
            }`}
            onClick={toggleMic}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <FaMicrophone size={16} /> : <FaMicrophoneSlash size={16} />}
          </button>

          <button
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all flex items-center justify-center shadow-md border ${
              camOn
                ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-indigo-600"
                : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
            }`}
            onClick={toggleCam}
            title={camOn ? "Turn off camera" : "Turn on camera"}
          >
            {camOn ? <FaVideo size={16} /> : <FaVideoSlash size={16} />}
          </button>

          <button
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all flex items-center justify-center shadow-md border ${
              sharing
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-indigo-600"
            }`}
            onClick={toggleScreen}
            title={sharing ? "Stop sharing" : "Share screen"}
          >
            <FaDesktop size={16} />
          </button>

          {/* End Call Button */}
          <button
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all flex items-center justify-center hover:scale-105 active:scale-95 ml-2 border border-red-600/50"
            onClick={endMeeting}
            title="End meeting"
          >
            <FaPhoneSlash size={18} />
          </button>

        </footer>
      </div>
    </section>
  );
}
