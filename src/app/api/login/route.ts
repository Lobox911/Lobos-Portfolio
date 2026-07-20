import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const systemPassword = process.env.ADMIN_PASSWORD || 'admin';

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
