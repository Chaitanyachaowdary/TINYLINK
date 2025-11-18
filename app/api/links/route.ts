import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { url, code } = await request.json();
    const finalCode = code || generateRandomCode();

    const exists = await query("SELECT * FROM links WHERE code=$1", [finalCode]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }

    await query("INSERT INTO links (code, url) VALUES ($1, $2)", [finalCode, url]);

    return NextResponse.json({ code: finalCode, url }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await query("SELECT * FROM links ORDER BY created_at DESC");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
