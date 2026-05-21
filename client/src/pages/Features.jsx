import { motion } from "framer-motion";
import { Bot, Code2, MessageSquareText, ShieldCheck, Zap, Laptop } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Bot size={24} />,
      title: "AI-Powered Interviews",
      desc: "Experience dynamic mock interviews driven by advanced AI. Get real-time adaptive questioning based on your resume and role.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <Laptop size={24} />,
      title: "Real-Time Collaborative Room",
      desc: "Jump into peer-to-peer interview rooms with high-quality video, low-latency code syncing, and a modern IDE layout.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: <Code2 size={24} />,
      title: "Interactive Code Editor",
      desc: "Write and execute code in 10+ languages with our integrated Monaco editor, complete with syntax highlighting and auto-save.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: <MessageSquareText size={24} />,
      title: "Detailed Feedback Reports",
      desc: "Receive comprehensive AI-generated reports outlining your strengths, weaknesses, and actionable tips for improvement.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Performance Analytics",
      desc: "Track your progress over time with a unified dashboard that visualizes your interview history and performance metrics.",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure & Private",
      desc: "Your data, resumes, and interview recordings are securely stored and strictly private. You control your interview history.",
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-gray-900 relative">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Powerful features to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ace your interview</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to practice, collaborate, and improve your technical interviewing skills in one unified platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 rounded-2xl bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`} >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
