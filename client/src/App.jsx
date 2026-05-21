import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { setUserData } from "./redux/userSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const Interview = lazy(() => import("./pages/Interview"));
const InterviewPage = lazy(() => import("./pages/InterviewPage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const InterviewReport = lazy(() => import("./pages/InterviewReport"));
const InterviewEntry = lazy(() => import("./InterviewComponent/Real/InterviewEntry"));
const Host = lazy(() => import("./InterviewComponent/Real/Host"));
const Client = lazy(() => import("./InterviewComponent/Real/Client"));
const PAuth = lazy(() => import("./pages/PAuth"));
const Features = lazy(() => import("./pages/Features"));
import { getMe } from "./services/authServices";


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
        <Suspense fallback={
          <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }>
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
        </Suspense>
      </main>

      {!isInterviewRoom && <Footer />}
    </div>
  );
}

export default App;