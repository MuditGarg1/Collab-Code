import { ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react";

export default function InterviewLayout({
  videoComponent,
  codeEditorComponent,
  chatComponent,
  codeEditorOpen,
  setCodeEditorOpen,
  chatOpen,
  setChatOpen,
  children
}) {
  return (
    <div className="relative flex min-h-[100dvh] md:h-screen flex-col md:flex-row text-gray-900 bg-slate-50 md:overflow-hidden overflow-y-auto font-sans">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Main Layout Wrapper */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-2 sm:p-4 lg:p-6 md:overflow-hidden overflow-visible z-10 w-full min-h-0">
        
        {/* Left Panel: Video Section */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col relative z-20">
          <div className="flex-1 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
            {videoComponent}
          </div>
        </div>

        {/* Right Panel: Code Editor & Chat */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col gap-4 min-h-0 relative z-20
          ${(codeEditorOpen || chatOpen) ? 'w-full md:w-5/12 lg:w-1/2' : 'w-16 flex-none items-center pt-2'}`}
        >
          {/* If everything is closed, show a nice compact vertical toolbar */}
          {!codeEditorOpen && !chatOpen && (
            <div className="w-full md:w-14 bg-white/80 border border-gray-200/60 shadow-lg rounded-2xl p-2 flex flex-row md:flex-col gap-3 items-center justify-center backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2 shadow-sm border border-indigo-100">
                <LayoutTemplate size={20} />
              </div>
              <button
                onClick={() => setCodeEditorOpen(true)}
                className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 transition flex items-center justify-center group shadow-sm"
                title="Open Code Editor"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 transition flex items-center justify-center group shadow-sm"
                title="Open Chat"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Code Editor Container */}
          {codeEditorOpen && (
            <div className="flex-1 min-h-0 flex flex-col relative">
              <div className="flex-1 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                {codeEditorComponent}
              </div>
            </div>
          )}

          {/* Chat Room Container */}
          {chatOpen && (
            <div className={`${codeEditorOpen ? 'flex-1' : 'flex-1'} min-h-0 flex flex-col relative`}>
              <div className="flex-1 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                {chatComponent}
              </div>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
