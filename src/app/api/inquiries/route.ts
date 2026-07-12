import { NextRequest, NextResponse } from 'next/server';
import { sql, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  if (!sql) {
    return NextResponse.json({ connected: false, submissions: [] });
  }

  try {
    await initializeDatabase();
    const result = await sql`
      SELECT id, name, email, message, date 
      FROM submissions 
      ORDER BY date DESC, id DESC
    `;
    return NextResponse.json({ connected: true, submissions: result });
  } catch (error: any) {
    console.error("GET inquiries database error:", error);
    return NextResponse.json({ connected: false, error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 400 });
  }

  try {
    const { name, email, message } = await req.json();
    await initializeDatabase();

    const id = Math.random().toString(36).substring(2, 9);
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    await sql`
      INSERT INTO submissions (id, name, email, message, date)
      VALUES (${id}, ${name}, ${email}, ${message}, ${date})
    `;

    return NextResponse.json({ success: true, submission: { id, name, email, message, date } });
  } catch (error: any) {
    console.error("POST inquiry database error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await initializeDatabase();
    await sql`DELETE FROM submissions WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE inquiry database error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
