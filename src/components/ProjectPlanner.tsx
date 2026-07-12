'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PROPOSAL_MODULES } from '../data';
import { ProposalModule } from '../types';
import { Sparkles, Calendar, Receipt, ChevronRight, Copy, Check, Info } from 'lucide-react';

interface ProjectPlannerProps {
  onPreFillBrief: (briefText: string) => void;
}

export default function ProjectPlanner({ onPreFillBrief }: ProjectPlannerProps) {
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
    if (days <= 5) return { label: 'Lean Web Build', color: 'text-[#1DB954] bg-emerald-50 border-emerald-100' };
    if (days <= 12) return { label: 'Medium Business Portal', color: 'text-[#2036E8] bg-blue-50 border-blue-100' };
    if (days <= 22) return { label: 'Full-Stack Production SaaS', color: 'text-[#E8930C] bg-amber-50 border-amber-100' };
    return { label: 'Enterprise Operation Platform', color: 'text-purple-700 bg-purple-50 border-purple-100' };
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
    <div className="bg-white border border-[#E2E0D6] rounded-xl p-6 md:p-8 shadow-[0_12px_40px_rgba(22,25,31,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Selector Section (8 cols on lg) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-[#16191F] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2036E8]" />
            Interactive Scope Builder
          </h3>
          <p className="text-sm text-[#565B63] mt-1">
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
                    ? 'border-[#2036E8] bg-blue-50/20 shadow-sm'
                    : 'border-[#E2E0D6] hover:border-[#16191F] bg-[#FCFBFA]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // toggled by parent onClick
                  className="mt-1 accent-[#2036E8] w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-display font-bold text-sm text-[#16191F]">{module.title}</span>
                    <span className="font-mono text-xs text-[#2036E8] font-semibold">${module.basePrice}</span>
                  </div>
                  <p className="text-[12px] text-[#565B63] mt-1 leading-relaxed">{module.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Delivery speed picker */}
        <div className="bg-[#FBFAF6] p-4 rounded-lg border border-[#E2E0D6] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 max-w-md">
            <Info className="w-4 h-4 text-[#2036E8] shrink-0 mt-0.5" />
            <div>
              <span className="block font-semibold text-xs text-[#16191F]">DELIVERY SPEED</span>
              <p className="text-[11px] text-[#565B63] mt-0.5">Expedited applies high-priority sprint queues, cutting timelines by ~30% with a standard 35% crash-surcharge.</p>
            </div>
          </div>
          
          <div className="flex bg-[#E2E0D6]/40 p-1 rounded-lg relative">
            <button
              onClick={() => setSpeed('standard')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 cursor-pointer z-10 ${
                speed === 'standard' ? 'text-[#16191F]' : 'text-[#565B63] hover:text-[#16191F]'
              }`}
            >
              {speed === 'standard' && (
                <motion.span
                  layoutId="planner-speed-pill"
                  className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              Standard
            </button>
            <button
              onClick={() => setSpeed('expedited')}
              className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 cursor-pointer z-10 ${
                speed === 'expedited' ? 'text-white' : 'text-[#565B63] hover:text-[#16191F]'
              }`}
            >
              {speed === 'expedited' && (
                <motion.span
                  layoutId="planner-speed-pill"
                  className="absolute inset-0 bg-[#2036E8] rounded-md shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              ⚡ Fast-Track
            </button>
          </div>
        </div>
      </div>

      {/* Pricing / Outputs Section (5 cols on lg) */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-[#FCFBFA] border border-[#E2E0D6] rounded-lg p-6 lg:p-8">
        <div className="space-y-6">
          <div className="border-b border-[#E2E0D6] pb-4">
            <span className="text-[10px] font-mono text-[#565B63] uppercase tracking-wider block">Estimated Scope Stats</span>
            <div className={`mt-2 inline-flex items-center text-[11px] font-mono border px-2.5 py-1 rounded-full font-medium ${complexity.color}`}>
              {complexity.label}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#E2E0D6] p-4 rounded-lg">
              <div className="flex items-center gap-1 text-[#565B63] text-[11px] font-mono">
                <Receipt className="w-3.5 h-3.5 text-[#565B63]" />
                EST. BUDGET
              </div>
              <span className="block font-display font-bold text-lg text-[#16191F] mt-1">
                ${finalPrice.toLocaleString()}
              </span>
              <span className="text-[9px] text-[#9AA0A8] font-mono block mt-0.5">USD estimate</span>
            </div>

            <div className="bg-white border border-[#E2E0D6] p-4 rounded-lg">
              <div className="flex items-center gap-1 text-[#565B63] text-[11px] font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#565B63]" />
                TIMELINE
              </div>
              <span className="block font-display font-bold text-lg text-[#16191F] mt-1">
                ~{finalDays} days
              </span>
              <span className="text-[9px] text-[#9AA0A8] font-mono block mt-0.5">
                ~{Math.ceil(finalDays / 5)} weeks
              </span>
            </div>
          </div>

          {/* Module checklist summary */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#565B63] uppercase tracking-wider block">Scope Checklist</span>
            {selectedModules.length === 0 ? (
              <p className="text-xs text-[#9AA0A8] italic">No systems selected. Click modules on the left to estimate.</p>
            ) : (
              <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                {selectedModules.map(m => (
                  <div key={m.id} className="flex items-start gap-1.5 text-xs text-[#16191F]">
                    <span className="text-[#2036E8] mt-0.5 font-mono">✓</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action button triggers */}
        <div className="mt-8 pt-6 border-t border-[#E2E0D6] space-y-3">
          <motion.button
            whileHover={selectedIds.length === 0 ? {} : { scale: 1.02, y: -1 }}
            whileTap={selectedIds.length === 0 ? {} : { scale: 0.98 }}
            onClick={handlePrefill}
            disabled={selectedIds.length === 0}
            className={`w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
              selectedIds.length === 0
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
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
            className="w-full bg-white hover:bg-gray-50 border border-[#E2E0D6] py-2.5 rounded-full text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 cursor-pointer text-[#565B63] transition-all hover:border-[#16191F]"
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
