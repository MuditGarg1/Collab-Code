import { motion } from "framer-motion";
import { BrainCircuit, MessageSquare, Briefcase, BarChart3, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Real-Time AI Feedback",
    description: "Get instant, actionable feedback on clarity, confidence, structure, and relevance of your answers immediately after you speak.",
    icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
    colSpan: "md:col-span-2 md:row-span-2",
    bg: "bg-gradient-to-br from-indigo-50 to-white",
    delay: 0.1,
  },
  {
    title: "Role-Based Prompts",
    description: "Practice questions tailored to your exact job role and level.",
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    colSpan: "md:col-span-1 md:row-span-1",
    bg: "bg-white",
    delay: 0.2,
  },
  {
    title: "Smart AI Interviewer",
    description: "Our AI adapts questions dynamically based on your previous responses.",
    icon: <BrainCircuit className="w-5 h-5 text-purple-600" />,
    colSpan: "md:col-span-1 md:row-span-1",
    bg: "bg-white",
    delay: 0.3,
  },
  {
    title: "Performance Insights",
    description: "Understand your strengths and weaknesses over time with detailed charts.",
    icon: <BarChart3 className="w-5 h-5 text-green-600" />,
    colSpan: "md:col-span-1 md:row-span-1",
    bg: "bg-white",
    delay: 0.4,
  },
  {
    title: "Fast & Reliable",
    description: "Lightning-fast voice processing and zero lag.",
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    colSpan: "md:col-span-1 md:row-span-1",
    bg: "bg-white",
    delay: 0.5,
  }
];

export default function Features() {
  return (
    <section className="relative py-24 text-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ShieldCheck className="w-4 h-4" />
            Core Features
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ace the interview.</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our platform combines advanced AI intelligence with real-world interview patterns to help you prepare smarter and faster.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-3xl border border-gray-200 shadow-sm backdrop-blur-sm group hover:shadow-lg transition-all duration-300 ${feature.colSpan} ${feature.bg} flex flex-col justify-between`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`${feature.colSpan.includes("col-span-2") ? 'text-3xl' : 'text-xl'} font-bold text-gray-900 mb-3`}>
                  {feature.title}
                </h3>
                <p className={`${feature.colSpan.includes("col-span-2") ? 'text-lg max-w-md' : 'text-sm'} text-gray-600 leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
