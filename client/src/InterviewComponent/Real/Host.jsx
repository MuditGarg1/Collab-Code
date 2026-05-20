import { useState, useEffect, useRef } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import VideoRoom from "./VideoRoom";
import socket from "../../sockets";
import ChatRoom from "./ChatRoom";
import CodeEditor from "../Code/CodeEditor";
import FeedbackForm from "./FeedbackForm";
import MeetingEndedModal from "./MeetingEndedModal";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import useChatRoom from "./useChatRoom";
import InterviewLayout from "./InterviewLayout";

export default function Interviewer() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [codeEditorOpen, setCodeEditorOpen] = useState(true);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [intervieweeEmail, setIntervieweeEmail] = useState("");
  const intervieweeEmailRef = useRef("");

  const {
    chatOpen,
    setChatOpen,
    chatMessages,
    setChatMessages,
    unreadCount
  } = useChatRoom(socket, roomId);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/interview/room/${roomId}`);
      if (response.data.room && response.data.room.intervieweeId) {
        const email = response.data.room.intervieweeId.email;
        intervieweeEmailRef.current = email;
        setIntervieweeEmail(email);
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const handleMeetingEnded = async () => {
      await fetchRoomDetails();
      setMeetingEnded(true);
    };

    const handleIntervieweeRegistered = () => {
      fetchRoomDetails();
    };

    socket.on("meeting-ended", handleMeetingEnded);
    socket.on("interviewee-registered", handleIntervieweeRegistered);

    return () => {
      socket.off("meeting-ended", handleMeetingEnded);
      socket.off("interviewee-registered", handleIntervieweeRegistered);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleFeedbackSubmit = () => {
    toast.success("Feedback submitted! Returning to dashboard...");
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handleLeaveInterview = () => {
    socket.emit("leave-video-room", roomId);
    socket.emit("leave-chat-room", roomId);
    navigate("/dashboard");
  };

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
          role="interviewer"
          chatOpen={chatOpen}
          onOpenChat={() => setChatOpen(true)}
          unreadCount={unreadCount}
          onMeetingEnded={async () => {
            await fetchRoomDetails();
            setMeetingEnded(true);
          }}
        />
      }
      codeEditorComponent={
        <CodeEditor socket={socket} roomId={roomId} role="interviewer" />
      }
      chatComponent={
        <ChatRoom
          socket={socket}
          roomId={roomId}
          role="interviewer"
          onClose={() => setChatOpen(false)}
          messages={chatMessages}
          setMessages={setChatMessages}
        />
      }
    >
      <MeetingEndedModal
        isOpen={meetingEnded}
        onOpenFeedback={() => setShowFeedbackForm(true)}
        onLeave={handleLeaveInterview}
        role="interviewer"
        otherUserEmail={intervieweeEmail}
      />

      {showFeedbackForm && (
        <FeedbackForm
          roomId={roomId}
          intervieweeEmail={intervieweeEmail}
          onClose={() => setShowFeedbackForm(false)}
          onSubmitSuccess={handleFeedbackSubmit}
        />
      )}
    </InterviewLayout>
  );
}
