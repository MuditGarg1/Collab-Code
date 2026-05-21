import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Cpu, CheckCircle2, ArrowRight } from "lucide-react";

export default function StartInterview() {
  return (
    <section className="relative py-24 text-gray-900 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Section Label */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Practice Modes
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Choose how you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">prepare</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="max-w-2xl mx-auto text-lg text-gray-600 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Whether you want a quick self-paced mock interview or a fully immersive AI-driven experience, pick the mode that fits your style.
        </motion.p>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">

          {/* Real Interview Mode */}
          <motion.div
            className="group relative p-6 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, borderColor: '#d1d5db' }}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Self-Guided Practice
              </h3>
              <p className="text-gray-600 mb-6">
                Practice hand-picked interview questions inspired by real technical rounds at your own pace.
              </p>

              <div className="space-y-4 mb-8">
                {["Role-based technical questions", "Behavioral & cultural fit focus", "Self-paced without time pressure"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/interview"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-colors"
            >
              Start Practice
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* AI Interview Mode */}
          <motion.div
            className="group relative p-6 rounded-3xl bg-white border-2 border-blue-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
              Most Popular
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                AI-Powered Interview
              </h3>
              <p className="text-gray-600 mb-6">
                Experience a dynamic interview where our advanced AI adapts questions and evaluates you in real-time.
              </p>

              <div className="space-y-4 mb-8">
                {["Adaptive AI questioning", "Voice & text response capabilities", "Instant, detailed performance feedback"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/ai-interview"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Start AI Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
        
      </div>
    </section>
  );
}
