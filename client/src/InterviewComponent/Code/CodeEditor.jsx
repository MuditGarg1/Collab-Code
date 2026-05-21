import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { ChevronDown, Download, Trash2, Code2, Save } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { name: "JavaScript", value: "javascript" },
  { name: "Python", value: "python" },
  { name: "Java", value: "java" },
  { name: "C++", value: "cpp" },
  { name: "C#", value: "csharp" },
  { name: "TypeScript", value: "typescript" },
  { name: "Go", value: "go" },
  { name: "Rust", value: "rust" },
  { name: "SQL", value: "sql" },
  { name: "HTML", value: "html" },
  { name: "CSS", value: "css" },
];

export default function CodeEditor({ socket, roomId, role }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const ignoreUpdateRef = useRef(false);
  const debounceTimerRef = useRef(null);

  const isInterviewer = role === "interviewer" || role === "host";
  const storageKey = `code_${roomId}_${language}`;

  // Load code from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [storageKey]);

  // Socket synchronization
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join-code-room", roomId);

    const onSync = serverCode => {
      ignoreUpdateRef.current = true;
      setCode(serverCode);
      localStorage.setItem(storageKey, serverCode);
      setTimeout(() => {
        ignoreUpdateRef.current = false;
      }, 50);
    };

    const onUpdate = serverCode => {
      ignoreUpdateRef.current = true;
      setCode(serverCode);
      localStorage.setItem(storageKey, serverCode);
      setTimeout(() => {
        ignoreUpdateRef.current = false;
      }, 50);
    };

    socket.on("code-sync", onSync);
    socket.on("code-update", onUpdate);

    return () => {
      socket.emit("leave-code-room", roomId);
      socket.off("code-sync", onSync);
      socket.off("code-update", onUpdate);
    };
  }, [socket, roomId, storageKey]);

  const handleChange = value => {
    const newCode = value || "";
    setCode(newCode);
    
    // Save to localStorage immediately
    localStorage.setItem(storageKey, newCode);
    
    if (!isInterviewer) {
      setSaving(true);
    }

    if (ignoreUpdateRef.current) return;

    // Debounce socket emission to reduce spam (300ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!isInterviewer) {
      debounceTimerRef.current = setTimeout(() => {
        socket.emit("code-change", { roomId, code: newCode });
        setSaving(false);
      }, 500);
    }
  };

  const handleLanguageChange = newLanguage => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = lang => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      typescript: "ts",
      go: "go",
      rust: "rs",
      sql: "sql",
      html: "html",
      css: "css",
    };
    return extensions[lang] || "txt";
  };

  const clearCode = () => {
    if (confirm("Are you sure you want to clear all code?")) {
      setCode("");
      localStorage.removeItem(storageKey);
      if (!isInterviewer) {
        socket.emit("code-change", { roomId, code: "" });
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-transparent">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-20">
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <Code2 size={16} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 tracking-wide">Editor</span>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border shadow-sm ${
                isInterviewer 
                  ? "bg-red-50 text-red-600 border-red-200" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
              }`}>
                {isInterviewer ? "Read Only" : "Live"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-gray-200 shadow-sm rounded-xl hover:border-indigo-200 hover:text-indigo-600 transition-colors text-gray-700"
            >
              {SUPPORTED_LANGUAGES.find(l => l.value === language)?.name || "Language"}
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-gray-200 rounded-xl z-50 shadow-xl overflow-hidden py-1">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                     key={lang.value}
                     onClick={() => handleLanguageChange(lang.value)}
                     className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                       language === lang.value
                         ? "bg-indigo-50 text-indigo-600"
                         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                     }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isInterviewer && (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <button
                onClick={downloadCode}
                title="Download code"
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent rounded-lg transition-all"
              >
                <Download size={16} />
              </button>
              <button
                onClick={clearCode}
                title="Clear code"
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 relative bg-white z-0">
        <Editor
          height="100%"
          language={language}
          theme="light"
          value={code}
          onChange={handleChange}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false }, // Disabled minimap for a cleaner look
            readOnly: isInterviewer,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            bracketPairColorization: {
              enabled: true,
            },
          }}
        />
      </div>

      {/* Footer - Status */}
      <div className="px-6 py-2.5 border-t border-gray-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between text-xs font-medium text-gray-500">
        <div className="flex items-center gap-4">
          <span>Ln {code.split("\n").length}, Col {code.length}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>UTF-8</span>
        </div>
        
        {!isInterviewer && (
          <div className="flex items-center gap-2">
            {saving ? (
              <span className="text-amber-500 flex items-center gap-1.5"><Save size={12} /> Saving...</span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1.5"><Save size={12} /> Saved</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
