import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiVideo, FiUsers } from "react-icons/fi";
import api from "../../utils/axios";
import { toast } from "react-toastify";

export default function InterviewEntry() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // "interviewer" | "interviewee"
  const [meetingId, setMeetingId] = useState(""); // interviewee only
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Reset form when switching modes
  useEffect(() => {
    setMeetingId("");
    setPassword("");
    setError("");
  }, [mode]);

  const startInterview = async () => {
    try {
      /* ======================
         INTERVIEWER FLOW
         ====================== */
      if (mode === "interviewer") {
        if (!password) {
          setError("Please set a meeting password to continue.");
          return;
        }

        setError("");

        const { data } = await api.post("/interview/create", { password });

        // ✅ IMMEDIATE NAVIGATION (single click)
        navigate(`/real/host/${data.roomId}`);
        return;
      }

      /* ======================
         INTERVIEWEE FLOW
         ====================== */
      if (mode === "interviewee") {
        if (!meetingId || !password) {
          setError("Meeting ID and password are required.");
          return;
        }

        setError("");

        const { data } = await api.post("/interview/join", {
          roomId: meetingId,
          password,
        });

        navigate(`/real/client/${meetingId}`);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || "Server error. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-transparent text-gray-900 px-6 py-12 flex items-center justify-center relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center z-10">

        {/* LEFT CONTENT */}
        <div className="animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            Real-Time Collaboration
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-gray-900">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Interviews</span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-md">
            Secure, high-fidelity interview environments crafted for seamless communication and accurate technical evaluations.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                <FiVideo className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">High-Fidelity Sessions</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Crystal-clear video and real-time code synchronization for an unmatched interview experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                <FiLock className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Enterprise-Grade Security</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  End-to-end encryption and password-protected rooms keep your interviews completely private.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                <FiUsers className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Role-Based Workflows</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Intuitive controls for interviewers and frictionless joining for candidates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="animate-slideUp relative">
          {/* Glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>

          <div className="relative rounded-3xl bg-white/80 border border-white/60 p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Join Session</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Select your role to configure the environment
            </p>

            {/* MODE SELECT */}
            <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8 border border-gray-200/50 shadow-inner">
              <button
                onClick={() => setMode("interviewer")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${mode === "interviewer"
                    ? "bg-white text-indigo-700 shadow border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
              >
                Host
              </button>
              <button
                onClick={() => setMode("interviewee")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${mode === "interviewee"
                    ? "bg-white text-indigo-700 shadow border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
              >
                Candidate
              </button>
            </div>

            {mode && (
              <div className="space-y-5 animate-fadeIn">
                {/* INTERVIEWEE MEETING ID */}
                {mode === "interviewee" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Meeting ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 123-456-789"
                      value={meetingId}
                      onChange={(e) => {
                        setMeetingId(e.target.value);
                        setError("");
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
                    />
                  </div>
                )}

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Meeting Password</label>
                  <input
                    type="password"
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
                  />
                </div>

                {/* ERROR */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 animate-fadeIn">
                    {error}
                  </div>
                )}

                {/* ACTION BUTTON */}
                <button
                  onClick={startInterview}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600
                  hover:from-indigo-700 hover:to-blue-700 text-white transition-all font-semibold tracking-wide shadow-lg shadow-indigo-600/20"
                >
                  {mode === "interviewer" ? "Launch Interview" : "Join Interview"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          .animate-slideUp {
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
