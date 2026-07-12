import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, ChevronRight, CornerDownLeft } from 'lucide-react';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export default function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'system-init',
      output: (
        <div className="space-y-1">
          <p className="text-emerald-400 font-bold">LOBOS SHELL v2.6.0 (production-stable)</p>
          <p className="text-gray-400">Type <span className="text-[#2036E8] font-bold">help</span> to view available interactive parameters.</p>
        </div>
      )
    }
  ]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
            <div><span className="text-[#2036E8] font-bold">about</span> - Read Lobos\' development philosophy</div>
            <div><span className="text-[#2036E8] font-bold">skills</span> - List full stack technologies and core tooling</div>
            <div><span className="text-[#2036E8] font-bold">projects</span> - Display deployed client sites</div>
            <div><span className="text-[#2036E8] font-bold">neofetch</span> - Show retro developer specs & system log</div>
            <div><span className="text-[#2036E8] font-bold">contact</span> - Get direct channels & communication hours</div>
            <div><span className="text-[#2036E8] font-bold">clear</span> - Clear terminal session output</div>
          </div>
        );
        break;
      case 'about':
        output = (
          <p className="text-slate-300 leading-relaxed">
            I am a multi-disciplinary software builder based in San Francisco. I specialize in the unglamorous backend edge-cases, high-security integrations, and speed-optimization. I deliver apps that convert cold leads into paying customers, built entirely from scratch with no bloat.
          </p>
        );
        break;
      case 'skills':
        output = (
          <div className="space-y-2 text-slate-300 font-mono text-[11px]">
            <p className="font-bold text-blue-400">TECHNICAL STACK VERIFICATION Matrix:</p>
            <div className="grid grid-cols-3 gap-2 border border-slate-700 p-2.5 rounded bg-slate-900/50">
              <div>
                <span className="text-emerald-400 block font-bold">// FRONTEND</span>
                • Next.js / React 19<br />• TypeScript (Strict)<br />• Tailwind CSS v4<br />• Framer Motion
              </div>
              <div>
                <span className="text-purple-400 block font-bold">// BACKEND & API</span>
                • Node.js / Express<br />• PostgreSQL / SQLite<br />• Prisma / Drizzle ORM<br />• WebSockets (ws)
              </div>
              <div>
                <span className="text-amber-400 block font-bold">// DEPLOY & SEC</span>
                • Docker / Cloud Run<br />• Supabase / Firebase<br />• Stripe Metered API<br />• CI/CD (GitHub Actions)
              </div>
            </div>
          </div>
        );
        break;
      case 'projects':
        output = (
          <div className="space-y-2 text-slate-300">
            <p className="font-bold text-[#2036E8]">CLIENT REGISTRY:</p>
            <div className="space-y-1.5">
              <div>• <span className="font-bold text-white">NMD Pressure Washing</span> - Custom CRM & multi-portal operations scheduler. [Next.js + Express + PG]</div>
              <div>• <span className="font-bold text-white">LeadMap SaaS</span> - High-performance geo-indexing lead finder. [OpenStreetMap + Supabase]</div>
              <div>• <span className="font-bold text-white">MyAgeCalculator</span> - 18-tool date platform optimized for dynamic sitemap SEO. [Firebase]</div>
            </div>
          </div>
        );
        break;
      case 'neofetch':
        output = (
          <div className="flex flex-col sm:flex-row gap-4 font-mono text-[11px] text-slate-300">
            <pre className="text-blue-500 font-bold leading-none hidden sm:block">
{`   _       _                 
  | |     | |                
  | | ___ | |__   ___  ___   
  | |/ _ \\| '_ \\ / _ \\/ __|  
  | | (_) | |_) | (_) \\__ \\  
  |_|\\___/|_.__/ \\___/|___/  
                             `}
            </pre>
            <div className="space-y-1">
              <p><span className="text-emerald-400 font-bold">lobos@dev-machine</span></p>
              <p>-------------------------</p>
              <p><span className="text-blue-400">OS:</span> Linux container (Alpine / Cloud Run)</p>
              <p><span className="text-blue-400">Host:</span> Server-Side Vercel / Google Ingress</p>
              <p><span className="text-blue-400">Uptime:</span> 187 days, 14 hours</p>
              <p><span className="text-blue-400">Shell:</span> LobosShell (v2.6)</p>
              <p><span className="text-blue-400">Stack:</span> React-Vite + Express API</p>
              <p><span className="text-blue-400">Status:</span> Available for Q3 contracts</p>
            </div>
          </div>
        );
        break;
      case 'contact':
        output = (
          <div className="space-y-1 text-slate-300">
            <p>📧 Email: <a href="mailto:hello@lobos.dev" className="text-blue-400 underline font-bold">hello@lobos.dev</a></p>
            <p>💬 Direct Telegram: @lobosdev (Mon-Fri 08:00 - 18:00 UTC)</p>
            <p>📅 Timezones Covered: US EST/PST, UK, and Sydney overlap availability</p>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        output = (
          <p className="text-red-400 font-mono">
            Command not recognized: <span className="font-bold">"{cmd}"</span>. Type <span className="underline">help</span> to view all instructions.
          </p>
        );
    }

    setHistory(prev => [...prev, { command: input, output }]);
    setInput('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#2036E8] text-white hover:bg-[#1626A8] p-3.5 rounded-full shadow-[0_8px_30px_rgb(32,54,232,0.36)] hover:shadow-[0_8px_30px_rgb(32,54,232,0.5)] transition-all cursor-pointer flex items-center gap-2 group hover:scale-105 active:scale-95"
        title="Open Developer Console"
      >
        <Terminal className="w-5 h-5" />
        <span className="text-xs font-mono font-bold max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 ease-out whitespace-nowrap">
          Lobos Terminal
        </span>
      </button>

      {/* Terminal Modal/Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#16191F]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-[#16191F] border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[480px]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-[#2036E8]" />
                <span className="font-mono text-xs font-semibold">Terminal — lobos@dev: ~ (Interactive Mode)</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Console Screen logs */}
            <div 
              className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-4 custom-scrollbar"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center text-slate-500 text-[11px]">
                    <span className="text-emerald-500">lobos@dev:~$</span>
                    <span className="ml-2 font-bold text-slate-200">{item.command}</span>
                  </div>
                  <div className="pl-4 leading-relaxed">{item.output}</div>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Command Input bar */}
            <form 
              onSubmit={handleCommand}
              className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-slate-400 font-mono"
            >
              <ChevronRight className="w-4 h-4 text-[#2036E8] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder='Type a command (e.g. "skills", "projects", "neofetch")...'
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-white font-mono text-xs placeholder-slate-600"
              />
              <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-600">
                <span>Enter</span>
                <CornerDownLeft className="w-2.5 h-2.5" />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
