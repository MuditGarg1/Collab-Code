import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { Star, ChevronLeft } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("given"); // "given", "received", "ai"
  const [feedbackGiven, setFeedbackGiven] = useState([]);
  const [feedbackReceived, setFeedbackReceived] = useState([]);
  const [aiInterviews, setAiInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedAIInterview, setSelectedAIInterview] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const [givenRes, receivedRes, aiRes] = await Promise.all([
        axios.get("/interview/feedback/given"),
        axios.get("/interview/feedback/received"),
        axios.get("/ai-interview/history"),
      ]);

      setFeedbackGiven(givenRes.data.feedbacks || []);
      setFeedbackReceived(receivedRes.data.feedbacks || []);
      setAiInterviews(Array.isArray(aiRes?.data) ? aiRes.data : aiRes?.data?.interviews || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (score) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400 font-bold">{score.toFixed(1)}</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.round(score)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              }
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Interview Feedback</h1>
          <p className="text-gray-600">Manage your interview experiences and feedback</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button
            onClick={() => {
              setActiveTab("given");
              setSelectedFeedback(null);
              setSelectedAIInterview(null);
            }}
            className={`pb-4 font-semibold text-lg transition-all ${
              activeTab === "given"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            Interviews Conducted ({feedbackGiven.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("received");
              setSelectedFeedback(null);
              setSelectedAIInterview(null);
            }}
            className={`pb-4 font-semibold text-lg transition-all ${
              activeTab === "received"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            Interviews Attended ({feedbackReceived.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("ai");
              setSelectedFeedback(null);
              setSelectedAIInterview(null);
            }}
            className={`pb-4 font-semibold text-lg transition-all ${
              activeTab === "ai"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            AI Interviews ({aiInterviews.length})
          </button>
        </div>

        {/* Feedback List */}
        {selectedFeedback ? (
          <FeedbackDetailView
            feedback={selectedFeedback}
            onBack={() => setSelectedFeedback(null)}
            isGiven={activeTab === "given"}
          />
        ) : selectedAIInterview ? (
          <AIInterviewDetailView
            interview={selectedAIInterview}
            onBack={() => setSelectedAIInterview(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "given" &&
              (feedbackGiven.length > 0 ? (
                feedbackGiven.map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                    renderStarRating={renderStarRating}
                    isGiven={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-600 text-lg">No interviews conducted yet</p>
                </div>
              ))}

            {activeTab === "received" &&
              (feedbackReceived.length > 0 ? (
                feedbackReceived.map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    feedback={feedback}
                    onClick={() => setSelectedFeedback(feedback)}
                    renderStarRating={renderStarRating}
                    isGiven={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-600 text-lg">No interviews attended yet</p>
                </div>
              ))}

            {activeTab === "ai" &&
              (aiInterviews.length > 0 ? (
                aiInterviews.map((interview) => (
                  <AIInterviewCard
                    key={interview._id}
                    interview={interview}
                    onClick={() => setSelectedAIInterview(interview)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-600 text-lg">No AI interviews completed yet</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackCard({
  feedback,
  onClick,
  renderStarRating,
  isGiven,
}) {
  const person = isGiven ? feedback.intervieweeId : feedback.interviewerId;
  const date = new Date(feedback.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const getHiringDecisionColor = (decision) => {
    const colors = {
      strong_hire: "bg-green-600/20 border-green-500/50 text-green-300",
      hire: "bg-blue-600/20 border-blue-500/50 text-blue-300",
      hold: "bg-yellow-600/20 border-yellow-500/50 text-yellow-300",
      no_hire: "bg-red-600/20 border-red-500/50 text-red-300",
    };
    return colors[decision] || "bg-gray-600/20 border-gray-500/50 text-gray-700";
  };

  const getHiringDecisionLabel = (decision) => {
    const labels = {
      strong_hire: "🚀 Strong Hire",
      hire: "✅ Hire",
      hold: "⏳ On Hold",
      no_hire: "❌ No Hire",
    };
    return labels[decision] || "Unknown";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white/80 border border-gray-200 shadow-sm rounded-lg p-6 cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-600 transition">{person?.name}</h3>
        <p className="text-sm text-gray-600">{person?.email}</p>
        <p className="text-xs text-gray-500 mt-2">Feedback on {date}</p>
      </div>

      {/* Scores */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Technical</span>
          {renderStarRating(feedback.technicalScore)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Communication</span>
          {renderStarRating(feedback.communicationScore)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confidence</span>
          {renderStarRating(feedback.confidenceScore)}
        </div>
      </div>

      {/* Overall & Decision */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Overall</p>
            <p className="text-2xl font-bold text-indigo-600">{feedback.overallScore.toFixed(1)}/10</p>
          </div>
          <div className={`px-3 py-2 rounded-lg border text-xs font-semibold ${getHiringDecisionColor(feedback.hiringDecision)}`}>
            {getHiringDecisionLabel(feedback.hiringDecision)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInterviewCard({ interview, onClick }) {
  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className="bg-white/80 border border-gray-200 shadow-sm rounded-lg p-6 cursor-pointer hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group"
    >
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-1 capitalize group-hover:text-indigo-600 transition">
          {interview.role} AI Interview
        </h3>
        <p className="text-xs text-gray-500 mt-2">Completed on {date}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Technical</span>
          <span className="text-yellow-400 font-bold">{Number(interview.technicalScore).toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Communication</span>
          <span className="text-yellow-400 font-bold">{Number(interview.communicationScore).toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confidence</span>
          <span className="text-yellow-400 font-bold">{Number(interview.confidenceScore).toFixed(1)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-600 mb-1">Overall</p>
        <p className="text-2xl font-bold text-indigo-600">{Number(interview.overallScore).toFixed(1)}/10</p>
      </div>
    </div>
  );
}

function AIInterviewDetailView({ interview, onBack }) {
  const date = new Date(interview.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition text-sm font-semibold"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <div className="bg-white/80 border border-gray-200 shadow-sm rounded-lg p-8">
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold mb-2 capitalize">{interview.role} AI Interview</h2>
          <p className="text-sm text-gray-500">Completed on {date}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <ScoreItem label="Technical" score={interview.technicalScore} />
          <ScoreItem label="Communication" score={interview.communicationScore} />
          <ScoreItem label="Confidence" score={interview.confidenceScore} />
        </div>

        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-6 mb-8">
          <p className="text-gray-600 text-sm mb-2">Overall Score</p>
          <p className="text-4xl font-bold text-indigo-600 mb-1">
            {Number(interview.overallScore).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">/10</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Strengths</h3>
          <div className="space-y-2">
            {(interview.strengths || []).map((strength, idx) => (
              <div key={idx} className="flex items-start gap-3 text-gray-700">
                <span className="text-green-400 font-bold mt-0.5">+</span>
                <p>{strength}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-red-400">Weaknesses</h3>
          <div className="space-y-2">
            {(interview.weaknesses || []).map((weakness, idx) => (
              <div key={idx} className="flex items-start gap-3 text-gray-700">
                <span className="text-red-400 font-bold mt-0.5">!</span>
                <p>{weakness}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">AI Feedback</h3>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{interview.aiFeedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreItem({ label, score }) {
  const value = Number(score || 0);
  const color = value >= 8 ? "text-green-400" : value >= 6 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value.toFixed(1)}</p>
      <p className="text-xs text-gray-500 mt-1">/10</p>
    </div>
  );
}

function FeedbackDetailView({ feedback, onBack, isGiven }) {
  const person = isGiven ? feedback.intervieweeId : feedback.interviewerId;
  const date = new Date(feedback.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getHiringDecisionBg = (decision) => {
    const colors = {
      strong_hire: "bg-green-600/20 border-green-500/50 text-green-300",
      hire: "bg-blue-600/20 border-blue-500/50 text-blue-300",
      hold: "bg-yellow-600/20 border-yellow-500/50 text-yellow-300",
      no_hire: "bg-red-600/20 border-red-500/50 text-red-300",
    };
    return colors[decision] || "bg-gray-600/20 border-gray-500/50 text-gray-700";
  };

  const getHiringDecisionLabel = (decision) => {
    const labels = {
      strong_hire: "🚀 Strong Hire",
      hire: "✅ Hire",
      hold: "⏳ On Hold",
      no_hire: "❌ No Hire",
    };
    return labels[decision] || "Unknown";
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition text-sm font-semibold"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <div className="bg-white/80 border border-gray-200 shadow-sm rounded-lg p-8">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold mb-2">{person?.name}</h2>
          <p className="text-gray-600 mb-1">{person?.email}</p>
          <p className="text-sm text-gray-500">Feedback received on {date}</p>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Technical Skill</p>
            <p className={`text-3xl font-bold ${getScoreColor(feedback.technicalScore)}`}>
              {feedback.technicalScore}.0
            </p>
            <p className="text-xs text-gray-500 mt-1">/10</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Communication</p>
            <p className={`text-3xl font-bold ${getScoreColor(feedback.communicationScore)}`}>
              {feedback.communicationScore}.0
            </p>
            <p className="text-xs text-gray-500 mt-1">/10</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Confidence</p>
            <p className={`text-3xl font-bold ${getScoreColor(feedback.confidenceScore)}`}>
              {feedback.confidenceScore}.0
            </p>
            <p className="text-xs text-gray-500 mt-1">/10</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-6 mb-8">
          <p className="text-gray-600 text-sm mb-2">Overall Score</p>
          <p className="text-4xl font-bold text-indigo-600 mb-1">{feedback.overallScore.toFixed(1)}</p>
          <p className="text-sm text-gray-600">/10</p>
        </div>

        {/* Hiring Decision */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Hiring Decision</h3>
          <div className={`inline-block px-6 py-3 rounded-lg border-2 font-semibold text-lg ${getHiringDecisionBg(feedback.hiringDecision)}`}>
            {getHiringDecisionLabel(feedback.hiringDecision)}
          </div>
        </div>

        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-400">💪 Strengths</h3>
            <div className="space-y-2">
              {feedback.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-400 font-bold mt-0.5">✓</span>
                  <p>{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {feedback.weaknesses && feedback.weaknesses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Areas for Improvement</h3>
            <div className="space-y-2">
              {feedback.weaknesses.map((weakness, idx) => (
                <div key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="text-red-400 font-bold mt-0.5">!</span>
                  <p>{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📝 Detailed Feedback</h3>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{feedback.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
