import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { verifyRegisterOtp } from "../services/authServices";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const OtpVerify = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.type) {
    return (
      <p className="text-red-500 text-center mt-20">
        Invalid session
      </p>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (state.type === "register") {
        const { data } = await verifyRegisterOtp(otp);
        dispatch(setUserData(data.user));
        navigate("/dashboard");
      } else {
        navigate("/login/reset-password", {
          state: { email: state.email, otp }
        });
      }
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#050b18] to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-transparent/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              setError("");
              setOtp(e.target.value);
            }}
            required
            className="w-full rounded-lg bg-transparent border border-white/15 px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-center tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-medium transition
              ${
                loading
                  ? "bg-white/10 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-gray-900"
              }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center mt-2">
              {error}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default OtpVerify;
