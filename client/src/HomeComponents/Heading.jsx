import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Heading() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden text-gray-900 pt-20 pb-16">
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col items-start text-left">
          
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Next-Gen AI Interview Prep</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            Prepare Smarter <br className="hidden md:block" />
            for Your
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-2">
              Next Interview
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Practice real interview scenarios with our advanced AI. Get instant feedback on your answers, clarity, and confidence to ace the real thing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/interview"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              >
                Start Interview
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              >
                View Features
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Abstract UI Graphic */}
        <motion.div 
          className="relative hidden lg:block w-full h-[500px]"
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          style={{ perspective: 1000 }}
        >
          {/* Main Floating Card */}
          <motion.div 
            className="absolute top-10 right-0 w-[450px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-6 h-6 text-blue-600">
                   <Sparkles className="w-full h-full" />
                </div>
              </div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-3 w-20 bg-gray-100 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 w-full bg-gray-100 rounded-full"></div>
              <div className="h-3 w-5/6 bg-gray-100 rounded-full"></div>
              <div className="h-3 w-4/6 bg-gray-100 rounded-full"></div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <div className="h-10 w-24 bg-blue-50 rounded-lg border border-blue-100"></div>
              <div className="h-10 w-24 bg-green-50 rounded-lg border border-green-100"></div>
            </div>
          </motion.div>

          {/* Secondary Floating Card */}
          <motion.div 
            className="absolute -bottom-4 right-20 w-[300px] bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 p-5 z-30"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-semibold text-gray-800">Confidence Score</div>
              <div className="text-sm font-bold text-green-600">92%</div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[92%] rounded-full"></div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </motion.div>

      </div>
    </section>
  );
}
