import { redirect } from "next/navigation";
import pool from "@/lib/db";

export default async function RedirectPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;

  const result = await pool.query("SELECT url FROM links WHERE code=$1", [
    code,
  ]);

  if (result.rowCount === 0) {
    return <div className="p-10 text-red-600">404 — Link not found</div>;
  }

  const url = result.rows[0].url;

  // update click stats
  await pool.query(
    "UPDATE links SET click_count = click_count + 1, last_clicked_at = NOW() WHERE code=$1",
    [code]
  );

  redirect(url);
}
