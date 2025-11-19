import { NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";

// POST → Create short link
export async function POST(req: Request) {
  try {
    const { url, code } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fix URL formatting
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    // Validate URL format
    try {
      new URL(finalUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Trim & validate code
    let finalCode = code ? code.trim() : "";

    if (!finalCode) {
      // Auto generate 6-char code
      finalCode = crypto.randomBytes(4).toString("base64url").slice(0, 6);
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(finalCode)) {
      return NextResponse.json(
        { error: "Code must be 6-8 letters or numbers" },
        { status: 400 }
      );
    }

    // Check duplicate code
    const exists = await pool.query("SELECT code FROM links WHERE code = $1", [
      finalCode,
    ]);

    if (exists.rowCount > 0) {
      return NextResponse.json(
        { error: "This code already exists" },
        { status: 409 }
      );
    }

    // Save to DB
    await pool.query(
      "INSERT INTO links(code, url, click_count, created_at) VALUES($1, $2, 0, NOW())",
      [finalCode, finalUrl]
    );

    return NextResponse.json({ code: finalCode }, { status: 201 });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET → List all links
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT code, url, click_count, last_clicked_at, created_at FROM links ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
