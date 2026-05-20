import { useState, useEffect, useRef } from "react";

export default function useChatRoom(socket, roomId) {
  const [chatOpen, setChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const chatOpenRef = useRef(chatOpen);

  // Clear unread count when chat opens
  useEffect(() => {
    chatOpenRef.current = chatOpen;
    if (chatOpen) {
      setUnreadCount(0);
    }
  }, [chatOpen]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-chat-room", roomId);

    const handleChat = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      
      // Increment unread count if chat is not open
      if (!chatOpenRef.current) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("chat", handleChat);

    return () => {
      socket.off("chat", handleChat);
    };
  }, [roomId, socket]);

  return {
    chatOpen,
    setChatOpen,
    chatMessages,
    setChatMessages,
    unreadCount
  };
}
