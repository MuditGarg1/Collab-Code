import { useNavigate } from "react-router-dom";
import { Bot, User, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Interview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] text-gray-900 flex flex-col items-center justify-center px-6 py-12 overflow-x-hidden bg-transparent">

      {/* Decorative Blur */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl w-full text-center relative z-10">

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Preparation Hub
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Choose how you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">prepare</span>
        </motion.h1>

        <motion.p
          className="text-gray-600 text-lg md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Whether you want a quick self-paced mock interview or a fully immersive AI-driven experience, pick the mode that fits your style.
        </motion.p>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto text-left">

          {/* Real Interview Mode */}
          <motion.div
            className="group relative p-6 md:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, borderColor: '#d1d5db' }}
            onClick={() => navigate("/interview-entry")}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Self-Guided Practice
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-base">
                Practice hand-picked interview questions inspired by real technical rounds at your own pace.
              </p>

              <div className="space-y-3 mb-8">
                {["Role-based technical questions", "Behavioral & cultural fit focus", "Self-paced without time pressure"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-800 font-bold text-base group-hover:bg-gray-200 transition-colors">
              Start Practice
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* AI Interview Mode */}
          <motion.div
            className="group relative p-6 md:p-8 rounded-3xl bg-white border-2 border-blue-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
            onClick={() => navigate("/ai-interview")}
          >
            {/* Recommended Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md z-10">
              Most Popular
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                AI-Powered Interview
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-base">
                Experience a dynamic interview where our advanced AI adapts questions and evaluates you in real-time.
              </p>

              <div className="space-y-3 mb-8">
                {["Adaptive AI questioning", "Voice & text response capabilities", "Instant, detailed performance feedback"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-base group-hover:bg-blue-700 transition-colors">
              Start AI Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
