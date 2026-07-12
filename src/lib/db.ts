import postgres from 'postgres';

// Lazily initialize connection so the server never crashes on startup if DATABASE_URL is missing or incorrect.
const connectionString = process.env.DATABASE_URL;

export const sql = connectionString 
  ? postgres(connectionString, { ssl: { rejectUnauthorized: false } }) 
  : null;

let isDbInitialized = false;

export function resetDbInitialization() {
  isDbInitialized = false;
}

export async function initializeDatabase() {
  if (!sql) return;
  if (isDbInitialized) return;

  try {
    // 1. Create hero_config table
    await sql`
      CREATE TABLE IF NOT EXISTS hero_config (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    // Seed hero_config if empty
    const heroCount = await sql`SELECT count(*) FROM hero_config`;
    if (parseInt(heroCount[0].count, 10) === 0) {
      await sql`
        INSERT INTO hero_config (key, value) VALUES
        ('badge', 'AVAILABLE FOR DEPLOYMENTS IN Q3 2026'),
        ('title', 'Ideas are cheap.'),
        ('subtitle', 'Shipped is everything.'),
        ('description', 'I''m Lobos, a full-stack developer who takes products from a rough brief to deployed, running, and paying for themselves. Client portals, booking systems, SaaS tools, all built end-to-end and maintained after launch.')
      `;
    }

    // 2. Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(100) PRIMARY KEY,
        year VARCHAR(20) NOT NULL,
        name VARCHAR(200) NOT NULL,
        subtitle TEXT NOT NULL,
        stack TEXT[] NOT NULL,
        url VARCHAR(255) NOT NULL,
        is_live BOOLEAN NOT NULL DEFAULT false,
        description TEXT NOT NULL,
        challenge TEXT,
        solution TEXT,
        result TEXT,
        architecture JSONB
      )
    `;

    // Seed projects if empty
    const projCount = await sql`SELECT count(*) FROM projects`;
    if (parseInt(projCount[0].count, 10) === 0) {
      const initialProjects = [
        {
          id: 'nmd-washing',
          year: '2025–26',
          name: 'NMD Pressure Washing',
          subtitle: 'Full business platform: booking, admin panel, client + employee portals, payments',
          stack: ['Next.js', 'Express', 'PostgreSQL', 'Tailwind', 'Stripe'],
          url: 'https://nmdpowash.com',
          is_live: true,
          description: 'An end-to-end custom CRM, portal, and dispatching platform. It powers NMD\'s entire operation, automating service scheduling, client reminders, automated invoices, and employee shift check-ins.',
          challenge: 'Managing multi-employee field schedules, processing deposits, and notifying clients of route arrival times was scattered across three disconnected legacy spreadsheets and slow personal text messages.',
          solution: 'Designed and deployed a centralized platform. Included a live calendar with route clustering, automatic client text message alerts via Twilio API, employee dashboard shift timesheets, and built-in Stripe payment collection.',
          result: 'Reduced administrative scheduling overhead by 65% within 30 days. Automated credit card authorization hold deposits cut client no-shows down to less than 1% annually.',
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
          is_live: true,
          description: 'A high-speed lead-gen product. It scrapes public registries and maps API directories to flag businesses with broken, outdated, or completely missing websites, outputting curated warm-leads lists.',
          challenge: 'Identifying local retail or trade businesses without web presence historically forced sales teams into hours of tedious, manual inspection of Google Maps profiles and slow cold outreach.',
          solution: 'Engineered an asynchronous scraper that cross-references OpenStreetMap business nodes in target cities, pings active URLs to check responsiveness and SSL configurations, and compiles reports.',
          result: 'Discovered over 420 web-absent prospective clients in the first 48 hours of live testing. Generates pre-vetted outbound lead lists with a verified 92% operational phone contact rate.',
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
          is_live: true,
          description: 'A suite of utility tools handling high-precision date math, pregnancy timeline calculators, biological age estimators, and milestone trackers. Fully optimized with next-gen dynamic SEO schemas.',
          challenge: 'A popular legacy Vite Single Page Application was losing significant search engine traffic due to zero static indexability, high Cumulative Layout Shift (CLS), and slow initial client-side rendering.',
          solution: 'Rebuilt and migrated the calculations architecture to Next.js App Router. Leveraged automated Server-Side Rendering (SSR), generated precise dynamic JSON-LD structured schema tags, and optimized asset delivery.',
          result: 'Lighthouse mobile performance scores jumped from 52 to 98. Organic search traffic grew by 240% over the subsequent three months, with zero layout shift.',
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
          is_live: false,
          description: 'A slick, responsive client-portal boilerplate bought and customized by agencies. Includes secure drag-and-drop secure file vaults, live milestones tracking, and Stripe meter-based subscription setups.',
          challenge: 'Off-the-shelf client platforms are costly, hard to custom-brand, and lock developer agencies out of direct integration with custom database workflows.',
          solution: 'Engineered a highly customizable white-label client portal boilerplate. Integrated Supabase Row-Level Security (RLS) for multi-tenant data safety, secure AWS S3 bucket file storage, and webhook-driven Stripe billing.',
          result: 'Adopted and deployed by 12 regional consulting and marketing agencies, coordinating over 2,000 active client deliverables with zero security incidents.',
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
          is_live: false,
          description: 'A tablet-optimized local cashier application running on low-spec hardware. Fully operational offline, syncing cache securely via WebSocket buffers as soon as network is restored.',
          challenge: 'Unstable Wi-Fi connections in warehouse-style retail centers caused traditional POS browsers to freeze, locking up cashier registers and slowing checkout lanes.',
          solution: 'Developed an offline-first POS architecture utilizing local storage queues and RxJS buffers. Built a local state machine that writes instantly to an offline database and pushes transactions over WebSockets when online.',
          result: 'Ensured 100% continuous register checkout uptime. Eliminated mid-transaction network crashes and saved cashier operators an average of 4.5 system trouble-shooting hours monthly.',
          architecture: {
            frontend: 'React, custom light Tailwind UI theme',
            backend: 'Express.js with Socket.io real-time websocket connections',
            database: 'SQLite local storage DB syncing with main PostgreSQL instance',
            infra: 'On-premise hardware Linux nodes with secure AWS backups'
          }
        }
      ];

      for (const p of initialProjects) {
        await sql`
          INSERT INTO projects (id, year, name, subtitle, stack, url, is_live, description, challenge, solution, result, architecture)
          VALUES (
            ${p.id}, 
            ${p.year}, 
            ${p.name}, 
            ${p.subtitle}, 
            ${p.stack}, 
            ${p.url}, 
            ${p.is_live}, 
            ${p.description}, 
            ${p.challenge}, 
            ${p.solution}, 
            ${p.result}, 
            ${JSON.stringify(p.architecture)}
          )
        `;
      }
    }

    // 3. Create services table
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        n VARCHAR(10) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL
      )
    `;

    // Seed services if empty
    const svcCount = await sql`SELECT count(*) FROM services`;
    if (parseInt(svcCount[0].count, 10) === 0) {
      await sql`
        INSERT INTO services (id, n, title, description) VALUES
        ('biz-apps', '01', 'Business web apps', 'Booking systems, admin panels, customer and staff portals. The software that runs your operation, built around how you actually work.'),
        ('saas-builds', '02', 'SaaS builds', 'From data model to Stripe checkout. Auth, billing, dashboards, and the unglamorous edge cases that make a product feel finished.'),
        ('sites-convert', '03', 'Sites that convert', 'Fast, search-optimized marketing sites with structured data, real Lighthouse scores, and copy aimed at booking the next job.')
      `;
    }

    // 4. Create submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        date VARCHAR(100) NOT NULL
      )
    `;

    isDbInitialized = true;
    console.log('Database tables verified and seeded successfully.');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    // Don't mark as initialized if failed
    throw error;
  }
}
