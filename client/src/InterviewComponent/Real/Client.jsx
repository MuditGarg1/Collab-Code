import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import socket from "../../sockets";
import VideoRoom from "./VideoRoom";
import CodeEditor from "../Code/CodeEditor";
import MeetingEndedModal from "./MeetingEndedModal";
import axios from "../../utils/axios";
import useChatRoom from "./useChatRoom";
import InterviewLayout from "./InterviewLayout";

export default function Interviewee() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [codeEditorOpen, setCodeEditorOpen] = useState(true);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [interviewerEmail, setInterviewerEmail] = useState("");

  const {
    chatOpen,
    setChatOpen,
    chatMessages,
    setChatMessages,
    unreadCount
  } = useChatRoom(socket, roomId);

  // Fetch room details to get interviewer email
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/interview/room/${roomId}`);
        if (response.data.room && response.data.room.interviewerId) {
          setInterviewerEmail(response.data.room.interviewerId.email);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const handleMeetingEnded = () => {
      setMeetingEnded(true);
    };

    socket.on("meeting-ended", handleMeetingEnded);

    return () => {
      socket.off("meeting-ended", handleMeetingEnded);
    };
  }, [roomId]);

  const handleLeaveInterview = useCallback(() => {
    // Emit all leave events (endMeeting may have already done this, but idempotent)
    socket.emit("client-leave-room", roomId);
    socket.emit("leave-video-room", roomId);
    socket.emit("leave-chat-room", roomId);
    navigate("/dashboard");
  }, [navigate, roomId]);

  // Stable callback for VideoRoom to avoid re-running effect on every render
  const handleMeetingEndedFromVideo = useCallback(() => {
    setMeetingEnded(true);
  }, []);

  if (!roomId) return <Navigate to="/" />;

  return (
    <InterviewLayout
      codeEditorOpen={codeEditorOpen}
      setCodeEditorOpen={setCodeEditorOpen}
      chatOpen={chatOpen}
      setChatOpen={setChatOpen}
      videoComponent={
        <VideoRoom
          socket={socket}
          roomId={roomId}
          role="interviewee"
          chatOpen={chatOpen}
          onOpenChat={() => setChatOpen(true)}
          unreadCount={unreadCount}
          onMeetingEnded={handleMeetingEndedFromVideo}
        />
      }
      codeEditorComponent={
        <CodeEditor socket={socket} roomId={roomId} role="interviewee" />
      }
      chatComponent={
        <ChatRoom
          socket={socket}
          roomId={roomId}
          role="interviewee"
          onClose={() => setChatOpen(false)}
          messages={chatMessages}
          setMessages={setChatMessages}
        />
      }
    >
      <MeetingEndedModal
        isOpen={meetingEnded}
        onLeave={handleLeaveInterview}
        role="interviewee"
        otherUserEmail={interviewerEmail}
      />
    </InterviewLayout>
  );
}
