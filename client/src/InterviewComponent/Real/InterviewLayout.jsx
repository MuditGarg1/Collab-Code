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
    <div className="relative flex h-screen text-gray-100 bg-gray-950 overflow-hidden font-sans">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Main Layout Wrapper */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 lg:p-6 overflow-hidden z-10">
        
        {/* Left Panel: Video Section */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col relative z-20">
          <div className="flex-1 rounded-[2rem] bg-gray-900/60 backdrop-blur-2xl border border-gray-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
            {videoComponent}
          </div>
        </div>

        {/* Right Panel: Code Editor & Chat */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col gap-4 min-h-0 relative z-20
          ${(codeEditorOpen || chatOpen) ? 'w-full md:w-5/12 lg:w-1/2' : 'w-16 flex-none items-center pt-2'}`}
        >
          {/* If everything is closed, show a nice compact vertical toolbar */}
          {!codeEditorOpen && !chatOpen && (
            <div className="w-14 bg-gray-900 border border-gray-800 shadow-lg rounded-2xl p-2 flex flex-col gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2 shadow-inner border border-indigo-500/30">
                <LayoutTemplate size={20} />
              </div>
              <button
                onClick={() => setCodeEditorOpen(true)}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-400 hover:text-indigo-400 transition flex items-center justify-center group"
                title="Open Code Editor"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-400 hover:text-indigo-400 transition flex items-center justify-center group"
                title="Open Chat"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Code Editor Container */}
          {codeEditorOpen && (
            <div className="flex-1 min-h-0 flex flex-col relative">
              <div className="flex-1 rounded-[2rem] bg-gray-900/60 backdrop-blur-2xl border border-gray-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
                {codeEditorComponent}
              </div>
            </div>
          )}

          {/* Chat Room Container */}
          {chatOpen && (
            <div className={`${codeEditorOpen ? 'flex-1' : 'flex-1'} min-h-0 flex flex-col relative`}>
              <div className="flex-1 rounded-[2rem] bg-gray-900/60 backdrop-blur-2xl border border-gray-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
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
