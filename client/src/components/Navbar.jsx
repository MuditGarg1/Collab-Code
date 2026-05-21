import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authServices";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { LayoutDashboard, CreditCard, Settings, LogOut, Code, Video, Home, Info } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setUserData(null));
      setMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const credits = userData?.credits ?? 0;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-50 px-4 py-4 pointer-events-none"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-lg rounded-full pointer-events-auto">
        <div className="px-6 py-3 flex justify-between items-center">
          
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer select-none"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              Interview<span className="text-blue-600">APP</span>
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-1 items-center">
            <Link to="/" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/features" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Features
            </Link>
            <Link to="/interview" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <Video className="w-4 h-4" /> Interview
            </Link>
            <Link to="/about" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              <Info className="w-4 h-4" /> About
            </Link>
            {userData && (
              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-2 text-sm font-semibold text-gray-600">
                 <CreditCard className="w-4 h-4 text-emerald-500" />
                 {credits} Credits
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {!userData ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-full font-semibold shadow-md transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button */}
                <motion.button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 p-1 pr-4 rounded-full transition shadow-sm border border-gray-200/50"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-sm">
                    {userData.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold">
                    {userData.name}
                  </span>
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-gray-200/60 rounded-2xl shadow-xl overflow-hidden text-gray-800 z-50 backdrop-blur-xl"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-semibold truncate text-gray-900">{userData.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                      </div>

                      <div className="p-2 flex flex-col gap-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition"
                          onClick={() => setMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        
                        <Link
                          to="/pricing"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition"
                          onClick={() => setMenuOpen(false)}
                        >
                          <CreditCard className="w-4 h-4" /> Pricing & Credits
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        
                        <div className="h-px w-full bg-gray-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-red-600 hover:bg-red-50 font-medium transition"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
