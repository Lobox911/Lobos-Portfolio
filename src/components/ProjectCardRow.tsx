'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { 
  X, 
  Link as LinkIcon, 
  Hammer, 
  Terminal, 
  CheckCircle, 
  Server, 
  Database, 
  Cpu, 
  Play, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Layers, 
  Search, 
  Clock, 
  AlertTriangle,
  Award,
  ShieldCheck,
  Code,
  Calendar,
  Check,
  ChevronRight,
  Activity
} from 'lucide-react';

interface ProjectCardRowProps {
  project: Project;
  theme?: 'paper' | 'midnight';
  key?: string;
}

// ==========================================
// INTERACTIVE SIMULATION SUB-COMPONENTS
// ==========================================

// 1. NMD Pressure Washing - Dispatch & Twilio Simulator
function NmdSimulator() {
  const [selectedSlot, setSelectedSlot] = useState('Monday 10:00 AM');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setLogs([]);
    const steps = [
      `[SYSTEM] Init scheduling request for slot: ${selectedSlot}...`,
      `[DB] Acquiring row lock on slot_id NMD-2026-948...`,
      `[DB] Transaction lock established. Slot secured.`,
      `[SMS] Connecting to Twilio Gateway API...`,
      `[SMS] SMS confirmation dispatched to Client (+1-305-***-5829)`,
      `[STRIPE] Pre-authorizing deposit hold of $150.00... Success!`,
      `[DISPATCH] Crew #2 assigned. Route map clusters re-calculated.`,
      `[SUCCESS] System consistent. Dispatch complete.`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="bg-[#16191F] text-slate-100 rounded-xl p-4 font-mono text-xs border border-slate-850 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" /> booking_sync_v2.sh
        </span>
        <span className="text-[10px] text-slate-400">Live Simulation</span>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold">Select Booking Slot:</label>
        <div className="grid grid-cols-3 gap-2">
          {['Mon 10:00 AM', 'Tue 02:00 PM', 'Wed 09:00 AM'].map(slot => (
            <button
              key={slot}
              disabled={isSimulating}
              onClick={() => setSelectedSlot(slot)}
              className={`p-1.5 rounded text-center border text-[10px] transition-all cursor-pointer ${
                selectedSlot === slot 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={startSimulation}
        disabled={isSimulating}
        className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-sans text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Play className="w-3.5 h-3.5" /> 
        {isSimulating ? 'Processing Transact...' : 'Simulate API Dispatch'}
      </button>
      <div className="bg-slate-950 p-2.5 rounded border border-slate-900 h-32 overflow-y-auto space-y-1 font-mono text-[10px] text-emerald-400/90 leading-relaxed scrollbar-thin">
        {logs.length === 0 && (
          <span className="text-slate-500 italic">// Click button to dispatch booking engine...</span>
        )}
        {logs.map((log, index) => (
          <div key={index} className="animate-fadeIn">{log}</div>
        ))}
      </div>
    </div>
  );
}

// 2. LeadMap - OSM Scraper Simulator
function LeadMapSimulator() {
  const [city, setCity] = useState('Miami, FL');
  const [logs, setLogs] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);

  const startScrape = () => {
    setIsScraping(true);
    setLogs([]);
    const targets = [
      `[GEOLOCATE] Loading OpenStreetMap bounding box for "${city}"...`,
      `[QUERY] Found 8 matches under category "plumbing_repair"`,
      `[AUDIT] Target 1: Coral Gables Plumbers -> SSL check: VALID -> Web: 200 OK`,
      `[AUDIT] Target 2: Metro Rooter & Drain -> [CRITICAL: NO ACTIVE DOMAIN]`,
      `[AUDIT] Target 3: Sunshine Pipes -> Web: 301 Redirect -> mobile-friendly: FAIL`,
      `[AUDIT] Target 4: Magic City Leak Experts -> [CRITICAL: NO ACTIVE DOMAIN]`,
      `[SCRAPE] Compiling warm-leads contact telephone records...`,
      `[EXPORT] leadmap_export_${city.toLowerCase().replace(', ', '_')}.csv generated!`,
      `[SUCCESS] 2 web-absent businesses flagged for client sales funnel.`
    ];

    targets.forEach((log, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (idx === targets.length - 1) {
          setIsScraping(false);
        }
      }, (idx + 1) * 400);
    });
  };

  return (
    <div className="bg-[#16191F] text-slate-100 rounded-xl p-4 font-mono text-xs border border-slate-850 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-sky-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> osm_lead_scraper.py
        </span>
        <span className="text-[10px] text-slate-400">Live Simulation</span>
      </div>
      <div className="space-y-2">
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold">Select Region / Sector:</label>
        <div className="flex gap-2">
          <select
            value={city}
            disabled={isScraping}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded p-1 text-[10px] text-slate-300 font-mono outline-none focus:border-sky-500"
          >
            <option value="Miami, FL">Miami, FL (Plumbing)</option>
            <option value="Austin, TX">Austin, TX (Roofing)</option>
            <option value="London, UK">London, UK (Landscaping)</option>
          </select>
          <button
            onClick={startScrape}
            disabled={isScraping}
            className="px-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-sans font-extrabold text-[10px] rounded transition-colors cursor-pointer"
          >
            {isScraping ? 'Scraping...' : 'Scan Leads'}
          </button>
        </div>
      </div>
      <div className="bg-slate-950 p-2.5 rounded border border-slate-900 h-32 overflow-y-auto space-y-1 font-mono text-[10px] text-sky-400 leading-relaxed scrollbar-thin">
        {logs.length === 0 && (
          <span className="text-slate-500 italic">// Choose a city and launch lead map audit scanner...</span>
        )}
        {logs.map((log, index) => {
          let colorClass = 'text-sky-400';
          if (log.includes('[CRITICAL')) colorClass = 'text-rose-400 font-semibold';
          if (log.includes('[SUCCESS')) colorClass = 'text-emerald-400 font-bold';
          return (
            <div key={index} className={`animate-fadeIn ${colorClass}`}>{log}</div>
          );
        })}
      </div>
    </div>
  );
}

// 3. MyAgeCalculator - Chrono Millisecond Ticker & SEO Engine
function AgeCalcSimulator() {
  const [birthYear, setBirthYear] = useState(1995);
  const [age, setAge] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'ticker' | 'seo'>('ticker');

  useEffect(() => {
    const interval = setInterval(() => {
      const birthDate = new Date(`${birthYear}-07-09T00:00:00`);
      const now = new Date();
      const diffMs = now.getTime() - birthDate.getTime();
      const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
      setAge(ageInYears);
    }, 50);

    return () => clearInterval(interval);
  }, [birthYear]);

  const seoPayload = `{
  "@context": "https://schema.org",
  "@type": "Calculator",
  "name": "Dynamic Milestones Chrono Tracker",
  "url": "https://myagecalculator.app/chronology",
  "description": "Calculates astronomical age metrics and chronological pregnancy tracking",
  "inLanguage": "en",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "All"
}`;

  return (
    <div className="bg-[#16191F] text-slate-100 rounded-xl p-4 font-mono text-xs border border-slate-850 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-amber-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> age_chrono_worker.tsx
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setViewMode('ticker')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-sans font-bold cursor-pointer transition-colors ${
              viewMode === 'ticker' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Chrono Live
          </button>
          <button
            onClick={() => setViewMode('seo')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-sans font-bold cursor-pointer transition-colors ${
              viewMode === 'seo' ? 'bg-amber-400 text-black' : 'bg-slate-900 text-slate-400'
            }`}
          >
            SEO Payload
          </button>
        </div>
      </div>

      {viewMode === 'ticker' ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-sans font-semibold">Select Birth Year:</label>
            <div className="flex gap-1.5">
              {[1980, 1995, 2005].map(yr => (
                <button
                  key={yr}
                  onClick={() => setBirthYear(yr)}
                  className={`flex-1 py-1 rounded text-[10px] font-mono cursor-pointer transition-all ${
                    birthYear === yr 
                      ? 'bg-amber-400/20 border border-amber-400 text-amber-300' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-900 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans">Precision Age Ticker</span>
            <div className="text-base sm:text-lg font-bold text-amber-300 tabular-nums tracking-wide font-mono">
              {age.toFixed(9)}
            </div>
            <span className="text-[9px] text-amber-400/60 block font-mono">years old (rendering @ 60fps SSR)</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold block">Dynamic JSON-LD Injection Schema:</span>
          <pre className="bg-slate-950 p-2.5 rounded border border-slate-900 h-28 overflow-auto font-mono text-[9px] text-emerald-400 leading-tight">
            {seoPayload}
          </pre>
        </div>
      )}
    </div>
  );
}

// 4. Nexus Client Portal - Organization Sprint & Access Token Simulator
function NexusSimulator() {
  const [milestones, setMilestones] = useState([
    { id: '1', title: 'DB Schema & RLS Guards', completed: true },
    { id: '2', title: 'Configure S3 upload policies', completed: false },
    { id: '3', title: 'Stripe webhook listener', completed: false }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const toggleMilestone = (id: string) => {
    setMilestones(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextVal = !m.completed;
          if (nextVal) {
            setLogs(l => [`[CLIENT] Milestone "${m.title}" marked as COMPLETED.`, ...l]);
          } else {
            setLogs(l => [`[CLIENT] Milestone "${m.title}" toggled back to ACTIVE.`, ...l]);
          }
          return { ...m, completed: nextVal };
        }
        return m;
      })
    );
  };

  const generatePreSignedToken = () => {
    setIsAuthorizing(true);
    setLogs(l => ['[IAM] Generating pre-signed secure AWS S3 download token...', ...l]);
    setTimeout(() => {
      const token = `s3://vault-bucket/releases/file_hash_${Math.random().toString(16).substring(2, 10)}?X-Amz-Signature=8f5b8a`;
      setLogs(l => [
        `[IAM] Token authorized. Temporary access active (expires in 15m).`,
        `[HTTPS] Pre-signed URI: ${token}`,
        ...l
      ]);
      setIsAuthorizing(false);
    }, 700);
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="bg-[#16191F] text-slate-100 rounded-xl p-4 font-mono text-xs border border-slate-850 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-violet-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> client_gateway.go
        </span>
        <span className="text-[10px] text-slate-400">Active Blueprint</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-sans font-semibold">
          <span className="text-slate-400 uppercase tracking-wider">Milestone Progress:</span>
          <span className="text-violet-300 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
          <div 
            className="bg-violet-500 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="space-y-1.5 pt-1">
          {milestones.map(m => (
            <label key={m.id} className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded border border-slate-850 hover:border-slate-800 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() => toggleMilestone(m.id)}
                className="rounded border-slate-800 text-violet-600 focus:ring-violet-500 bg-slate-950 w-3.5 h-3.5 cursor-pointer"
              />
              <span className={`text-[10px] font-sans ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {m.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-1.5 flex gap-2">
        <button
          onClick={generatePreSignedToken}
          disabled={isAuthorizing}
          className="w-full py-1 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-800 text-white font-sans text-[10px] font-bold rounded transition-colors cursor-pointer"
        >
          {isAuthorizing ? 'Authorizing IAM...' : 'Create Pre-Signed S3 URL'}
        </button>
      </div>

      <div className="bg-slate-950 p-2 rounded border border-slate-900 h-20 overflow-y-auto space-y-1 font-mono text-[9px] text-violet-300 leading-tight scrollbar-thin">
        {logs.length === 0 && (
          <span className="text-slate-500 italic">// Toggle checkboxes above or trigger S3 bucket token auth...</span>
        )}
        {logs.map((log, index) => (
          <div key={index} className="animate-fadeIn">{log}</div>
        ))}
      </div>
    </div>
  );
}

// 5. SwiftCart POS - Offline Queue & Socket Sync Simulator
function SwiftCartSimulator() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [localQueue, setLocalQueue] = useState<{ id: string; name: string; price: number }[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addItem = (name: string, price: number) => {
    const newItem = { id: Math.random().toString(36).substring(2, 6), name, price };
    setLocalQueue(prev => [...prev, newItem]);
    
    if (offlineMode) {
      setLogs(l => [
        `[OFFLINE POS] Transaction queued in local SQLite storage cache buffer. Queue size: ${localQueue.length + 1}`,
        `[CACHE] Buffered: ${name} ($${price.toFixed(2)})`,
        ...l
      ]);
    } else {
      setLogs(l => [
        `[ONLINE POS] Pushed directly: ${name} ($${price.toFixed(2)}) -> 201 Created`,
        ...l
      ]);
    }
  };

  const handleReconnectSync = () => {
    if (localQueue.length === 0) {
      setLogs(l => ['[POS] No transactions in cache buffer. Sync queue empty.', ...l]);
      setOfflineMode(false);
      return;
    }

    setIsSyncing(true);
    setLogs(l => ['[SOCKET] Re-establishing Socket.io channel on port 3000...', ...l]);
    
    setTimeout(() => {
      setLogs(l => [
        `[SOCKET] Handshake established. Syncing ${localQueue.length} transactions from SQLite offline queue...`,
        ...l
      ]);
      
      setTimeout(() => {
        localQueue.forEach((item, idx) => {
          setTimeout(() => {
            setLogs(l => [
              `[SYNC] SQLite transaction #${item.id} (${item.name}) committed to Cloud PostgreSQL -> SUCCESS`,
              ...l
            ]);
            
            if (idx === localQueue.length - 1) {
              setLocalQueue([]);
              setIsSyncing(false);
              setOfflineMode(false);
              setLogs(l => [
                `[SUCCESS] Sync loop resolved. local cache queue clear. State consistent.`,
                ...l
              ]);
            }
          }, (idx + 1) * 350);
        });
      }, 700);
    }, 600);
  };

  return (
    <div className="bg-[#16191F] text-slate-100 rounded-xl p-4 font-mono text-xs border border-slate-850 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-rose-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> cashier_sync.js
        </span>
        <div className="flex items-center gap-1.5">
          {offlineMode ? (
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 px-1.5 py-0.5 rounded text-[8px] flex items-center gap-1 font-bold">
              <WifiOff className="w-2.5 h-2.5 animate-pulse" /> OFFLINE BUFFER
            </span>
          ) : (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[8px] flex items-center gap-1 font-bold">
              <Wifi className="w-2.5 h-2.5" /> ONLINE ACTIVE
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans font-semibold block">POS Cashier Sandbox:</span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => addItem('Commercial Hose', 149.00)}
            disabled={isSyncing}
            className="py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded text-[9px] cursor-pointer"
          >
            + Hose ($149)
          </button>
          <button
            onClick={() => addItem('Brass Fitting', 24.50)}
            disabled={isSyncing}
            className="py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded text-[9px] cursor-pointer"
          >
            + Fitting ($24)
          </button>
        </div>
      </div>

      <div className="pt-0.5">
        {offlineMode ? (
          <button
            onClick={handleReconnectSync}
            disabled={isSyncing}
            className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white font-sans text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /> 
            {isSyncing ? 'Re-syncing SQLite Cache...' : 'Restore Connection & Sync Logs'}
          </button>
        ) : (
          <button
            onClick={() => {
              setOfflineMode(true);
              setLogs(l => ['[SYSTEM] WAN Connection dropped intentionally for testing offline state...', ...l]);
            }}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-sans text-[10px] font-bold rounded transition-colors cursor-pointer"
          >
            Drop Internet Connection
          </button>
        )}
      </div>

      <div className="bg-slate-950 p-2 rounded border border-slate-900 h-24 overflow-y-auto space-y-1 font-mono text-[9px] text-rose-300 leading-tight scrollbar-thin">
        {logs.length === 0 && (
          <span className="text-slate-500 italic">// Click POS items to simulate sales queue under offline context...</span>
        )}
        {logs.map((log, index) => {
          let c = 'text-rose-300';
          if (log.includes('[SYNC]')) c = 'text-amber-300';
          if (log.includes('[SUCCESS]')) c = 'text-emerald-400 font-bold';
          if (log.includes('[ONLINE')) c = 'text-emerald-300';
          return (
            <div key={index} className="animate-fadeIn">{log}</div>
          );
        })}
      </div>
    </div>
  );
}

interface TimelineStep {
  phase: string;
  title: string;
  desc: string;
  date: string;
  deliverables: string[];
  techUsed: string[];
}

function getTimelineSteps(projectId: string): TimelineStep[] {
  switch (projectId) {
    case 'nmd-washing':
      return [
        { 
          phase: '01', 
          title: 'Scoping & Architecture', 
          desc: 'Defined relational schemas, dispatcher rules, client alerts, and multi-tenant structures.', 
          date: 'Week 1-2', 
          deliverables: ['Database ER Diagrams', 'PostgreSQL Schema Blueprints', 'API Routing Sheets'],
          techUsed: ['PostgreSQL', 'Drizzle ORM', 'TypeScript']
        },
        { 
          phase: '02', 
          title: 'SMS & Calendaring Core', 
          desc: 'Constructed responsive calendar grids, booking slots, and background transactional SMS relays.', 
          date: 'Week 3-4', 
          deliverables: ['Twilio Dispatch Router', 'Optimistic Locking Engine', 'Interactive Booking Grid'],
          techUsed: ['Twilio SMS API', 'React Calendar Hooks', 'Express']
        },
        { 
          phase: '03', 
          title: 'Stripe Security Holds', 
          desc: 'Implemented escrow pre-authorizations to prevent lost crew revenue from sudden slot cancellations.', 
          date: 'Week 5', 
          deliverables: ['Escrow Hold Controller', 'Refund/Capture Automations', 'Client Transaction Ledger'],
          techUsed: ['Stripe Elements', 'Stripe Webhooks', 'Node Crypto']
        },
        { 
          phase: '04', 
          title: 'AWS Containerized Launch', 
          desc: 'Containerized services, established load balancers, and configured performance alerting suites.', 
          date: 'Week 6', 
          deliverables: ['Docker Release Staging', 'Cloudflare Proxy Config', 'Live Latency Checkers'],
          techUsed: ['Docker', 'AWS ECS', 'Cloudflare CDN']
        },
      ];
    case 'leadmap':
      return [
        { 
          phase: '01', 
          title: 'Coordinate Grid Scans', 
          desc: 'Linked latitude/longitude queries to target boundary filters, establishing location polygon lookups.', 
          date: 'Week 1', 
          deliverables: ['Bounding Box Calculators', 'OSM Node Filters', 'Coordinate Geo-Coder'],
          techUsed: ['OpenStreetMap API', 'Overpass Turbo', 'LeafletJS']
        },
        { 
          phase: '02', 
          title: 'Proxy Rotation Arrays', 
          desc: 'Built parallel crawling handlers featuring automated proxy shifting to secure consistent scan cycles.', 
          date: 'Week 2-3', 
          deliverables: ['Header Masking Matrix', 'Queue Throttle Regulators', 'Automatic Failure Retries'],
          techUsed: ['Node Cluster', 'Axios Stream Routing', 'Puppeteer']
        },
        { 
          phase: '03', 
          title: 'SSL & Domain Auditing', 
          desc: 'Built custom diagnostic parsing checking SSL certificates and mobile readability markers on target leads.', 
          date: 'Week 4', 
          deliverables: ['SSL Validation Script', 'Viewport Parser Worker', 'Broken Link Crawler'],
          techUsed: ['Cheerio HTML Parser', 'TLS Handshake Client', 'Node HTTPS']
        },
        { 
          phase: '04', 
          title: 'Pipeline Map Dashboard', 
          desc: 'Assembled interactive geo-location pins, sales funnel cards, and full CSV/Excel export tools.', 
          date: 'Week 5', 
          deliverables: ['Excel Streaming Exporter', 'Mapbox Marker Clusters', 'Sales Funnel Board'],
          techUsed: ['ExcelJS', 'Tailwind Grid Layout', 'React Leaflet']
        },
      ];
    case 'agecalc':
      return [
        { 
          phase: '01', 
          title: 'CLS & Hydration Diagnostics', 
          desc: 'Audited cumulative layout shifts and JavaScript load bottlenecks present on static browser layouts.', 
          date: 'Week 1', 
          deliverables: ['Lighthouse Audits Summary', 'Asset Chunk Diagnostics', 'Viewport Layout Checks'],
          techUsed: ['Google Lighthouse', 'Chrome DevTools Protocol']
        },
        { 
          phase: '02', 
          title: 'Next.js 15 Server Migration', 
          desc: 'Migrated math routines into dynamic server-first components, eliminating layout reflow latency.', 
          date: 'Week 2', 
          deliverables: ['Server Calculations Module', 'Hydration Sync Handlers', 'Static Assets Reductions'],
          techUsed: ['Next.js App Router', 'React Server Components', 'Vite Bundler']
        },
        { 
          phase: '03', 
          title: 'SEO Structured schemas', 
          desc: 'Injected JSON-LD structural descriptors across all route branches to aid parsing algorithms.', 
          date: 'Week 3', 
          deliverables: ['JSON-LD Micro-data Injector', 'OpenGraph Dynamic Tags', 'Sitemap Automation Tool'],
          techUsed: ['Schema.org Standards', 'React Helmet Async', 'Metadata Headers']
        },
        { 
          phase: '04', 
          title: 'Edge Route Caching', 
          desc: 'Deployed cache routines on edge centers globally, dropping initial paint down to zero.', 
          date: 'Week 4', 
          deliverables: ['Edge Static CDN Config', 'Brotli Compression Pipelines', 'Assets Minification Script'],
          techUsed: ['Vercel Edge Network', 'Cloudflare Cache Layers', 'Terser Compiler']
        },
      ];
    case 'nexus':
      return [
        { 
          phase: '01', 
          title: 'PostgreSQL RLS Guard Rails', 
          desc: 'Coded Row-Level Security rules to isolate corporate files, client records, and tenant logs.', 
          date: 'Week 1-2', 
          deliverables: ['RLS Security Matrix', 'JWT Credentials Decoder', 'Tenant Integration Tests'],
          techUsed: ['Supabase DB', 'PostgreSQL Policies', 'Jest']
        },
        { 
          phase: '02', 
          title: 'Presigned S3 Cloud Vaults', 
          desc: 'Configured credentialed file upload handlers keeping client reports fully secure at rest.', 
          date: 'Week 3', 
          deliverables: ['S3 Secure URL Presigner', 'File Metadata Scanner', 'Upload Stream Interceptor'],
          techUsed: ['AWS SDK S3', 'Node Crypto Wrapper', 'Multer Storage']
        },
        { 
          phase: '03', 
          title: 'Usage & Invoicing webhooks', 
          desc: 'Engineered automatic subscription gates and plan limits mapped directly to Stripe customer accounts.', 
          date: 'Week 4', 
          deliverables: ['Billing Webhook Middleware', 'Pricing Plan Gatekeepers', 'Usage Log Summarizers'],
          techUsed: ['Stripe SDK', 'Express Router', 'Redis Keys']
        },
        { 
          phase: '04', 
          title: 'Agency Beta Rollout', 
          desc: 'Released private sandboxes to 12 target design agencies to document active user behaviors.', 
          date: 'Week 5-6', 
          deliverables: ['Sentry Performance Bounds', 'GCP Run Deployment Script', 'Feedback Ticketing System'],
          techUsed: ['Sentry Monitoring', 'Google Cloud Run', 'GitHub Actions']
        },
      ];
    case 'swiftcart':
      return [
        { 
          phase: '01', 
          title: 'Local SQLite Schemas', 
          desc: 'Assembled relational structures to record checkout orders inside tablet caches in real time.', 
          date: 'Week 1', 
          deliverables: ['Relational SQLite Layout', 'WASM Client DB Wrapper', 'Transaction Buffer Table'],
          techUsed: ['SQLite WASM', 'SQL.js Driver', 'IndexedDB']
        },
        { 
          phase: '02', 
          title: 'RxJS Heartbeat syncs', 
          desc: 'Engineered WebSocket message queues that self-heal connections and sync back-logged sales.', 
          date: 'Week 2-3', 
          deliverables: ['WebSocket Ping Relays', 'SQLite Sync Core Workers', 'Conflict Resolvers'],
          techUsed: ['Socket.io client', 'RxJS Observables', 'Node Cluster']
        },
        { 
          phase: '03', 
          title: 'Virtual POS Screen Panels', 
          desc: 'Customized layout sheets to handle fast cashier commands and bulky product lists.', 
          date: 'Week 4', 
          deliverables: ['Virtualized Item Grid', 'Numpad Keyboard Overlay', 'Fast Search Filters'],
          techUsed: ['Tailwind Grid Engine', 'React Virtual Window', 'CSS Touch Target Rules']
        },
        { 
          phase: '04', 
          title: 'Hardware Terminal Mounts', 
          desc: 'Deployed native packages onto store registers, wiring system updates to main cloud tables.', 
          date: 'Week 5', 
          deliverables: ['Electron CJS Bundles', 'Printer Drivers Wrapper', 'Log Syncing Cron'],
          techUsed: ['Electron Wrapper', 'POS ESC/POS Printing', 'Linux Daemon Scripts']
        },
      ];
    default:
      return [
        { 
          phase: '01', 
          title: 'Design & Blueprints', 
          desc: 'Drafted architecture models, entity schemas, and visual mockups.', 
          date: 'Week 1', 
          deliverables: ['Figma System Designs', 'API Blueprint Specs', 'User-Flow Map'],
          techUsed: ['Figma', 'Markdown Blueprints', 'Excalidraw']
        },
        { 
          phase: '02', 
          title: 'Core Development', 
          desc: 'Constructed interface sheets, state managers, and logic routers.', 
          date: 'Week 2-3', 
          deliverables: ['React App Framework', 'Redux State Modules', 'UI Component Suite'],
          techUsed: ['React', 'TypeScript', 'Tailwind CSS']
        },
        { 
          phase: '03', 
          title: 'Integration Staging', 
          desc: 'Wired backend APIs, connected databases, and executed tests.', 
          date: 'Week 4', 
          deliverables: ['Integration Spec Reports', 'Data Migration Scripts', 'Performance Audits'],
          techUsed: ['Node.js', 'PostgreSQL', 'Jest']
        },
        { 
          phase: '04', 
          title: 'Release & Automation', 
          desc: 'Set up automatic cloud deployments and system health monitoring.', 
          date: 'Week 5', 
          deliverables: ['CI/CD Workflow Config', 'Docker Deployment Files', 'System Health Alerting'],
          techUsed: ['Docker', 'GitHub Actions', 'Vercel']
        },
      ];
  }
}

// Helper to pick the appropriate simulator based on project id
function ProjectSimulationRouter({ projectId }: { projectId: string }) {
  switch (projectId) {
    case 'nmd-washing':
      return <NmdSimulator />;
    case 'leadmap':
      return <LeadMapSimulator />;
    case 'agecalc':
      return <AgeCalcSimulator />;
    case 'nexus':
      return <NexusSimulator />;
    case 'swiftcart':
      return <SwiftCartSimulator />;
    default:
      return null;
  }
}

// ==========================================
// CORE PROJECT COMPONENT & MODAL
// ==========================================

export default function ProjectCardRow({ project, theme = 'paper' }: ProjectCardRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  // Load intersection observer scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Sync modal view lock to disable main page scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const openModal = (e: React.MouseEvent) => {
    // Avoid double trigger
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 1. Main Project Table Row Item */}
      <div
        ref={domRef}
        onClick={openModal}
        className={`border-b border-[#E2E0D6] last:border-b-0 font-sans transform transition-all duration-700 ease-out cursor-pointer ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${
          theme === 'midnight' 
            ? 'border-slate-800/80 hover:bg-slate-900/40' 
            : 'hover:bg-white'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-4 md:px-6 select-none transition-all duration-300">
          
          {/* Year Column */}
          <span className={`md:col-span-2 font-mono text-xs ${
            theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
          }`}>
            {project.year}
          </span>

          {/* Name & Subtitle Column */}
          <div className="md:col-span-6 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {project.isLive && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_rgba(29,185,84,0.6)] animate-pulse inline-block" title="Live in production"></span>
              )}
              <span className={`font-display font-bold text-base md:text-lg tracking-tight ${
                theme === 'midnight' ? 'text-white' : 'text-[#16191F]'
              }`}>
                {project.name}
              </span>
            </div>
            <p className={`text-sm ${
              theme === 'midnight' ? 'text-slate-300/90' : 'text-[#565B63]'
            }`}>
              {project.subtitle}
            </p>
          </div>

          {/* Stack Tags Column */}
          <div className="md:col-span-3 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full border ${
                  theme === 'midnight' 
                    ? 'border-slate-800 bg-slate-900 text-slate-300' 
                    : 'border-[#E2E0D6] bg-white text-[#565B63]'
                }`}
              >
                {tag}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                theme === 'midnight'
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                  : 'border-[#E2E0D6] bg-[#FBFAF6] text-[#2036E8]'
              }`}>
                +{project.stack.length - 3} more
              </span>
            )}
          </div>

          {/* Interactive Trigger Button */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={openModal}
              className={`font-mono text-xs font-bold px-3 py-1 rounded border transition-all duration-300 cursor-pointer ${
                theme === 'midnight'
                  ? 'border-slate-800 hover:border-emerald-400 hover:text-emerald-400 bg-slate-950/40 text-slate-300'
                  : 'border-[#E2E0D6] hover:border-[#16191F] hover:bg-slate-100 text-[#2036E8]'
              }`}
            >
              Case Study →
            </button>
          </div>

        </div>
      </div>

      {/* 2. Immersive Full-Screen Project Deep-Dive Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 transition-opacity duration-300 animate-fadeIn"
          onClick={() => closeModal()}
        >
          <div 
            className={`w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col md:flex-row transition-transform duration-300 scale-100 max-h-[90vh] md:max-h-[85vh] animate-slideUp text-left ${
              theme === 'midnight' 
                ? 'bg-[#161B22] border-slate-800 text-[#F0F6FC]' 
                : 'bg-[#FCFBFA] border-[#D2CFBE] text-[#16191F]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Body: Two-Column Info-dense layout */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E0D6] dark:divide-slate-800">
              
              {/* LEFT COLUMN: Case Study Narrative (60% width on desktop) */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                
                {/* Header Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] tracking-widest font-extrabold uppercase ${
                      theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
                    }`}>
                      // PROJECT DEEP-DIVE ({project.year})
                    </span>
                    <button 
                      onClick={() => closeModal()}
                      className={`p-1 rounded-full transition-colors ${
                        theme === 'midnight' ? 'hover:bg-slate-850 text-slate-400 hover:text-white' : 'hover:bg-gray-150 text-slate-600 hover:text-black'
                      }`}
                      aria-label="Close Case Study"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
                      {project.name}
                    </h2>
                    {project.isLive && (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                        LIVE IN PRODUCTION
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'midnight' ? 'text-slate-300' : 'text-[#3E4249]'
                  }`}>
                    {project.subtitle}
                  </p>
                </div>

                {/* Challenge Block */}
                <div className={`p-4 sm:p-5 rounded-xl border space-y-2 ${
                  theme === 'midnight'
                    ? 'bg-slate-900/40 border-slate-800 text-slate-200'
                    : 'bg-[#16191F]/5 border-[#16191F]/10 text-[#16191F]'
                }`}>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500/90" /> The Operational Challenge
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {project.challenge || 'Client faced fragmented operations with offline manual logs, blocking growth and slowing deployment speed.'}
                  </p>
                </div>

                {/* Solution Block */}
                <div className="space-y-2">
                  <h3 className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-400">
                    The Engineered Solution
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'midnight' ? 'text-slate-300' : 'text-[#3E4249]'
                  }`}>
                    {project.solution || 'Re-architected the system onto Next.js App Router for server capabilities, integrated transaction safety layers, and automated remote cloud deployment queues.'}
                  </p>
                </div>

                {/* Development Lifecycle Timeline */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Development Lifecycle Timeline
                    </h3>
                    <span className="font-mono text-[9px] text-slate-400 hidden sm:inline-block">
                      Click phases to inspect artifacts
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-4 ${
                    theme === 'midnight' 
                      ? 'bg-slate-900/40 border-slate-800' 
                      : 'bg-[#FBFAF9] border-[#E2E0D6]'
                  }`}>
                    
                    {/* Step bar indicator */}
                    <div className="relative flex items-center justify-between px-1.5 pb-2">
                      {/* Background connecting line */}
                      <div className={`absolute left-4 right-4 h-0.5 top-4 -translate-y-1/2 z-0 ${
                        theme === 'midnight' ? 'bg-slate-800' : 'bg-[#E2E0D6]'
                      }`} />
                      {/* Active progress line */}
                      <div 
                        className={`absolute left-4 h-0.5 top-4 -translate-y-1/2 z-0 transition-all duration-300 ${
                          theme === 'midnight' ? 'bg-emerald-500' : 'bg-[#2036E8]'
                        }`}
                        style={{ width: `${(activePhaseIndex / 3) * 100}%` }}
                      />
                      
                      {getTimelineSteps(project.id).map((step, idx) => {
                        const isCompleted = idx <= activePhaseIndex;
                        const isActive = idx === activePhaseIndex;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActivePhaseIndex(idx)}
                            className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                          >
                            {/* Phase Node Circle */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs font-bold transition-all duration-300 ${
                              isActive
                                ? theme === 'midnight'
                                  ? 'bg-emerald-500 text-black border-emerald-500 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                  : 'bg-[#2036E8] text-white border-[#2036E8] scale-110 shadow-md'
                                : isCompleted
                                  ? theme === 'midnight'
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                                    : 'bg-[#2036E8]/10 border-[#2036E8] text-[#2036E8]'
                                  : theme === 'midnight'
                                    ? 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                    : 'bg-white border-[#E2E0D6] text-slate-400 hover:border-slate-400'
                            }`}>
                              {step.phase}
                            </div>
                            {/* Phase Miniature Title (desktop only or abbreviated) */}
                            <span className="text-[9px] mt-1 font-mono tracking-tighter text-slate-400 font-bold max-w-[64px] text-center truncate">
                              {step.title.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Phase Info card */}
                    {(() => {
                      const activeStep = getTimelineSteps(project.id)[activePhaseIndex];
                      if (!activeStep) return null;
                      return (
                        <div className="pt-2 border-t border-slate-800/20 dark:border-slate-800/60 space-y-3 animate-fadeIn">
                          {/* Phase Header */}
                          <div className="flex items-start justify-between gap-2 border-b border-dashed border-slate-800/10 dark:border-slate-800/40 pb-2">
                            <div>
                              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                                Phase {activeStep.phase} / {activeStep.date}
                              </span>
                              <h4 className={`text-xs sm:text-sm font-bold font-display ${theme === 'midnight' ? 'text-white' : 'text-slate-900'}`}>
                                {activeStep.title}
                              </h4>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold flex items-center gap-1 shrink-0 ${
                              theme === 'midnight'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-[#2036E8]/10 text-[#2036E8] border border-[#2036E8]/20'
                            }`}>
                              <Check className="w-2.5 h-2.5" /> COMPLETED
                            </span>
                          </div>

                          {/* Description */}
                          <p className={`text-xs leading-relaxed ${theme === 'midnight' ? 'text-slate-300' : 'text-slate-600'}`}>
                            {activeStep.desc}
                          </p>

                          {/* Deliverables & Technologies Dual Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Deliverables List */}
                            <div className="space-y-1.5">
                              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                                Key Deliverables:
                              </span>
                              <ul className="space-y-1">
                                {activeStep.deliverables.map((item, i) => (
                                  <li key={i} className={`flex items-center gap-1.5 text-[10px] ${
                                    theme === 'midnight' ? 'text-slate-300' : 'text-[#3E4249]'
                                  }`}>
                                    <span className={`w-1 h-1 rounded-full shrink-0 ${
                                      theme === 'midnight' ? 'bg-emerald-400' : 'bg-[#2036E8]'
                                    }`}></span>
                                    <span className="truncate" title={item}>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Tech Badges List */}
                            <div className="space-y-1.5">
                              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                                Technologies Used:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {activeStep.techUsed.map((tech, i) => (
                                  <span 
                                    key={i} 
                                    className={`font-mono text-[8px] px-1.5 py-0.5 rounded border ${
                                      theme === 'midnight'
                                        ? 'border-slate-800 bg-slate-950 text-slate-400'
                                        : 'border-slate-200 bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Results Card */}
                <div className={`p-4 sm:p-5 rounded-xl border flex gap-3.5 items-start ${
                  theme === 'midnight'
                    ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-200'
                    : 'bg-[#16191F] border-[#16191F] text-[#FCFBFA] shadow-sm'
                }`}>
                  <Award className={`w-5 h-5 shrink-0 mt-0.5 ${
                    theme === 'midnight' ? 'text-emerald-400' : 'text-amber-300'
                  }`} />
                  <div className="space-y-1.5">
                    <h3 className={`font-mono text-[10px] font-black uppercase tracking-wider ${
                      theme === 'midnight' ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      Measurable Business Result
                    </h3>
                    <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                      theme === 'midnight' ? '' : 'text-[#FCFBFA]'
                    }`}>
                      {project.result || 'Achieved high uptime, optimized core web vital speed scores, and cut down dispatch cycle overhead by 65%.'}
                    </p>
                  </div>
                </div>

                {/* Full Stack tags */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Complete Core Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className={`font-mono text-[10px] px-2.5 py-1 rounded border font-semibold ${
                          theme === 'midnight' 
                            ? 'border-slate-800 bg-slate-900/60 text-slate-200' 
                            : 'border-[#E2E0D6] bg-white text-[#16191F]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Technical Blueprint & Interactive Simulation Sandbox (40% width on desktop) */}
              <div className={`lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between ${
                theme === 'midnight' ? 'bg-[#0E1117]/60' : 'bg-[#FAF9F6]'
              }`}>
                
                {/* Sandbox Header */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className={`font-mono text-[10px] tracking-widest font-extrabold uppercase block ${
                      theme === 'midnight' ? 'text-emerald-400' : 'text-[#2036E8]'
                    }`}>
                      // INTERACTIVE CODE SIMULATOR
                    </span>
                    <p className={`text-[11px] leading-relaxed ${
                      theme === 'midnight' ? 'text-slate-400' : 'text-[#565B63]'
                    }`}>
                      Interact with the live state machine built specifically for the <strong className="font-semibold text-slate-300">{project.name}</strong> stack architecture:
                    </p>
                  </div>

                  {/* Simulator Router */}
                  <ProjectSimulationRouter projectId={project.id} />
                </div>

                {/* Architecture Spec Sheets */}
                <div className="space-y-4 pt-4 border-t border-dashed border-[#E2E0D6] dark:border-slate-850">
                  <span className="text-[10px] font-mono text-[#565B63] dark:text-slate-400 uppercase tracking-wider block font-bold">
                    System Architecture Specs
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Frontend Ecosystem</span>
                      <span className={`font-semibold block ${theme === 'midnight' ? 'text-white' : 'text-slate-800'}`}>
                        {project.architecture?.frontend || 'Next.js, Tailwind CSS'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Backend Service</span>
                      <span className={`font-semibold block ${theme === 'midnight' ? 'text-white' : 'text-slate-800'}`}>
                        {project.architecture?.backend || 'REST Actions / Edge Workers'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Database Store</span>
                      <span className={`font-semibold block ${theme === 'midnight' ? 'text-white' : 'text-slate-800'}`}>
                        {project.architecture?.database || 'PostgreSQL'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Infrastructure</span>
                      <span className={`font-semibold block ${theme === 'midnight' ? 'text-white' : 'text-slate-800'}`}>
                        {project.architecture?.infra || 'Vercel Secure Edge'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* External Action Row */}
                <div className="pt-4 border-t border-[#E2E0D6] dark:border-slate-850 flex items-center justify-between gap-4">
                  {project.url !== '#contact' ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-[#2036E8] text-white hover:bg-[#1a2dbd] dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-black font-sans font-extrabold text-xs rounded transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Visit Live Platform
                    </a>
                  ) : (
                    <a
                      href="#contact"
                      onClick={() => closeModal()}
                      className="flex-1 text-center py-2 bg-[#16191F] text-white hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-sans font-extrabold rounded transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Hire Me for This Stack
                    </a>
                  )}
                  <button
                    onClick={() => closeModal()}
                    className={`px-4 py-2 border text-xs font-sans font-bold rounded transition-colors cursor-pointer ${
                      theme === 'midnight'
                        ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                        : 'border-[#E2E0D6] text-slate-600 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    Close
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
