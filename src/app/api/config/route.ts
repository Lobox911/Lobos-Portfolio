import { NextRequest, NextResponse } from 'next/server';
import { sql, initializeDatabase, resetDbInitialization } from '@/src/lib/db';

export async function GET() {
  if (!sql) {
    return NextResponse.json({ 
      connected: false,
      message: "DATABASE_URL environment variable is not configured. Falling back to local storage sandbox."
    });
  }

  try {
    await initializeDatabase();

    // Fetch hero config
    const heroResult = await sql`SELECT key, value FROM hero_config`;
    const hero: Record<string, string> = {};
    heroResult.forEach(row => {
      hero[row.key] = row.value;
    });

    // Fetch projects
    const projectsResult = await sql`
      SELECT id, year, name, subtitle, stack, url, is_live as "isLive", description, challenge, solution, result, architecture 
      FROM projects
    `;

    // Fetch services
    const servicesResult = await sql`
      SELECT id, n, title, description 
      FROM services 
      ORDER BY n ASC
    `;

    return NextResponse.json({
      connected: true,
      hero,
      projects: projectsResult,
      services: servicesResult
    });
  } catch (error: any) {
    console.error("GET config database error:", error);
    return NextResponse.json({ 
      connected: false, 
      error: error.message || String(error)
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action, data } = body;

    await initializeDatabase();

    if (action === 'saveHero') {
      const { badge, title, subtitle, description } = data;
      await sql`UPDATE hero_config SET value = ${badge} WHERE key = 'badge'`;
      await sql`UPDATE hero_config SET value = ${title} WHERE key = 'title'`;
      await sql`UPDATE hero_config SET value = ${subtitle} WHERE key = 'subtitle'`;
      await sql`UPDATE hero_config SET value = ${description} WHERE key = 'description'`;
      return NextResponse.json({ success: true });
    }

    if (action === 'saveProjects') {
      const projects = data; // Array of projects
      
      // Atomic deletion and re-insertion of the list to sync perfectly
      await sql.begin(async sqlTrans => {
        await sqlTrans`DELETE FROM projects`;
        for (const p of projects) {
          await sqlTrans`
            INSERT INTO projects (id, year, name, subtitle, stack, url, is_live, description, challenge, solution, result, architecture)
            VALUES (
              ${p.id}, 
              ${p.year}, 
              ${p.name}, 
              ${p.subtitle}, 
              ${p.stack || []}, 
              ${p.url}, 
              ${p.isLive || false}, 
              ${p.description || ''}, 
              ${p.challenge || ''}, 
              ${p.solution || ''}, 
              ${p.result || ''}, 
              ${JSON.stringify(p.architecture || {})}
            )
          `;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'saveServices') {
      const services = data; // Array of services
      await sql.begin(async sqlTrans => {
        await sqlTrans`DELETE FROM services`;
        for (const s of services) {
          await sqlTrans`
            INSERT INTO services (id, n, title, description)
            VALUES (${s.id}, ${s.n}, ${s.title}, ${s.description})
          `;
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'resetDefaults') {
      await sql.begin(async sqlTrans => {
        await sqlTrans`DELETE FROM hero_config`;
        await sqlTrans`DELETE FROM projects`;
        await sqlTrans`DELETE FROM services`;
      });
      // Force table re-seeding
      resetDbInitialization();
      await initializeDatabase();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action request" }, { status: 400 });
  } catch (error: any) {
    console.error("POST config database error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

