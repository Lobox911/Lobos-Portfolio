'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  Inbox, 
  FileText, 
  Briefcase, 
  Layers, 
  Tv, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { Project, Service } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'paper' | 'midnight';
  isDbConnected: boolean;
  
  // Hero State
  heroBadgeText: string;
  setHeroBadgeText: (val: string) => void;
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  heroDescription: string;
  setHeroDescription: (val: string) => void;
  
  // Projects State
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  
  // Services State
  services: Service[];
  setServices: (services: Service[]) => void;
  
  // Submissions State
  submissions: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
  }>;
  setSubmissions: (subs: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
  }>) => void;
  
  onResetDefaults: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  theme,
  isDbConnected,
  heroBadgeText,
  setHeroBadgeText,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  heroDescription,
  setHeroDescription,
  projects,
  setProjects,
  services,
  setServices,
  submissions,
  setSubmissions,
  onResetDefaults
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'services' | 'inquiries'>('hero');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  // Admin Security & Login States
  const [token, setToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Load session token from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('lobos_admin_token');
      if (stored) {
        setToken(stored);
      }
    }
  }, []);

  // Fetch inquiries upon successful admin login or opening
  const fetchSubmissions = async (adminToken: string) => {
    if (isDbConnected) {
      try {
        const res = await fetch('/api/inquiries', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        const data = await res.json();
        if (data.connected && data.submissions) {
          setSubmissions(data.submissions);
        }
      } catch (err) {
        console.error("Failed to load submissions in admin portal:", err);
      }
    }
  };

  useEffect(() => {
    if (isOpen && token && isDbConnected) {
      fetchSubmissions(token);
    }
  }, [isOpen, token, isDbConnected]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        sessionStorage.setItem('lobos_admin_token', data.token);
        setPasswordInput('');
        setLoginError(null);
        // Load submissions immediately on login
        if (isDbConnected) {
          fetchSubmissions(data.token);
        }
      } else {
        setLoginError(data.error || 'Incorrect password. Try again.');
      }
    } catch (err: any) {
      console.error("Login request failed:", err);
      setLoginError("Connection failed. Could not contact authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('lobos_admin_token');
  };

  // Helper to build headers with authentication token
  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // When a different project is selected or projects list changes, populate editing form
  useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find(p => p.id === selectedProjectId);
      if (proj) {
        setEditingProject({ ...proj });
      }
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    } else {
      setEditingProject(null);
    }
  }, [selectedProjectId, projects]);

  const showNotification = () => {
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 2000);
  };

  // Save Hero Config
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDbConnected) {
      try {
        const res = await fetch('/api/config', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            action: 'saveHero',
            data: {
              badge: heroBadgeText,
              title: heroTitle,
              subtitle: heroSubtitle,
              description: heroDescription
            }
          })
        });
        if (res.ok) {
          showNotification();
        }
      } catch (err) {
        console.error('Failed to save hero config to DB:', err);
      }
    } else {
      localStorage.setItem('lobos_hero_badge', heroBadgeText);
      localStorage.setItem('lobos_hero_title', heroTitle);
      localStorage.setItem('lobos_hero_sub', heroSubtitle);
      localStorage.setItem('lobos_hero_desc', heroDescription);
      showNotification();
    }
  };

  // Save currently selected project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const updated = projects.map(p => p.id === editingProject.id ? editingProject : p);
    setProjects(updated);

    if (isDbConnected) {
      try {
        const res = await fetch('/api/config', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            action: 'saveProjects',
            data: updated
          })
        });
        if (res.ok) {
          showNotification();
        }
      } catch (err) {
        console.error('Failed to save projects to DB:', err);
      }
    } else {
      localStorage.setItem('lobos_projects', JSON.stringify(updated));
      showNotification();
    }
  };

  // Add a new empty project to edit
  const handleAddNewProject = async () => {
    const newId = `custom-project-${Date.now()}`;
    const newProj: Project = {
      id: newId,
      name: 'New Custom Initiative',
      year: '2026',
      subtitle: 'Premium software stack tailored for target workflow operations',
      stack: ['Next.js', 'PostgreSQL', 'Tailwind'],
      url: '#contact',
      isLive: false,
      description: 'Describe the main system components, who it serves, and what core developer solutions were deployed to execute this project.',
      challenge: 'Operational bottleneck or friction that forced manual work.',
      solution: 'Custom system build, integrations, automated alerts, or billing pipelines.',
      result: 'Measurable metric (e.g. 50% faster checkout speeds or eliminated scheduling gaps).',
      architecture: {
        frontend: 'Next.js, Tailwind CSS',
        backend: 'Node.js server',
        database: 'PostgreSQL DB instance',
        infra: 'Cloud container deployment'
      }
    };

    const newProjects = [newProj, ...projects];
    setProjects(newProjects);
    setSelectedProjectId(newId);

    if (isDbConnected) {
      try {
        const res = await fetch('/api/config', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            action: 'saveProjects',
            data: newProjects
          })
        });
        if (res.ok) {
          showNotification();
        }
      } catch (err) {
        console.error('Failed to add project to DB:', err);
      }
    } else {
      localStorage.setItem('lobos_projects', JSON.stringify(newProjects));
      showNotification();
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project from the listing?')) {
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      if (selectedProjectId === id) {
        setSelectedProjectId(filtered[0]?.id || null);
      }

      if (isDbConnected) {
        try {
          const res = await fetch('/api/config', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              action: 'saveProjects',
              data: filtered
            })
          });
          if (res.ok) {
            showNotification();
          }
        } catch (err) {
          console.error('Failed to delete project from DB:', err);
        }
      } else {
        localStorage.setItem('lobos_projects', JSON.stringify(filtered));
        showNotification();
      }
    }
  };

  // Save Services list
  const handleSaveService = async (index: number, title: string, description: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], title, description };
    setServices(updated);

    if (isDbConnected) {
      try {
        const res = await fetch('/api/config', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            action: 'saveServices',
            data: updated
          })
        });
        if (res.ok) {
          showNotification();
        }
      } catch (err) {
        console.error('Failed to save service to DB:', err);
      }
    } else {
      localStorage.setItem('lobos_services', JSON.stringify(updated));
      showNotification();
    }
  };

  // Delete client inquiry
  const handleDeleteSubmission = async (id: string) => {
    const filtered = submissions.filter(s => s.id !== id);
    setSubmissions(filtered);

    if (isDbConnected) {
      try {
        const res = await fetch(`/api/inquiries?id=${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (res.ok) {
          showNotification();
        }
      } catch (err) {
        console.error('Failed to delete submission from DB:', err);
      }
    } else {
      localStorage.setItem('lobos_submissions', JSON.stringify(filtered));
      showNotification();
    }
  };

  // Update specific fields of editing project
  const updateProjectField = (key: keyof Project, value: any) => {
    if (!editingProject) return;
    setEditingProject(prev => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
  };

  const updateProjectArchitectureField = (key: string, value: string) => {
    if (!editingProject) return;
    setEditingProject(prev => {
      if (!prev) return null;
      const arch = prev.architecture || {};
      return {
        ...prev,
        architecture: {
          ...arch,
          [key]: value
        }
      };
    });
  };

  // Colors based on page theme
  const bgPanel = theme === 'midnight' ? 'bg-[#0E1117] border-slate-800 text-[#F0F6FC]' : 'bg-[#FAF9F6] border-[#E2E0D6] text-[#16191F]';
  const bgMain = theme === 'midnight' ? 'bg-[#161B22]' : 'bg-white';
  const textMuted = theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]';
  const inputClass = `w-full px-3 py-2 text-xs rounded-md border focus:outline-none transition-all ${
    theme === 'midnight'
      ? 'bg-slate-900 border-slate-800 text-white focus:border-emerald-400'
      : 'bg-[#FCFBFA] border-[#E2E0D6] text-black focus:border-[#2036E8]'
  }`;
  const labelClass = `block text-[10px] font-mono font-bold tracking-wider mb-1 ${textMuted}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#16191F]/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          
          {!token ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden border p-6 sm:p-8 flex flex-col space-y-6 ${bgPanel}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'midnight' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#2036E8]/10 text-[#2036E8]'
                  }`}>
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-tight">Admin Gatekeeper</h3>
                    <p className={`text-[10px] font-mono ${textMuted}`}>
                      Authentication Required
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'midnight' ? 'border-slate-800 hover:bg-slate-800' : 'border-[#E2E0D6] hover:bg-[#E2E0D6]/30'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className={`block text-[10px] font-mono uppercase mb-1.5 ${textMuted}`}>
                    Management Passcode
                  </label>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      required
                      className={`w-full text-xs px-3.5 py-2.5 pr-10 border rounded-lg focus:outline-none transition-all font-mono ${
                        theme === 'midnight'
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-400'
                          : 'bg-[#FCFBFA] border-[#E2E0D6] text-black focus:border-[#2036E8]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:opacity-80 transition-opacity cursor-pointer ${textMuted}`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="text-[11px] font-mono text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-md flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className={`w-full py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    theme === 'midnight'
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600'
                      : 'bg-[#16191F] text-white hover:bg-black disabled:bg-gray-100 disabled:text-gray-400'
                  }`}
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Unlock Control Desk
                    </>
                  )}
                </button>
              </form>

              {/* Evaluation notice */}
              <div className={`pt-4 border-t text-[10px] leading-relaxed font-mono ${
                theme === 'midnight' ? 'border-slate-850 text-slate-500' : 'border-gray-100 text-[#9AA0A8]'
              }`}>
                <span className="block font-bold mb-1">Developer Notice:</span>
                <span>If evaluating, use password <strong className={theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'}>admin</strong> to login instantly. Configured via the <code className="px-1 py-0.5 rounded bg-gray-500/10">ADMIN_PASSWORD</code> environment variable.</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`w-full max-w-5xl h-[92vh] sm:h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col border ${bgPanel}`}
              onClick={e => e.stopPropagation()}
            >
            {/* Header bar */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b gap-3 sm:gap-4 ${
              theme === 'midnight' ? 'bg-slate-900 border-slate-800' : 'bg-[#F2EFE8] border-[#E2E0D6]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${theme === 'midnight' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#2036E8]/10 text-[#2036E8]'}`}>
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-black text-xs sm:text-sm tracking-tight flex flex-wrap items-center gap-1.5">
                    <span className="truncate">Control Desk & Admin Center</span>
                    {isDbConnected ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        Postgres
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        Sandbox
                      </span>
                    )}
                  </h2>
                  <p className={`text-[9px] sm:text-[10px] font-mono truncate ${textMuted} hidden sm:block`}>Configure copy, portfolio, and inquiries</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                {/* Reset to Default */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to discard all your custom edits and reset the portfolio to default content?')) {
                      onResetDefaults();
                      showNotification();
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-md font-mono text-[9px] sm:text-[10px] font-bold border transition-colors cursor-pointer ${
                    theme === 'midnight'
                      ? 'border-red-900/40 text-red-400 hover:bg-red-950/20 bg-red-950/5'
                      : 'border-red-200 text-red-600 hover:bg-red-50 bg-red-50/30'
                  }`}
                  title="Reset site back to original data parameters"
                >
                  <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Restore Defaults</span>
                </button>

                <button
                  onClick={onClose}
                  className={`p-1 sm:p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'midnight' ? 'border-slate-850 hover:bg-slate-800' : 'border-[#E2E0D6] hover:bg-[#E2E0D6]/30'
                  }`}
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Main content body (Two column split: Left navigation tab, Right scrollable forms) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* SIDE NAVIGATION BAR */}
              <div className={`w-full md:w-60 border-b md:border-b-0 md:border-r p-3 sm:p-4 flex flex-col justify-between shrink-0 ${
                theme === 'midnight' ? 'bg-[#0E1117] border-slate-800' : 'bg-[#FAF9F6] border-[#E2E0D6]'
              }`}>
                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none shrink-0">
                  {[
                    { id: 'hero', label: '1. Hero & Header', icon: Tv },
                    { id: 'projects', label: '2. Portfolio Projects', icon: Briefcase },
                    { id: 'services', label: '3. Core Services', icon: Layers },
                    { id: 'inquiries', label: '4. Inquiry Inbox', icon: Inbox, badge: submissions.length }
                  ].map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center justify-between gap-2 px-3 py-2 md:py-2.5 rounded-lg text-left text-[11px] md:text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 ${
                          isActive
                            ? theme === 'midnight'
                              ? 'bg-emerald-500 text-black shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                              : 'bg-[#2036E8] text-white shadow-sm'
                            : theme === 'midnight'
                              ? 'text-slate-400 hover:text-[#F0F6FC] hover:bg-slate-900'
                              : 'text-[#565B63] hover:text-[#16191F] hover:bg-[#E2E0D6]/40'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <tab.icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </span>
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ml-1.5 ${
                            isActive 
                              ? 'bg-white text-black' 
                              : theme === 'midnight' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-[#2036E8]/10 text-[#2036E8]'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className={`p-3 rounded-lg border text-[10px] leading-relaxed font-mono hidden md:block ${
                  theme === 'midnight' ? 'bg-slate-900/30 border-slate-800 text-slate-500' : 'bg-[#E2E0D6]/20 border-[#E2E0D6] text-[#565B63]'
                }`}>
                  <ShieldCheck className="w-4 h-4 mb-1 text-emerald-500 inline mr-1" />
                  Changes take effect in real-time on the portfolio layout. Fully sandbox persisted.
                </div>
              </div>

              {/* FORMS / EDITOR AREA */}
              <div className={`flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar ${bgMain}`}>
                
                {/* Database Connectivity Status Alert Banner */}
                {!isDbConnected ? (
                  <div className={`p-3.5 mb-5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-3 shadow-sm transition-all ${
                    theme === 'midnight' 
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-200/90' 
                      : 'bg-amber-50/40 border-amber-200 text-[#565B63]'
                  }`}>
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold block text-[9px] text-amber-500 tracking-wider mb-0.5 uppercase">DATABASE OFFLINE (FALLBACK ACTIVE)</span>
                      Neon Serverless PostgreSQL is not connected yet. Edits are safely running in sandbox LocalStorage mode. To enable global cloud synchronization, add your Neon connection string as <code className="font-mono font-bold bg-amber-500/10 px-1 py-0.5 rounded text-amber-600 dark:text-amber-300">DATABASE_URL</code> in your environment variables.
                    </div>
                  </div>
                ) : (
                  <div className={`p-3.5 mb-5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-3 shadow-sm transition-all ${
                    theme === 'midnight' 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200/90' 
                      : 'bg-emerald-50/40 border-emerald-200 text-[#565B63]'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold block text-[9px] text-emerald-500 tracking-wider mb-0.5 uppercase">DATABASE ONLINE (NEON POSTGRESQL)</span>
                      Connected to Neon Serverless PostgreSQL. Your portfolio copy, custom project listings, and contact inquiries are synchronized in real-time and persisted globally in your live database.
                    </div>
                  </div>
                )}
                
                {/* TAB 1: HERO CONFIG */}
                {activeTab === 'hero' && (
                  <form onSubmit={handleSaveHero} className="space-y-5 max-w-2xl">
                    <div className="border-b pb-3 border-[#E2E0D6]/40">
                      <h3 className="font-display font-bold text-sm">Header & Hero Segment Configuration</h3>
                      <p className={`text-[11px] ${textMuted}`}>Edit the primary greeting cards, brand copy, and landing labels</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>LIVELINESS AVAILABILITY BADGE</label>
                        <input
                          type="text"
                          required
                          value={heroBadgeText}
                          onChange={e => setHeroBadgeText(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>MAIN LANDING HEADING</label>
                        <input
                          type="text"
                          required
                          value={heroTitle}
                          onChange={e => setHeroTitle(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>EMPHASIZED SUB-HEADING</label>
                        <input
                          type="text"
                          required
                          value={heroSubtitle}
                          onChange={e => setHeroSubtitle(e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>HERO DESCRIPTION BIO</label>
                        <textarea
                          required
                          rows={4}
                          value={heroDescription}
                          onChange={e => setHeroDescription(e.target.value)}
                          className={`${inputClass} leading-relaxed`}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                          theme === 'midnight'
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                            : 'bg-[#16191F] text-[#F7F6F1] hover:bg-black'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" /> Save Hero Settings
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: PROJECTS PORTFOLIO */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 border-[#E2E0D6]/40">
                      <div>
                        <h3 className="font-display font-bold text-sm">Portfolio Project Listing Manager</h3>
                        <p className={`text-[11px] ${textMuted}`}>Add, delete, or fine-tune architectural metadata blueprints</p>
                      </div>
                      <button
                        onClick={handleAddNewProject}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold cursor-pointer ${
                          theme === 'midnight'
                            ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                            : 'bg-[#2036E8] text-white hover:bg-[#1626A8]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Project
                      </button>
                    </div>

                    {/* Horizontal list of projects for fast tab switching */}
                    <div className="flex flex-wrap gap-2 pb-2 border-b border-[#E2E0D6]/30">
                      {projects.map(p => {
                        const isSel = p.id === selectedProjectId;
                        return (
                          <div key={p.id} className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedProjectId(p.id)}
                              className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                                isSel
                                  ? theme === 'midnight'
                                    ? 'bg-slate-800 border-emerald-500 text-emerald-400'
                                    : 'bg-[#2036E8]/5 border-[#2036E8] text-[#2036E8]'
                                  : theme === 'midnight'
                                    ? 'bg-slate-900/30 border-slate-850 text-slate-400 hover:text-slate-200'
                                    : 'bg-[#FCFBFA] border-[#E2E0D6] text-[#565B63] hover:text-black'
                              }`}
                            >
                              {p.name}
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className={`p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer`}
                              title={`Delete ${p.name}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {editingProject ? (
                      <form onSubmit={handleSaveProject} className="space-y-5 max-w-3xl">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                          <div className="sm:col-span-8">
                            <label className={labelClass}>PROJECT NAME</label>
                            <input
                              type="text"
                              required
                              value={editingProject.name}
                              onChange={e => updateProjectField('name', e.target.value)}
                              className={inputClass}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <label className={labelClass}>YEAR / INTERVAL</label>
                            <input
                              type="text"
                              required
                              value={editingProject.year}
                              onChange={e => updateProjectField('year', e.target.value)}
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>SUBTITLE / CORE CONCEPT</label>
                          <input
                            type="text"
                            required
                            value={editingProject.subtitle}
                            className={inputClass}
                            onChange={e => updateProjectField('subtitle', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>STACK TAGS (COMMA SEPARATED)</label>
                            <input
                              type="text"
                              required
                              value={editingProject.stack.join(', ')}
                              onChange={e => updateProjectField('stack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>DEPLOYMENT TARGET URL</label>
                            <input
                              type="text"
                              required
                              value={editingProject.url}
                              onChange={e => updateProjectField('url', e.target.value)}
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 py-1">
                          <input
                            id="proj-is-live"
                            type="checkbox"
                            checked={editingProject.isLive}
                            onChange={e => updateProjectField('isLive', e.target.checked)}
                            className="accent-emerald-500 w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="proj-is-live" className="text-xs font-mono font-bold cursor-pointer">
                            Mark system state as 'Live in Production' (shows responsive badge and simulation tools)
                          </label>
                        </div>

                        <div>
                          <label className={labelClass}>PRIMARY NARRATIVE OVERVIEW</label>
                          <textarea
                            required
                            rows={3}
                            value={editingProject.description}
                            onChange={e => updateProjectField('description', e.target.value)}
                            className={`${inputClass} leading-relaxed`}
                          />
                        </div>

                        <div className="border-t border-dashed border-[#E2E0D6]/40 pt-4 space-y-4">
                          <h4 className="font-display font-bold text-xs">Architectural Blueprint Deep-Dive Metrics</h4>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className={labelClass}>1. THE OPERATIONAL CHALLENGE</label>
                              <textarea
                                rows={2}
                                value={editingProject.challenge || ''}
                                onChange={e => updateProjectField('challenge', e.target.value)}
                                className={inputClass}
                              />
                            </div>

                            <div>
                              <label className={labelClass}>2. THE ENGINEERED SOLUTION</label>
                              <textarea
                                rows={2}
                                value={editingProject.solution || ''}
                                onChange={e => updateProjectField('solution', e.target.value)}
                                className={inputClass}
                              />
                            </div>

                            <div>
                              <label className={labelClass}>3. MEASURABLE BUSINESS RESULT</label>
                              <textarea
                                rows={2}
                                value={editingProject.result || ''}
                                onChange={e => updateProjectField('result', e.target.value)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-[#E2E0D6]/40 pt-4 space-y-4">
                          <h4 className="font-display font-bold text-xs">Technical Stack Allocations</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>FRONTEND STACK</label>
                              <input
                                type="text"
                                value={editingProject.architecture?.frontend || ''}
                                onChange={e => updateProjectArchitectureField('frontend', e.target.value)}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>BACKEND SERVICE</label>
                              <input
                                type="text"
                                value={editingProject.architecture?.backend || ''}
                                onChange={e => updateProjectArchitectureField('backend', e.target.value)}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>DATABASE INSTANCE</label>
                              <input
                                type="text"
                                value={editingProject.architecture?.database || ''}
                                onChange={e => updateProjectArchitectureField('database', e.target.value)}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>INFRASTRUCTURE TARGET</label>
                              <input
                                type="text"
                                value={editingProject.architecture?.infra || ''}
                                onChange={e => updateProjectArchitectureField('infra', e.target.value)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#E2E0D6]/30">
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                              theme === 'midnight'
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                : 'bg-[#16191F] text-[#F7F6F1] hover:bg-black'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" /> Save Project Configurations
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-12 text-center text-xs font-mono text-slate-500">
                        Create an initiative using the primary CTA above to start editing.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: SERVICES */}
                {activeTab === 'services' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="border-b pb-3 border-[#E2E0D6]/40">
                      <h3 className="font-display font-bold text-sm">Core Service Layouts</h3>
                      <p className={`text-[11px] ${textMuted}`}>Adjust headers and offerings rendered in the What I Build section</p>
                    </div>

                    <div className="space-y-6">
                      {services.map((svc, i) => (
                        <div key={svc.id} className={`p-4 rounded-xl border ${
                          theme === 'midnight' ? 'bg-slate-900/30 border-slate-800' : 'bg-[#FAF9F6] border-[#E2E0D6]'
                        } space-y-3`}>
                          <div className="flex items-center gap-2 text-xs font-mono font-bold">
                            <span className={theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'}>
                              Offer {svc.n}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className={labelClass}>SERVICE TITLE</label>
                              <input
                                type="text"
                                value={svc.title}
                                onChange={e => handleSaveService(i, e.target.value, svc.description)}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>DESCRIPTION</label>
                              <textarea
                                rows={2}
                                value={svc.description}
                                onChange={e => handleSaveService(i, svc.title, e.target.value)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CLIENT BRIEF SUBMISSIONS INBOX */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6">
                    <div className="border-b pb-3 border-[#E2E0D6]/40">
                      <h3 className="font-display font-bold text-sm">Client Intake Message Archives</h3>
                      <p className={`text-[11px] ${textMuted}`}>Submissions generated by clients transmitting requirements from the intake desk</p>
                    </div>

                    {submissions.length === 0 ? (
                      <div className={`p-12 text-center rounded-xl border border-dashed font-mono text-xs ${
                        theme === 'midnight' ? 'border-slate-800 text-slate-500' : 'border-[#E2E0D6] text-[#565B63]'
                      }`}>
                        <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No inquiries stored yet. Fill out the interactive scoping desk in the page layout to test transmission!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {submissions.map(sub => (
                          <div key={sub.id} className={`p-5 rounded-xl border ${
                            theme === 'midnight' ? 'bg-[#0E1117] border-slate-800' : 'bg-[#FCFBFA] border-[#E2E0D6]'
                          } space-y-3 relative`}>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 border-dashed border-[#E2E0D6]/40">
                              <div className="font-mono text-xs">
                                <span className="font-bold text-[#16191F] dark:text-[#F0F6FC]">{sub.name}</span>
                                <span className={`mx-2 text-slate-400`}>·</span>
                                <span className={textMuted}>{sub.email}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] text-slate-400">{sub.date}</span>
                                <button
                                  onClick={() => handleDeleteSubmission(sub.id)}
                                  className="text-red-500 hover:text-red-600 p-1.5 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Remove submission record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className={`font-mono text-xs leading-relaxed ${
                              theme === 'midnight' ? 'text-slate-300' : 'text-[#3E4249]'
                            } whitespace-pre-wrap`}>
                              {sub.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Bottom status indicator and notice */}
            <div className={`px-6 py-3 border-t flex items-center justify-between text-[11px] font-mono ${
              theme === 'midnight' ? 'bg-slate-900/50 border-slate-800' : 'bg-[#F2EFE8]/50 border-[#E2E0D6]'
            }`}>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sandbox administrator access authorized</span>
              </div>
              <div>
                <span>© 2026 lobos.dev control center</span>
              </div>
            </div>

          </motion.div>
          )}
          
          {/* Saved Notification toast overlay */}
          <AnimatePresence>
            {isSavedNotify && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-emerald-500 text-white px-4 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-lg z-50"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Settings saved and synced instantly!
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
}
