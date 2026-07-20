import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    let systemPassword = (process.env.ADMIN_PASSWORD || 'Lobos1745').trim();
    
    // Strip wrapping double or single quotes if present
    if (systemPassword.startsWith('"') && systemPassword.endsWith('"')) {
      systemPassword = systemPassword.slice(1, -1);
    } else if (systemPassword.startsWith("'") && systemPassword.endsWith("'")) {
      systemPassword = systemPassword.slice(1, -1);
    }

    console.log("DEBUG LOGIN: resolved systemPassword =", JSON.stringify(systemPassword), "input =", JSON.stringify(password));

    if (!password) {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 });
    }

    if (password === systemPassword) {
      return NextResponse.json({
        success: true,
        token: "lobos-admin-secure-token-2026",
        message: "Successfully logged in as administrator"
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Incorrect administrator password"
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
