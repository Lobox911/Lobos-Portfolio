import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS, SERVICES } from './data';
import { Project } from './types';
import DeployLogConsole from './components/DeployLogConsole';
import ProjectPlanner from './components/ProjectPlanner';
import ProjectCardRow from './components/ProjectCardRow';
import InteractiveTerminal from './components/InteractiveTerminal';
import { 
  Terminal, 
  Sparkles, 
  ArrowUpRight, 
  Briefcase, 
  Layers, 
  User, 
  Mail, 
  Send, 
  CheckCircle, 
  Sun, 
  Moon, 
  Check, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

export default function App() {
  // Theme state: 'paper' (original warm light) vs 'midnight' (cyber developer dark)
  const [theme, setTheme] = useState<'paper' | 'midnight'>('paper');
  const [filterTag, setFilterTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync theme with HTML background
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'midnight') {
      root.style.backgroundColor = '#0E1117';
      root.style.color = '#F0F6FC';
    } else {
      root.style.backgroundColor = '#F7F6F1';
      root.style.color = '#16191F';
    }
  }, [theme]);

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(INITIAL_PROJECTS.flatMap(p => p.stack)))];

  // Filter projects
  const filteredProjects = INITIAL_PROJECTS.filter(p => {
    const matchesTag = filterTag === 'All' || p.stack.includes(filterTag);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const handlePreFillBrief = (briefText: string) => {
    setContactMessage(briefText);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      
      // Reset success check after 5s
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 1500);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'paper' ? 'midnight' : 'paper');
  };

  return (
    <div className={`min-h-screen transition-all-custom font-sans ${
      theme === 'midnight' 
        ? 'bg-[#0E1117] text-[#F0F6FC] selection:bg-emerald-500 selection:text-black' 
        : 'bg-[#F7F6F1] text-[#16191F] selection:bg-[#2036E8] selection:text-white'
    }`}>
      
      {/* HEADER NAVIGATION */}
      <nav className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all-custom ${
        theme === 'midnight' 
          ? 'bg-[#0E1117]/85 border-slate-800' 
          : 'bg-[#F7F6F1]/85 border-[#E2E0D6]'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="font-display font-black text-lg tracking-tight select-none">
            lobos<span className={theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'}>.</span>dev
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#work" className={`text-xs font-semibold tracking-wide uppercase transition-colors hover:text-[#2036E8] ${
              theme === 'midnight' ? 'text-slate-400 hover:text-emerald-400' : 'text-[#565B63]'
            }`}>
              Work
            </a>
            <a href="#services" className={`text-xs font-semibold tracking-wide uppercase transition-colors hover:text-[#2036E8] ${
              theme === 'midnight' ? 'text-slate-400 hover:text-emerald-400' : 'text-[#565B63]'
            }`}>
              Services
            </a>
            <a href="#planner" className={`text-xs font-semibold tracking-wide uppercase transition-colors hover:text-[#2036E8] ${
              theme === 'midnight' ? 'text-slate-400 hover:text-emerald-400' : 'text-[#565B63]'
            }`}>
              Scope Estimator
            </a>
            <a href="#about" className={`text-xs font-semibold tracking-wide uppercase transition-colors hover:text-[#2036E8] ${
              theme === 'midnight' ? 'text-slate-400 hover:text-emerald-400' : 'text-[#565B63]'
            }`}>
              About
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border cursor-pointer transition-colors ${
                theme === 'midnight' 
                  ? 'border-slate-800 hover:bg-slate-800 text-yellow-400' 
                  : 'border-[#E2E0D6] hover:bg-[#E2E0D6]/30 text-[#16191F]'
              }`}
              title={theme === 'midnight' ? "Switch to warm paper look" : "Switch to midnight console look"}
            >
              {theme === 'midnight' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a 
              href="#contact" 
              className={`font-mono text-[11px] font-bold border rounded-full px-4 py-2 transition-all cursor-pointer ${
                theme === 'midnight'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black'
                  : 'border-[#16191F] text-[#16191F] hover:bg-[#16191F] hover:text-[#F7F6F1]'
              }`}
            >
              start a project →
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="top" className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className={`font-mono text-xs font-bold tracking-widest ${
              theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
            }`}>
              AVAILABLE FOR DEPLOYMENTS IN Q3 2026
            </span>
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05] text-balance">
            Ideas are cheap.<br />
            <em className={`not-italic font-black ${
              theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
            }`}>Shipped</em> is the whole game.
          </h1>

          <p className={`text-base md:text-lg max-w-xl leading-relaxed ${
            theme === 'midnight' ? 'text-slate-300' : 'text-[#565B63]'
          }`}>
            I'm Lobos, a full-stack developer who takes products from a rough brief to deployed, running, and paying for themselves. Client portals, booking systems, SaaS tools, all built end-to-end and maintained after launch.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="#planner" 
              className={`px-6 py-3.5 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer ${
                theme === 'midnight'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
                  : 'bg-[#2036E8] hover:bg-[#1626A8] text-white shadow-[#2036E8]/20'
              }`}
            >
              Plan Your Project Scope
            </a>
            <a 
              href="#work" 
              className={`px-6 py-3.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                theme === 'midnight'
                  ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-[#F0F6FC]'
                  : 'border-[#E2E0D6] bg-white hover:border-[#16191F] text-[#16191F]'
              }`}
            >
              Browse Selected Work
            </a>
          </div>
        </div>

        {/* Dynamic Log Console Component */}
        <div className="lg:col-span-5 w-full">
          <DeployLogConsole />
        </div>
      </header>

      {/* SELECTED WORK SECTION */}
      <section id="work" className={`border-t transition-all-custom ${
        theme === 'midnight' ? 'border-slate-900 bg-[#161B22]/20' : 'border-[#E2E0D6] bg-white/50'
      } py-20`}>
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className={`font-mono text-xs font-bold tracking-widest block uppercase ${
                theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
              }`}>
                // SELECTED WORK
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-balance">
                Real products, in production, with real users.
              </h2>
              <p className={`text-sm ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>
                Not mock frames. Click any item to inspect actual architectural specs and stack choices.
              </p>
            </div>

            {/* Live Stats */}
            <div className={`p-4 border rounded-xl flex gap-6 shrink-0 ${
              theme === 'midnight' ? 'bg-[#161B22] border-slate-800' : 'bg-[#FBFAF6] border-[#E2E0D6]'
            }`}>
              <div>
                <span className="block font-display font-black text-xl md:text-2xl">100%</span>
                <span className="text-[10px] font-mono text-[#565B63] uppercase">Uptime Track record</span>
              </div>
              <div className="border-l border-[#E2E0D6]/60 pl-6">
                <span className="block font-display font-black text-xl md:text-2xl">95+</span>
                <span className="text-[10px] font-mono text-[#565B63] uppercase">Lighthouse targets</span>
              </div>
            </div>
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b pb-4 border-[#E2E0D6]/40">
            
            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono font-semibold text-[#565B63] flex items-center gap-1 mr-2 mt-1.5">
                <Filter className="w-3.5 h-3.5" /> Filter stack:
              </span>
              {['All', 'Next.js', 'Express', 'PostgreSQL', 'Supabase', 'Stripe', 'Firebase'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`text-[11px] font-mono font-medium px-3 py-1 rounded-full border cursor-pointer transition-all ${
                    filterTag === tag
                      ? theme === 'midnight'
                        ? 'bg-emerald-400 border-emerald-400 text-black font-bold'
                        : 'bg-[#2036E8] border-[#2036E8] text-white'
                      : theme === 'midnight'
                        ? 'border-slate-800 hover:border-slate-700 text-slate-400'
                        : 'border-[#E2E0D6] hover:border-[#16191F] text-[#565B63]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 text-xs font-mono rounded-lg border focus:outline-none transition-all ${
                  theme === 'midnight'
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-emerald-400'
                    : 'bg-white border-[#E2E0D6] text-black focus:border-[#2036E8]'
                }`}
              />
            </div>

          </div>

          {/* Projects Interactive List */}
          <div className={`border rounded-xl overflow-hidden transition-all-custom ${
            theme === 'midnight' ? 'border-slate-850 bg-[#0E1117]' : 'border-[#E2E0D6] bg-[#FCFBFA]'
          }`}>
            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#565B63] font-mono">
                No matching systems found. Try shifting your filters.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCardRow key={project.id} project={project} theme={theme} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES / SERVICES */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="max-w-3xl space-y-2">
          <span className={`font-mono text-xs font-bold tracking-widest block uppercase ${
            theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
          }`}>
            // WHAT I BUILD
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-balance">
            One developer, the entire stack.
          </h2>
          <p className={theme === 'midnight' ? 'text-slate-300' : 'text-[#565B63]'}>
            I eliminate coordination friction. Here are the core architectures I hand-deliver to production:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((svc, index) => {
            const headingColors = [
              'text-[#000000]',
              'text-[#0a0a0b]',
              'text-[#050505]'
            ];
            const titleColorClass = theme === 'midnight' ? 'text-[#F0F6FC]' : (headingColors[index] || 'text-[#16191F]');

            return (
              <div 
                key={svc.id}
                className={`p-6 md:p-8 rounded-xl border transition-all duration-300 group ${
                  theme === 'midnight' 
                    ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900' 
                    : 'bg-white border-[#E2E0D6] hover:border-[#16191F]'
                }`}
              >
                <span className={`font-mono text-xs font-bold block mb-4 ${
                  theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
                }`}>
                  {svc.n}
                </span>
                <h3 className={`font-display font-bold text-lg mb-2 group-hover:text-[#2036E8] dark:group-hover:text-emerald-400 transition-colors ${titleColorClass}`}>
                  {svc.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
                }`}>
                  {svc.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE PLANNER SECTION */}
      <section id="planner" className={`border-t border-b transition-all-custom ${
        theme === 'midnight' ? 'border-slate-900 bg-[#161B22]/10' : 'border-[#E2E0D6] bg-[#FBFAF6]'
      } py-20`}>
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className={`font-mono text-xs font-bold tracking-widest block uppercase ${
              theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
            }`}>
              // SCOPE CONFIGURATOR
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-balance">
              Design your system brief and estimate live.
            </h2>
            <p className={theme === 'midnight' ? 'text-slate-300' : 'text-[#565B63]'}>
              Check the modules required below. We will use these inputs to calculate an accurate, real-time budget, and pre-fill the contact sheet for our introductory briefing.
            </p>
          </div>

          <ProjectPlanner onPreFillBrief={handlePreFillBrief} />
        </div>
      </section>

      {/* ABOUT BAND SECTION */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <div className={`p-8 md:p-12 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch border transition-all duration-300 ${
          theme === 'midnight'
            ? 'bg-[#161B22]/60 border-slate-800/80 hover:border-slate-700/80'
            : 'bg-[#EFECE3] border-[#E2E0D6] hover:border-[#16191F]/30 shadow-sm'
        }`}>
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className={`font-mono text-[10px] font-bold tracking-widest block uppercase ${
                theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
              }`}>
                // PARTNERSHIP & SUSTAINABILITY
              </span>
              <h2 className={`font-display font-extrabold text-2xl md:text-3.5xl tracking-tight leading-tight ${
                theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
              }`}>
                Built for the long run, not the handoff.
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${
                theme === 'midnight' ? 'text-slate-300' : 'text-[#3E4249]'
              }`}>
                Most freelancers disappear after launch. I run production apps for my clients: monitoring deployments, patching libraries, hardening server routes, and shipping the next feature. When you hire me, you get the person who will still answer the phone in month eight.
              </p>
              <p className={`text-xs md:text-sm leading-relaxed ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#5E6470]'
              }`}>
                I work with clients across the US, UK, Canada, and Australia, with flexible hours that make daily check-ins actually possible.
              </p>
            </div>
          </div>

          <div className={`lg:col-span-5 flex flex-col justify-center space-y-6 lg:border-l lg:pl-10 ${
            theme === 'midnight' ? 'border-slate-800' : 'border-[#D2CFBE]'
          }`}>
            <div className={`border-b pb-4 ${
              theme === 'midnight' ? 'border-slate-800/80' : 'border-[#D2CFBE]'
            }`}>
              <span className={`text-[2.25rem] font-display font-black block leading-none tracking-tight ${
                theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
              }`}>10+</span>
              <span className={`text-[10px] font-mono uppercase tracking-wider block mt-1.5 font-bold ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>
                Production SaaS platforms Shipped
              </span>
            </div>
            
            <div className={`border-b pb-4 ${
              theme === 'midnight' ? 'border-slate-800/80' : 'border-[#D2CFBE]'
            }`}>
              <span className={`text-[2.25rem] font-display font-black block leading-none tracking-tight ${
                theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
              }`}>3</span>
              <span className={`text-[10px] font-mono uppercase tracking-wider block mt-1.5 font-bold ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>
                Staff, Client, and Admin Portals in One Hub
              </span>
            </div>

            <div>
              <span className={`text-sm font-extrabold block tracking-tight ${
                theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
              }`}>
                Full Lifecycle Coverage
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider block mt-1 font-bold ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>
                Design → Build → CI/CD Deploy → DevOps Audit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / PROJECT INTAKE FORM */}
      <section id="contact" className={`border-t transition-all-custom ${
        theme === 'midnight' ? 'border-slate-900 bg-slate-950/20' : 'border-[#E2E0D6] bg-white'
      } py-20`}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className={`font-mono text-xs font-bold tracking-widest block uppercase ${
                theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
              }`}>
                // NEXT DEPLOY
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight leading-[1.1]">
                Your project could be next in the logs.
              </h2>
            </div>

            <p className={`text-sm leading-relaxed ${
              theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
            }`}>
              Let’s build something durable. Fill out the contact desk or pre-fill your specifications using the scope calculator above.
            </p>

            <div className="space-y-3 font-mono text-xs pt-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-4 h-4 text-[#2036E8] dark:text-emerald-400 shrink-0" />
                <a href="mailto:hello@lobos.dev" className="font-bold underline text-slate-700 dark:text-slate-300 hover:text-[#2036E8] dark:hover:text-emerald-400">
                  hello@lobos.dev
                </a>
              </div>
              <p className="text-[#8B909A]">Response SLA: Within 12 hours</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className={`border rounded-xl p-6 md:p-8 ${
              theme === 'midnight' 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-[#FCFBFA] border-[#E2E0D6]'
            }`}>
              <h3 className="font-display font-bold text-base text-[#16191F] dark:text-[#F0F6FC] mb-4">
                Interactive Project Intake Desk
              </h3>
              
              {isSubmitted ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="font-display font-bold text-sm text-[#16191F] dark:text-white">Brief transmitted successfully!</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Thank you. Your custom requirements have been compiled and sent. Lobos will review your stack and respond within 12 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#565B63] mb-1">NAME</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="Elon"
                        className={`w-full text-xs px-3 py-2 border rounded-md focus:outline-none transition-all ${
                          theme === 'midnight'
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-400'
                            : 'bg-white border-[#E2E0D6] text-black focus:border-[#2036E8]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#565B63] mb-1">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="elon@spacex.com"
                        className={`w-full text-xs px-3 py-2 border rounded-md focus:outline-none transition-all ${
                          theme === 'midnight'
                            ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-400'
                            : 'bg-white border-[#E2E0D6] text-black focus:border-[#2036E8]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#565B63] mb-1">PROJECT BRIEF / MESSAGE</label>
                    <textarea
                      required
                      rows={5}
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      placeholder="Tell me about your SaaS, database integrations, or portal project. You can pre-fill this using the interactive scope estimator above!"
                      className={`w-full text-xs px-3 py-2 border rounded-md focus:outline-none font-mono transition-all leading-relaxed ${
                        theme === 'midnight'
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-400'
                          : 'bg-white border-[#E2E0D6] text-black focus:border-[#2036E8]'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      theme === 'midnight'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
                        : 'bg-[#16191F] text-[#F7F6F1] hover:bg-black'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Transmitting requirements...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Transmit Project Brief
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t transition-all-custom py-12 ${
        theme === 'midnight' ? 'border-slate-900 bg-[#0E1117]' : 'border-[#E2E0D6] bg-[#F7F6F1]'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[11px] text-[#565B63]">
          <div>
            <span>© 2026 Lobos. dev machine operational. Handcrafted with React.</span>
          </div>

          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2036E8] dark:hover:text-emerald-400 flex items-center gap-1">
              GitHub <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2036E8] dark:hover:text-emerald-400 flex items-center gap-1">
              LinkedIn <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2036E8] dark:hover:text-emerald-400 flex items-center gap-1">
              X <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Reto developer command shell console modal */}
      <InteractiveTerminal />

    </div>
  );
}
