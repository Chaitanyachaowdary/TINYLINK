import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET stats for one code
export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const result = await pool.query(
      "SELECT code, url, click_count, last_clicked_at, created_at FROM links WHERE code=$1",
      [code]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE link
export async function DELETE(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    const result = await pool.query("DELETE FROM links WHERE code=$1", [code]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
