import { Project, Service, LogLine, ProposalModule } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'nmd-washing',
    year: '2025–26',
    name: 'NMD Pressure Washing',
    subtitle: 'Full business platform: booking, admin panel, client + employee portals, payments',
    stack: ['Next.js', 'Express', 'PostgreSQL', 'Tailwind', 'Stripe'],
    url: 'https://nmdpowash.com',
    isLive: true,
    description: 'An end-to-end custom CRM, portal, and dispatching platform. It powers NMD\'s entire operation, automating service scheduling, client reminders, automated invoices, and employee shift check-ins.',
    challenge: 'Managing multi-employee field schedules, processing deposits, and notifying clients of route arrival times was scattered across three disconnected legacy spreadsheets and slow personal text messages.',
    solution: 'Designed and deployed a centralized platform. Included a live calendar with route clustering, automatic client text message alerts via Twilio API, employee dashboard shift timesheets, and built-in Stripe payment collection.',
    result: 'Reduced administrative scheduling overhead by 65% within 30 days. Automated credit card authorization hold deposits cut client no-shows down to less than 1% annually.',
    keyFeatures: [
      'Interactive visual booking wizard with address auto-completion',
      'Dynamic dispatch scheduling panel for managing three concurrent field crews',
      'Automated SMS check-in & transit notifications',
      'Client secure portal for reviewing pricing estimates, photo approvals, and payments'
    ],
    architecture: {
      frontend: 'Next.js 14, Tailwind CSS, Lucide React icons',
      backend: 'Express (Node.js) with JSON Web Token session guards',
      database: 'PostgreSQL running on highly available RDS instance',
      infra: 'Dockerized ECS cluster backed by AWS CloudFront CDN caching'
    }
  },
  {
    id: 'leadmap',
    year: '2026',
    name: 'LeadMap',
    subtitle: 'SaaS that finds local businesses with no website, verified against live search data',
    stack: ['Next.js', 'Clerk', 'OpenStreetMap', 'Supabase', 'Node.js'],
    url: '#contact',
    isLive: true,
    description: 'A high-speed lead-gen product. It scrapes public registries and maps API directories to flag businesses with broken, outdated, or completely missing websites, outputting curated warm-leads lists.',
    challenge: 'Identifying local retail or trade businesses without web presence historically forced sales teams into hours of tedious, manual inspection of Google Maps profiles and slow cold outreach.',
    solution: 'Engineered an asynchronous scraper that cross-references OpenStreetMap business nodes in target cities, pings active URLs to check responsiveness and SSL configurations, and compiles reports.',
    result: 'Discovered over 420 web-absent prospective clients in the first 48 hours of live testing. Generates pre-vetted outbound lead lists with a verified 92% operational phone contact rate.',
    keyFeatures: [
      'Multi-threaded geographic scan queue covering US, UK, and CA cities',
      'Instant visual mapping of prospects styled with custom OSM tiles',
      'Automated SEO & Speed auditor analyzing identified websites',
      'CSV / Excel exportable reporting system for smooth CRM pipeline integration'
    ],
    architecture: {
      frontend: 'Next.js (App Router), Tailwind UI layouts',
      backend: 'Node.js scrapers with user-agent and proxy rotating pools',
      database: 'Supabase PostgreSQL with PostGIS extension for geo-indexing',
      infra: 'Vercel Serverless hosting, managed background Cron triggers'
    }
  },
  {
    id: 'agecalc',
    year: '2025',
    name: 'MyAgeCalculator',
    subtitle: '18-tool date platform, migrated from Vite to Next.js App Router for SEO',
    stack: ['Next.js', 'Firebase', 'Vercel', 'Tailwind'],
    url: '#contact',
    isLive: true,
    description: 'A suite of utility tools handling high-precision date math, pregnancy timeline calculators, biological age estimators, and milestone trackers. Fully optimized with next-gen dynamic SEO schemas.',
    challenge: 'A popular legacy Vite Single Page Application was losing significant search engine traffic due to zero static indexability, high Cumulative Layout Shift (CLS), and slow initial client-side rendering.',
    solution: 'Rebuilt and migrated the calculations architecture to Next.js App Router. Leveraged automated Server-Side Rendering (SSR), generated precise dynamic JSON-LD structured schema tags, and optimized asset delivery.',
    result: 'Lighthouse mobile performance scores jumped from 52 to 98. Organic search traffic grew by 240% over the subsequent three months, with zero layout shift.',
    keyFeatures: [
      '18 standalone high-precision calculator utilities with real-time feedback',
      'Dynamic JSON-LD structured data engine injecting schemas per calculation route',
      'Zero-CLS typography layouts using highly optimized font subsets',
      'Responsive interactive charts visualizing chronological milestones'
    ],
    architecture: {
      frontend: 'Next.js 15, Tailwind CSS, Recharts for visual progress',
      backend: 'Next.js Server Actions and edge API routes',
      database: 'Firebase Firestore for anonymous user state caching',
      infra: 'Vercel Edge, Next.js dynamic asset optimization'
    }
  },
  {
    id: 'nexus',
    year: '2025',
    name: 'Nexus Client Portal',
    subtitle: 'White-label client portal with billing, file sharing, and project tracking',
    stack: ['Next.js', 'Supabase', 'Stripe', 'Tailwind'],
    url: '#contact',
    isLive: false,
    description: 'A slick, responsive client-portal boilerplate bought and customized by agencies. Includes secure drag-and-drop secure file vaults, live milestones tracking, and Stripe meter-based subscription setups.',
    challenge: 'Off-the-shelf client platforms are costly, hard to custom-brand, and lock developer agencies out of direct integration with custom database workflows.',
    solution: 'Engineered a highly customizable white-label client portal boilerplate. Integrated Supabase Row-Level Security (RLS) for multi-tenant data safety, secure AWS S3 bucket file storage, and webhook-driven Stripe billing.',
    result: 'Adopted and deployed by 12 regional consulting and marketing agencies, coordinating over 2,000 active client deliverables with zero security incidents.',
    keyFeatures: [
      'Robust multi-role organization system (Owner, Client, Staff)',
      'Secure drag-and-drop file upload with pre-signed direct download URLs',
      'Interactive agile milestones tracker with visual timeline charts',
      'Stripe subscription portal with auto-synced PDF receipts'
    ],
    architecture: {
      frontend: 'Next.js App Router, Tailwind UI system',
      backend: 'Next.js Edge API routes with JWT token auth',
      database: 'Supabase PostgreSQL with full Row-Level Security policies',
      infra: 'Vercel serverless ecosystem, secure storage containers'
    }
  },
  {
    id: 'swiftcart',
    year: '2024',
    name: 'SwiftCart POS',
    subtitle: 'Real-time retail inventory and multi-register cashier dashboard',
    stack: ['React', 'Express', 'SQLite', 'WebSockets', 'Tailwind'],
    url: '#contact',
    isLive: false,
    description: 'A tablet-optimized local cashier application running on low-spec hardware. Fully operational offline, syncing cache securely via WebSocket buffers as soon as network is restored.',
    challenge: 'Unstable Wi-Fi connections in warehouse-style retail centers caused traditional POS browsers to freeze, locking up cashier registers and slowing checkout lanes.',
    solution: 'Developed an offline-first POS architecture utilizing local storage queues and RxJS buffers. Built a local state machine that writes instantly to an offline database and pushes transactions over WebSockets when online.',
    result: 'Ensured 100% continuous register checkout uptime. Eliminated mid-transaction network crashes and saved cashier operators an average of 4.5 system trouble-shooting hours monthly.',
    keyFeatures: [
      'Offline-first operational capability with automatic self-healing sync loops',
      'Ultra-fast product search indexing thousands of SKUs in under 5ms',
      'WebSocket active telemetry heartbeat and queue status dashboard',
      'Tablet gesture-optimized receipt builder and split-payment modal'
    ],
    architecture: {
      frontend: 'React, custom light Tailwind UI theme',
      backend: 'Express.js with Socket.io real-time websocket connections',
      database: 'SQLite local storage DB syncing with main PostgreSQL instance',
      infra: 'On-premise hardware Linux nodes with secure AWS backups'
    }
  }
];

export const SERVICES: Service[] = [
  {
    id: 'biz-apps',
    n: '01',
    title: 'Business web apps',
    description: 'Booking systems, admin panels, customer and staff portals. The software that runs your operation, built around how you actually work.'
  },
  {
    id: 'saas-builds',
    n: '02',
    title: 'SaaS builds',
    description: 'From data model to Stripe checkout. Auth, billing, dashboards, and the unglamorous edge cases that make a product feel finished.'
  },
  {
    id: 'sites-convert',
    n: '03',
    title: 'Sites that convert',
    description: 'Fast, search-optimized marketing sites with structured data, real Lighthouse scores, and copy aimed at booking the next job.'
  }
];

export const INITIAL_LOGS: LogLine[] = [
  { id: '1', time: '09:12', type: 'success', name: 'nmdpowash.com', note: 'booking platform · 3 portals · live', status: 'ok' },
  { id: '2', time: '11:47', type: 'success', name: 'leadmap.app', note: 'lead-gen SaaS · verified data · live', status: 'ok' },
  { id: '3', time: '14:03', type: 'success', name: 'myagecalculator.app', note: '18 tools · Next.js migration · live', status: 'ok' },
  { id: '4', time: '16:30', type: 'success', name: 'client-portal', note: 'Stripe billing · file vault · live', status: 'ok' },
  { id: '5', time: '18:55', type: 'pending', name: 'your-project.com', note: '', status: 'pending' }
];

export const PROPOSAL_MODULES: ProposalModule[] = [
  {
    id: 'core-web',
    title: 'Responsive Next.js Frontend',
    description: 'Custom Tailwind UI, accessible routing, optimized layout structures, and fluid animations.',
    baseDays: 5,
    basePrice: 1200,
    category: 'core'
  },
  {
    id: 'portal-auth',
    title: 'Multi-Role Auth & Portals',
    description: 'Secure user onboarding with unique Admin, Staff, and Client dashboards (via Clerk or Supabase Auth).',
    baseDays: 7,
    basePrice: 1800,
    category: 'core'
  },
  {
    id: 'payment-stripe',
    title: 'Stripe Billing & Subscriptions',
    description: 'Standard product checkout flows, multi-tier subscriptions, coupon managers, and customer portal invoices.',
    baseDays: 4,
    basePrice: 950,
    category: 'addon'
  },
  {
    id: 'database-sql',
    title: 'PostgreSQL Database & API Integration',
    description: 'Prisma/Drizzle ORM setup, optimized query indexing, robust server middleware, and error-safe RESTful API routes.',
    baseDays: 6,
    basePrice: 1500,
    category: 'core'
  },
  {
    id: 'file-sharing',
    title: 'Secure File Vault (S3/Supabase Storage)',
    description: 'Enables users to upload, preview, and download project files with pre-signed client download permissions.',
    baseDays: 3,
    basePrice: 700,
    category: 'addon'
  },
  {
    id: 'notifications',
    title: 'Email & WhatsApp Notifications',
    description: 'Automated booking confirmations, trigger-based status notifications, and monthly summaries via Twilio/Resend.',
    baseDays: 3,
    basePrice: 600,
    category: 'integration'
  },
  {
    id: 'seo-lighthouse',
    title: 'Speed & Lighthouse 95+ SEO Tuning',
    description: 'Advanced metadata schemas, absolute asset compression, dynamic site sitemaps, and near-zero cumulative layout shift (CLS).',
    baseDays: 2,
    basePrice: 500,
    category: 'addon'
  }
];
