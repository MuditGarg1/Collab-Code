import { motion } from "framer-motion";
import { Star, MessageCircleHeart } from "lucide-react";

const feedbacks = [
  {
    name: "Aman Sharma",
    role: "Final Year Student",
    feedback: "The AI interview felt surprisingly real. The feedback helped me understand exactly where I was going wrong.",
  },
  {
    name: "Priya Verma",
    role: "Frontend Developer",
    feedback: "Practicing before interviews boosted my confidence a lot. The role-based questions were very accurate.",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    feedback: "It felt like a personal interview coach. The AI feedback was clear and actionable.",
  },
  {
    name: "Sneha Patel",
    role: "Job Seeker",
    feedback: "The mock interviews reduced my anxiety before real interviews. Highly recommended.",
  },
  {
    name: "Vikram Singh",
    role: "Backend Developer",
    feedback: "Incredible platform! The performance insights showed me exactly how to structure my system design answers.",
  },
  {
    name: "Neha Gupta",
    role: "Product Manager",
    feedback: "I love how the AI adapts to my answers. It really tests your depth of knowledge just like a real PM interview.",
  }
];

// Duplicate feedbacks for seamless infinite scroll
const extendedFeedbacks = [...feedbacks, ...feedbacks];

export default function Feedbacks() {
  return (
    <section className="relative py-24 text-gray-900 overflow-hidden bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 mb-16">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-bold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MessageCircleHeart className="w-4 h-4" />
            Testimonials
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Loved by Learners & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Professionals</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            See how our AI-powered interview practice helps thousands of users gain confidence and land their dream jobs.
          </motion.p>
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="w-full flex overflow-hidden group">
        <div className="flex gap-6 w-max animate-marquee">
          {extendedFeedbacks.map((item, index) => (
            <div
              key={index}
              className="w-[350px] p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-shrink-0"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Feedback Text */}
              <p className="text-gray-700 text-base leading-relaxed mb-8 italic">
                "{item.feedback}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-lg border border-indigo-200/50 shadow-inner">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient Fades for Marquee edges */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none"></div>

    </section>
  );
}
