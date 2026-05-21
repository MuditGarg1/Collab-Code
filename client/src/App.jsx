import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { setUserData } from "./redux/userSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./components/AboutUs";
import Interview from "./pages/Interview";
import InterviewPage from "./pages/InterviewPage";
import Pricing from "./pages/Pricing";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewReport from "./pages/InterviewReport";
import InterviewEntry from "./InterviewComponent/Real/InterviewEntry";
import Host from "./InterviewComponent/Real/Host";
import Client from "./InterviewComponent/Real/Client";
import PAuth from "./pages/PAuth";
import Features from "./pages/Features";
import { getMe } from "./services/authServices";

export const ServerUrl = "http://localhost:4000";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const userData = useSelector((state) => state.user.userData);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if we are inside a real-time interview room
  const isInterviewRoom = location.pathname.startsWith("/real/host") || location.pathname.startsWith("/real/client");

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getMe();

        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      } finally {
        setAuthChecked(true);
      }
    };

    getUser();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-gray-900">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col text-gray-900 bg-transparent overflow-x-hidden ${isInterviewRoom ? "h-screen overflow-hidden" : "min-h-screen"}`}>

      {!isInterviewRoom && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-24 left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-24 w-65 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
      )}

      {!isInterviewRoom && <Navbar />}
      
      <main className={`relative z-20 flex-1 ${!isInterviewRoom ? "pt-20" : "h-full flex flex-col"}`}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth/*" element={<Navigate to="/login" replace />} />

          <Route
            path="/login/*"
            element={
              userData ? <Navigate to="/" /> : <PAuth />
            }
          />

          <Route
            path="/dashboard"
            element={
              userData ? <Dashboard /> : <Navigate to="/login" />
            }
          />

          <Route path="/interview" element={<Interview />} />
          <Route path="/features" element={<Features />} />
          <Route path="/settings" element={<Navigate to={userData ? "/dashboard" : "/login"} replace />} />
          <Route
            path="/ai-interview"
            element={
              userData ? (
                <InterviewPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/pricing" element={<Pricing />} />

          <Route
            path="/history"
            element={
              userData ? (
                <InterviewHistory />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/report/:id"
            element={
              userData ? (
                <InterviewReport />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/real/host/:roomId" element={<Host />} />
          <Route path="/real/client/:roomId" element={<Client />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/about-us" element={<AboutUs />} />

          <Route path="/interview-entry" element={<InterviewEntry />} />
        </Routes>
      </main>

      {!isInterviewRoom && <Footer />}
    </div>
  );
}

export default App;