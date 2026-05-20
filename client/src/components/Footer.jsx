import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50/50 border-t border-gray-200/60 text-gray-600 relative overflow-hidden">
      
      {/* Decorative gradient blur at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8 lg:gap-12 gap-y-16">

          {/* Brand & Description */}
          <motion.div
            className="md:col-span-1 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                I
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Interview<span className="text-blue-600">APP</span>
              </span>
            </div>
            
            <p className="text-sm leading-relaxed text-gray-500 mb-8 max-w-sm">
              The next-generation platform for interview preparation. Practice with real peers or our advanced AI to gain confidence and land your dream job.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:shadow-sm transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-400 hover:shadow-sm transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-bold text-gray-900 mb-6 tracking-wide uppercase">
              Product
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/interview" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Self-Guided Practice
                </Link>
              </li>
              <li>
                <Link to="/ai-interview" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                  AI Interview
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Core Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Pricing & Credits
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-bold text-gray-900 mb-6 tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-bold text-gray-900 mb-6 tracking-wide uppercase">
              Get in Touch
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Have questions or need support? We're here to help.
            </p>
            
            <a href="mailto:support@interviewapp.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Mail className="w-4 h-4" />
              Email Support
            </a>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-200/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
          <p>
            © {new Date().getFullYear()} Interview APP. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wide">SECURE PLATFORM</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
