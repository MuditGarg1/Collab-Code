import { useEffect, useMemo, useRef, useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { MessageSquareText } from "lucide-react";

export default function ChatRoom({
  socket,
  roomId,
  role,
  onClose,
  messages,
  setMessages,
}) {
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(true);
  const typingTimeoutRef = useRef(null);

  const displayRole = useMemo(() => {
    if (role === "interviewer") return "Interviewer";
    if (role === "interviewee") return "Interviewee";
    return "Guest";
  }, [role]);

  useEffect(() => {
    socket.emit("join-chat-room", roomId);

    const handleMeetingEnded = () => {
      alert("Meeting ended");
    };

    socket.on("meeting-ended", handleMeetingEnded);

    return () => {
      socket.off("meeting-ended", handleMeetingEnded);
    };
  }, [roomId, socket]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !autoScrollRef.current) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    autoScrollRef.current = nearBottom;
  };

  const send = () => {
    if (!msg.trim()) return;

    const payload = {
      roomId,
      msg,
      sender: displayRole,
      ts: new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      }),
    };

    socket.emit("chat", payload);
    setMessages(p => [...p, payload]);
    setMsg("");
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
    }
    
    // Clear timeout and reset typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <aside className="h-full w-full flex flex-col bg-transparent">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <MessageSquareText size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 tracking-wide">
              Live Chat
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              Team Room
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"
            title="Close chat"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-600">
            <MessageSquareText size={48} className="opacity-20" />
            <p className="text-sm font-medium text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const self = m.sender === displayRole;

            return (
              <div
                key={i}
                className={`flex ${self ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-[15px] shadow-sm ${
                    self
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-200"
                  }`}
                >
                  {!self && (
                    <div className="text-[11px] font-bold text-gray-500 mb-1 tracking-wide">
                      {m.sender}
                    </div>
                  )}
                  <div className="wrap-break-word leading-relaxed">
                    {m.msg}
                  </div>
                  <div className={`text-[10px] font-medium mt-2 text-right ${
                    self ? "text-indigo-200" : "text-gray-500"
                  }`}>
                    {m.ts}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-2 py-2 border border-gray-200 shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <input
            value={msg}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-[15px] px-3 outline-none placeholder:text-gray-400 text-gray-800 font-medium"
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
          />

          <button
            onClick={send}
            disabled={!msg.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white shadow-md shadow-indigo-500/30"
            title="Send message"
          >
            <FaPaperPlane size={14} className="ml-[-2px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
