'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LogLine } from '../types';
import { INITIAL_LOGS } from '../data';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Terminal, HelpCircle } from 'lucide-react';

export default function DeployLogConsole() {
  const [logs, setLogs] = useState<LogLine[]>(() => {
    // Return logs except we make the last one customizable
    return INITIAL_LOGS;
  });
  
  const [customDomain, setCustomDomain] = useState('');
  const [customBrief, setCustomBrief] = useState('My Custom App');
  const [customStatus, setCustomStatus] = useState<'success' | 'warning' | 'error'>('success');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [stdout, setStdout] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const deploymentSteps = [
    { text: 'Initializing build process...', delay: 400 },
    { text: 'Resolving lockfile and installing NPM packages...', delay: 700 },
    { text: 'Running TypeScript compiler & verifying type safety...', delay: 600 },
    { text: 'Bundling with Vite: chunks compiled successfully.', delay: 500 },
    { text: 'Configuring network routing & securing SSL credentials...', delay: 800 },
    { text: 'Deploying dockerized container to Cloud Run...', delay: 600 },
  ];

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stdout, isDeploying]);

  const handleStartDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeploying) return;
    
    const domain = customDomain.trim() || 'your-awesome-app.com';
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    setIsDeploying(true);
    setDeployStep(0);
    setStdout([`[SYSTEM] Starting production deployment run for: https://${cleanDomain}`]);

    let stepIdx = 0;
    
    const runNextStep = () => {
      if (stepIdx < deploymentSteps.length) {
        const step = deploymentSteps[stepIdx];
        setTimeout(() => {
          setStdout(prev => [
            ...prev, 
            `[STDOUT] ${step.text}`,
            stepIdx === 2 ? `[STDOUT] ✓ 0 TypeScript errors found.` : '',
            stepIdx === 3 ? `[STDOUT] dist/assets/index-B7f9a2.js   284.12 kB` : '',
            stepIdx === 4 ? `[STDOUT] SSL Provisioned via Let's Encrypt.` : ''
          ].filter(Boolean));
          
          setDeployStep(stepIdx + 1);
          stepIdx++;
          runNextStep();
        }, step.delay);
      } else {
        // Deployment finishing steps
        setTimeout(() => {
          if (customStatus === 'success') {
            setStdout(prev => [
              ...prev,
              `[SUCCESS] Deployed successfully to https://${cleanDomain} 🚀`,
              `[SYSTEM] DNS propagated. Cold-start response: 18ms.`
            ]);
            
            // Add to logs
            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const newLog: LogLine = {
              id: Date.now().toString(),
              time,
              type: 'success',
              name: cleanDomain,
              note: `${customBrief || 'Custom build'} · live`,
              status: 'ok'
            };
            
            // Insert before the last pending item
            setLogs(prev => {
              const updated = [...prev];
              // replace item with pending state or insert
              return [newLog, ...prev.filter(l => l.name !== cleanDomain)];
            });
          } else if (customStatus === 'warning') {
            setStdout(prev => [
              ...prev,
              `[WARNING] Deployed with warnings. Core checks passed.`,
              `[STDOUT] WARN: Cumulative Layout Shift (CLS) detected on mobile viewport.`,
              `[SUCCESS] Deployed to https://${cleanDomain} (Review performance)`
            ]);
            
            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const newLog: LogLine = {
              id: Date.now().toString(),
              time,
              type: 'success',
              name: cleanDomain,
              note: `${customBrief || 'Build'} · with warnings`,
              status: 'info'
            };
            setLogs(prev => [newLog, ...prev.filter(l => l.name !== cleanDomain)]);
          } else {
            setStdout(prev => [
              ...prev,
              `[ERROR] Build pipeline failed!`,
              `[STDOUT] ERROR: process.env.DATABASE_URL is missing. Connection refused.`,
              `[STDOUT] Deployment aborted.`
            ]);
          }
          setIsDeploying(false);
        }, 800);
      }
    };

    runNextStep();
  };

  const resetConsoleLogs = () => {
    setLogs(INITIAL_LOGS);
    setStdout([]);
    setCustomDomain('');
    setCustomBrief('My Custom App');
    setCustomStatus('success');
  };

  return (
    <div className="bg-white border border-[#E2E0D6] rounded-xl shadow-[0_24px_60px_-24px_rgba(22,25,31,0.14)] overflow-hidden font-sans">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#FBFAF6] border-b border-[#E2E0D6]">
        <div className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-[#F26D5F] block"></i>
          <i className="w-2.5 h-2.5 rounded-full bg-[#F5BE4F] block"></i>
          <i className="w-2.5 h-2.5 rounded-full bg-[#57C454] block"></i>
        </div>
        <span className="font-mono text-xs text-[#565B63] ml-2">deploy.log — simulator</span>
        {stdout.length > 0 && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetConsoleLogs}
            className="ml-auto flex items-center gap-1 text-[10px] text-red-500 font-mono border border-red-200 hover:bg-red-50 px-2 py-0.5 rounded cursor-pointer transition-colors"
            title="Reset to default logs"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: 0, duration: 0.5 }}
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </motion.div>
            Reset
          </motion.button>
        )}
      </div>

      <div className="p-4 bg-[#FCFBFA] border-b border-[#E2E0D6]">
        <form onSubmit={handleStartDeploy} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#565B63] mb-1">PROJECT DOMAIN</label>
              <input
                type="text"
                placeholder="your-company.com"
                value={customDomain}
                onChange={e => setCustomDomain(e.target.value)}
                disabled={isDeploying}
                className="w-full text-xs font-mono px-3 py-2 border border-[#E2E0D6] bg-white rounded-md text-[#16191F] placeholder-[#9AA0A8] focus:outline-none focus:border-[#2036E8] focus:ring-1 focus:ring-[#2036E8]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#565B63] mb-1">PROJECT SUMMARY</label>
              <input
                type="text"
                placeholder="booking SaaS, admin panel"
                value={customBrief}
                onChange={e => setCustomBrief(e.target.value)}
                disabled={isDeploying}
                className="w-full text-xs px-3 py-2 border border-[#E2E0D6] bg-white rounded-md text-[#16191F] placeholder-[#9AA0A8] focus:outline-none focus:border-[#2036E8] focus:ring-1 focus:ring-[#2036E8]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex gap-4 items-center">
              <span className="text-[11px] font-mono text-[#565B63]">TARGET OUTCOME:</span>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 text-xs text-[#565B63] cursor-pointer">
                  <input
                    type="radio"
                    name="deploy_outcome"
                    checked={customStatus === 'success'}
                    onChange={() => setCustomStatus('success')}
                    disabled={isDeploying}
                    className="accent-[#2036E8]"
                  />
                  Success
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[#565B63] cursor-pointer">
                  <input
                    type="radio"
                    name="deploy_outcome"
                    checked={customStatus === 'warning'}
                    onChange={() => setCustomStatus('warning')}
                    disabled={isDeploying}
                    className="accent-[#E8930C]"
                  />
                  Warning
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[#565B63] cursor-pointer">
                  <input
                    type="radio"
                    name="deploy_outcome"
                    checked={customStatus === 'error'}
                    onChange={() => setCustomStatus('error')}
                    disabled={isDeploying}
                    className="accent-[#F26D5F]"
                  />
                  Failure Error
                </label>
              </div>
            </div>

            <motion.button
              whileHover={isDeploying ? {} : { scale: 1.04, y: -1 }}
              whileTap={isDeploying ? {} : { scale: 0.96 }}
              type="submit"
              disabled={isDeploying}
              className={`flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded-full font-semibold transition-all shadow-sm cursor-pointer ${
                isDeploying
                  ? 'bg-gray-100 border border-gray-200 text-gray-400'
                  : 'bg-[#2036E8] text-white hover:bg-[#1626A8] hover:shadow-md'
              }`}
            >
              <Play className="w-3 h-3" />
              {isDeploying ? 'Deploying...' : 'Trigger Deploy'}
            </motion.button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-[#16191F] text-slate-300 font-mono text-[11px] leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar border-b border-[#2C303B]">
        {stdout.length === 0 ? (
          <div className="text-[#8B909A] italic flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#2036E8]" />
            <span>Interactive sandbox console. Run a custom project deploy to see terminal output.</span>
          </div>
        ) : (
          <div className="space-y-1">
            {stdout.map((line, index) => {
              let colorClass = 'text-slate-300';
              if (line.startsWith('[SUCCESS]')) colorClass = 'text-[#57C454] font-semibold';
              if (line.startsWith('[ERROR]')) colorClass = 'text-[#F26D5F] font-semibold';
              if (line.startsWith('[WARNING]')) colorClass = 'text-[#F5BE4F] font-semibold';
              if (line.startsWith('[SYSTEM]')) colorClass = 'text-[#3B82F6]';
              return (
                <div key={index} className={colorClass}>
                  {line}
                </div>
              );
            })}
            {isDeploying && (
              <div className="flex items-center gap-1.5 text-[#2036E8] animate-pulse">
                <span>▸ Deploy pipe running</span>
                <span className="w-1.5 h-3 bg-[#2036E8] inline-block animate-ping"></span>
              </div>
            )}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 space-y-2.5 max-h-[260px] overflow-y-auto">
        <div className="text-[11px] font-mono text-[#565B63] font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Active Registry Output</span>
          <span className="normal-case text-gray-400 text-[10px]">Real-time queue</span>
        </div>
        
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-start gap-4 py-2 border-b border-dashed border-[#E2E0D6] last:border-0 hover:bg-[#FDFDFB] px-1 rounded transition-colors">
            <div className="flex items-start gap-2.5">
              <span className="font-mono text-[11px] text-[#9AA0A8] mt-0.5">{log.time}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#16191F] font-mono">{log.name}</span>
                  {log.status === 'ok' && (
                    <span className="flex items-center text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-1.5 py-0.5 font-mono">
                      <CheckCircle className="w-2.5 h-2.5 mr-1" />
                      deployed
                    </span>
                  )}
                  {log.status === 'info' && (
                    <span className="flex items-center text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-1.5 py-0.5 font-mono">
                      <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                      warnings
                    </span>
                  )}
                  {log.status === 'pending' && (
                    <span className="flex items-center text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1 animate-pulse"></span>
                      pending
                    </span>
                  )}
                </div>
                {log.note && <p className="text-[11px] text-[#565B63] mt-0.5">{log.note}</p>}
              </div>
            </div>
            
            {log.status === 'ok' && (
              <a 
                href={log.name === 'nmdpowash.com' ? 'https://nmdpowash.com' : '#'}
                target={log.name === 'nmdpowash.com' ? '_blank' : '_self'}
                className="text-[11px] font-mono text-[#2036E8] hover:underline"
              >
                visit →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
