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
    await navigator.clipboard.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const roleLabel =
    role === "interviewer"
      ? "Interviewer"
      : role === "interviewee"
        ? "Interviewee"
        : "Participant";

  const peerLabel = roleLabel === "Interviewer" ? "Interviewee" : "Interviewer";

  return (
    <section className="flex flex-col h-full min-h-0 p-4 lg:p-6 gap-6 flex-1 bg-gray-900">
      
      {/* Header */}
      <header className="flex items-center justify-between rounded-2xl px-6 py-4 border border-gray-800 bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Meeting ID</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-gray-200">
                {roomId.slice(0, 10)}...
              </span>
              <button
                onClick={copyRoomId}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                  copiedId
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/30 shadow-sm"
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
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/20 border-amber-500/30 text-amber-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${remoteConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            {remoteConnected ? "Live" : "Waiting"}
          </div>

          {!chatOpen && onOpenChat && (
            <button
              onClick={onOpenChat}
              className="relative flex items-center gap-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 px-4 py-2 text-xs uppercase tracking-widest font-bold text-indigo-400 transition-colors shadow-sm"
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
            <span className="text-sm font-bold text-indigo-400">{roleLabel}</span>
          </div>
        </div>
      </header>

      {/* Video Section */}
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        
        {/* Video Grid */}
        <div className="grid grid-cols-2 gap-6 h-full min-h-0">
          
          {/* Local Video */}
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-800 bg-[#1e1e1e] shadow-md group">
            <video ref={localRef} autoPlay muted className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4 text-xs tracking-widest bg-gray-900/90 backdrop-blur-md border border-gray-700/50 text-gray-300 px-3 py-1.5 rounded-full font-bold shadow-sm">
              You
            </div>
            {!camOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 shadow-inner">
                  <FaVideoSlash size={24} />
                </div>
                <span className="text-sm text-gray-400 font-semibold tracking-wide">Camera off</span>
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-800 bg-[#1e1e1e] shadow-md group">
            <video ref={remoteRef} autoPlay className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4 text-xs tracking-widest bg-gray-900/90 backdrop-blur-md border border-gray-700/50 text-gray-300 px-3 py-1.5 rounded-full font-bold shadow-sm">
              {peerLabel}
            </div>
            
            {/* Waiting for peer overlay */}
            {!remoteConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e] gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner z-10 relative">
                    <span className="text-3xl">👤</span>
                  </div>
                  {/* Ping animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping opacity-20"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-200">Waiting for {peerLabel}</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">They'll appear here when they join</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Footer */}
        <footer className="flex justify-center gap-6 pb-2">
          
          <button
            className={`w-14 h-14 rounded-full transition-all flex items-center justify-center shadow-lg border border-gray-700 ${
              micOn
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600"
                : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            }`}
            onClick={toggleMic}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
          </button>

          <button
            className={`w-14 h-14 rounded-full transition-all flex items-center justify-center shadow-lg border border-gray-700 ${
              camOn
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600"
                : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            }`}
            onClick={toggleCam}
            title={camOn ? "Turn off camera" : "Turn on camera"}
          >
            {camOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
          </button>

          <button
            className={`w-14 h-14 rounded-full transition-all flex items-center justify-center shadow-lg border border-gray-700 ${
              sharing
                ? "bg-indigo-500/30 border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/40"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600"
            }`}
            onClick={toggleScreen}
            title={sharing ? "Stop sharing" : "Share screen"}
          >
            <FaDesktop size={20} />
          </button>

          {/* End Call Button */}
          <button
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 transition-all flex items-center justify-center hover:scale-105 active:scale-95 ml-4"
            onClick={endMeeting}
            title="End meeting"
          >
            <FaPhoneSlash size={24} />
          </button>

        </footer>
      </div>
    </section>
  );
}
