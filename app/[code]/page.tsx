import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export default async function RedirectPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;

  // Ignore system folders
  if (
    code === "api" ||
    code === "_next" ||
    code === "favicon.ico" ||
    code === "stats"
  ) {
    return null;
  }

  // Fetch link from database
  const result = await query("SELECT * FROM links WHERE code = $1", [code]);

  // If not found: show error
  if (result.rows.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold">404 — Link Not Found</h1>
      </div>
    );
  }

  const link = result.rows[0];

  // Update click count (non-blocking)
  query(
    "UPDATE links SET click_count = click_count + 1, last_clicked_at = NOW() WHERE code = $1",
    [code]
  );

  // Ensure URL has http or https
  const finalUrl = link.url.startsWith("http")
    ? link.url
    : `https://${link.url}`;

  // Redirect
  redirect(finalUrl);
}
