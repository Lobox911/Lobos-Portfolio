'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PROPOSAL_MODULES } from '../data';
import { ProposalModule } from '../types';
import { Sparkles, Calendar, Receipt, ChevronRight, Copy, Check, Info } from 'lucide-react';

interface ProjectPlannerProps {
  onPreFillBrief: (briefText: string) => void;
  theme?: 'paper' | 'midnight';
}

export default function ProjectPlanner({ onPreFillBrief, theme = 'paper' }: ProjectPlannerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(['core-web', 'database-sql']);
  const [speed, setSpeed] = useState<'standard' | 'expedited'>('standard');
  const [copied, setCopied] = useState(false);

  const toggleModule = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectedModules = PROPOSAL_MODULES.filter(m => selectedIds.includes(m.id));

  // Calculations
  const basePriceSum = selectedModules.reduce((acc, m) => acc + m.basePrice, 0);
  const baseDaysSum = selectedModules.reduce((acc, m) => acc + m.baseDays, 0);

  // Speed adjustments
  const finalPrice = speed === 'expedited' ? Math.round(basePriceSum * 1.35) : basePriceSum;
  const finalDays = speed === 'expedited' ? Math.round(baseDaysSum * 0.7) : baseDaysSum;

  const getComplexity = (days: number) => {
    if (days <= 5) {
      return {
        label: 'Lean Web Build',
        color: theme === 'midnight'
          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          : 'text-[#1DB954] bg-emerald-50 border-emerald-100'
      };
    }
    if (days <= 12) {
      return {
        label: 'Medium Business Portal',
        color: theme === 'midnight'
          ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
          : 'text-[#2036E8] bg-blue-50 border-blue-100'
      };
    }
    if (days <= 22) {
      return {
        label: 'Full-Stack Production SaaS',
        color: theme === 'midnight'
          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
          : 'text-[#E8930C] bg-amber-50 border-amber-100'
      };
    }
    return {
      label: 'Enterprise Operation Platform',
      color: theme === 'midnight'
        ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
        : 'text-purple-700 bg-purple-50 border-purple-100'
    };
  };

  const complexity = getComplexity(finalDays);

  const generateBriefMarkdown = () => {
    const list = selectedModules.map(m => `- ${m.title} (${m.description})`).join('\n');
    const delivery = speed === 'expedited' ? 'Expedited (Fast-track)' : 'Standard Delivery';
    return `### Custom Lobos.dev Brief\n\n**Modules Selected:**\n${list}\n\n**Est. Timeline:** ~${finalDays} business days (${delivery})\n**Complexity Tier:** ${complexity.label}\n**Calculated Budget Est:** $${finalPrice.toLocaleString()}`;
  };

  const handleCopyBrief = () => {
    const text = generateBriefMarkdown();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrefill = () => {
    const summaryText = `Hey Lobos! I calculated my project scope on your planner.
I want to build a project with these modules:
${selectedModules.map(m => ` - ${m.title}`).join('\n')}

Speed: ${speed === 'expedited' ? 'Expedited Delivery' : 'Standard Delivery'}
Estimate: $${finalPrice.toLocaleString()} in ~${finalDays} business days.`;
    
    onPreFillBrief(summaryText);
    
    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`border p-6 md:p-8 rounded-xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans ${
      theme === 'midnight'
        ? 'bg-slate-900/40 border-slate-800'
        : 'bg-white border-[#E2E0D6] shadow-[0_12px_40px_rgba(22,25,31,0.06)]'
    }`}>
      
      {/* Selector Section (8 cols on lg) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h3 className={`font-display font-bold text-lg flex items-center gap-2 ${
            theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
          }`}>
            <Sparkles className={`w-5 h-5 ${theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'}`} />
            Interactive Scope Builder
          </h3>
          <p className={`text-sm mt-1 ${theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'}`}>
            Build your ideal stack and watch the timeline and pricing adjust automatically. Select the systems you need:
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-3">
          {PROPOSAL_MODULES.map(module => {
            const isSelected = selectedIds.includes(module.id);
            return (
              <motion.div
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
                key={module.id}
                onClick={() => toggleModule(module.id)}
                className={`border p-4 rounded-lg cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isSelected
                    ? theme === 'midnight'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                      : 'border-[#2036E8] bg-blue-50/20 shadow-sm'
                    : theme === 'midnight'
                      ? 'border-slate-800 bg-slate-900/20 hover:border-slate-700 text-slate-300'
                      : 'border-[#E2E0D6] hover:border-[#16191F] bg-[#FCFBFA]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // toggled by parent onClick
                  className={`mt-1 w-4 h-4 cursor-pointer ${
                    theme === 'midnight' ? 'accent-emerald-400' : 'accent-[#2036E8]'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className={`font-display font-bold text-sm ${
                      theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
                    }`}>{module.title}</span>
                    <span className={`font-mono text-xs font-semibold ${
                      theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
                    }`}>${module.basePrice}</span>
                  </div>
                  <p className={`text-[12px] mt-1 leading-relaxed ${
                    theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
                  }`}>{module.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Delivery speed picker */}
        <div className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4 ${
          theme === 'midnight' ? 'bg-slate-950 border-slate-800' : 'bg-[#FBFAF6] border-[#E2E0D6]'
        }`}>
          <div className="flex items-start gap-2.5 max-w-md">
            <Info className={`w-4 h-4 shrink-0 mt-0.5 ${
              theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
            }`} />
            <div>
              <span className={`block font-semibold text-xs ${
                theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
              }`}>DELIVERY SPEED</span>
              <p className={`text-[11px] mt-0.5 ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>Expedited applies high-priority sprint queues, cutting timelines by ~30% with a standard 35% crash-surcharge.</p>
            </div>
          </div>
          
          <div className={`p-1 rounded-lg relative flex ${
            theme === 'midnight' ? 'bg-slate-900 border border-slate-800' : 'bg-[#E2E0D6]/40'
          }`}>
            <button
              onClick={() => setSpeed('standard')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 cursor-pointer z-10 ${
                speed === 'standard' 
                  ? theme === 'midnight' ? 'text-slate-950' : 'text-[#16191F]' 
                  : theme === 'midnight' ? 'text-slate-400 hover:text-slate-200' : 'text-[#565B63] hover:text-[#16191F]'
              }`}
            >
              {speed === 'standard' && (
                <motion.span
                  layoutId="planner-speed-pill"
                  className={`absolute inset-0 rounded-md shadow-sm -z-10 ${
                    theme === 'midnight' ? 'bg-emerald-400' : 'bg-white'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              Standard
            </button>
            <button
              onClick={() => setSpeed('expedited')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 cursor-pointer z-10 ${
                speed === 'expedited' 
                  ? 'text-white' 
                  : theme === 'midnight' ? 'text-slate-400 hover:text-slate-200' : 'text-[#565B63] hover:text-[#16191F]'
              }`}
            >
              {speed === 'expedited' && (
                <motion.span
                  layoutId="planner-speed-pill"
                  className={`absolute inset-0 rounded-md shadow-sm -z-10 ${
                    theme === 'midnight' ? 'bg-indigo-600' : 'bg-[#2036E8]'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              ⚡ Fast-Track
            </button>
          </div>
        </div>
      </div>

      {/* Pricing / Outputs Section (5 cols on lg) */}
      <div className={`lg:col-span-5 flex flex-col justify-between border rounded-lg p-6 lg:p-8 ${
        theme === 'midnight' ? 'bg-slate-950 border-slate-800' : 'bg-[#FCFBFA] border-[#E2E0D6]'
      }`}>
        <div className="space-y-6">
          <div className={`border-b pb-4 ${
            theme === 'midnight' ? 'border-slate-800' : 'border-[#E2E0D6]'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              theme === 'midnight' ? 'text-slate-500' : 'text-[#565B63]'
            }`}>Estimated Scope Stats</span>
            <div className={`mt-2 inline-flex items-center text-[11px] font-mono border px-2.5 py-1 rounded-full font-medium ${complexity.color}`}>
              {complexity.label}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`border p-4 rounded-lg ${
              theme === 'midnight' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E2E0D6]'
            }`}>
              <div className={`flex items-center gap-1 text-[11px] font-mono ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>
                <Receipt className="w-3.5 h-3.5" />
                EST. BUDGET
              </div>
              <span className={`block font-display font-bold text-lg mt-1 ${
                theme === 'midnight' ? 'text-emerald-400' : 'text-[#16191F]'
              }`}>
                ${finalPrice.toLocaleString()}
              </span>
              <span className="text-[9px] text-[#9AA0A8] font-mono block mt-0.5">USD estimate</span>
            </div>

            <div className={`border p-4 rounded-lg ${
              theme === 'midnight' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#E2E0D6]'
            }`}>
              <div className={`flex items-center gap-1 text-[11px] font-mono ${
                theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                TIMELINE
              </div>
              <span className={`block font-display font-bold text-lg mt-1 ${
                theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
              }`}>
                ~{finalDays} days
              </span>
              <span className="text-[9px] text-[#9AA0A8] font-mono block mt-0.5">
                ~{Math.ceil(finalDays / 5)} weeks
              </span>
            </div>
          </div>

          {/* Module checklist summary */}
          <div className="space-y-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              theme === 'midnight' ? 'text-slate-500' : 'text-[#565B63]'
            }`}>Scope Checklist</span>
            {selectedModules.length === 0 ? (
              <p className="text-xs text-[#9AA0A8] italic">No systems selected. Click modules on the left to estimate.</p>
            ) : (
              <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                {selectedModules.map(m => (
                  <div key={m.id} className={`flex items-start gap-1.5 text-xs ${
                    theme === 'midnight' ? 'text-slate-300' : 'text-[#16191F]'
                  }`}>
                    <span className={`${theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'} mt-0.5 font-mono`}>✓</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action button triggers */}
        <div className={`mt-8 pt-6 border-t space-y-3 ${
          theme === 'midnight' ? 'border-slate-800' : 'border-[#E2E0D6]'
        }`}>
          <motion.button
            whileHover={selectedIds.length === 0 ? {} : { scale: 1.02, y: -1 }}
            whileTap={selectedIds.length === 0 ? {} : { scale: 0.98 }}
            onClick={handlePrefill}
            disabled={selectedIds.length === 0}
            className={`w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
              selectedIds.length === 0
                ? theme === 'midnight' 
                  ? 'bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : theme === 'midnight'
                  ? 'bg-emerald-500 text-black font-bold hover:bg-emerald-400 hover:shadow-md'
                  : 'bg-[#2036E8] text-white hover:bg-[#1626A8] hover:shadow-md'
            }`}
          >
            Apply to Project Brief
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
          
          <motion.button
            whileHover={selectedIds.length === 0 ? {} : { scale: 1.02, y: -1 }}
            whileTap={selectedIds.length === 0 ? {} : { scale: 0.98 }}
            onClick={handleCopyBrief}
            disabled={selectedIds.length === 0}
            className={`w-full py-2.5 rounded-full text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              theme === 'midnight'
                ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                : 'bg-white hover:bg-gray-50 border border-[#E2E0D6] text-[#565B63] hover:border-[#16191F]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Copied Brief Markdown!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Structured Brief MD
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
