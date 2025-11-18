import { query } from "@/lib/db";

export default async function StatsPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;

  const result = await query("SELECT * FROM links WHERE code = $1", [code]);

  if (result.rows.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold">404 — Link Not Found</h1>
      </div>
    );
  }

  const link = result.rows[0];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-5">Stats for: {link.code}</h1>

      <div className="mb-4">
  <p className="font-semibold">Short URL:</p>
  <a
    href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`}
    target="_blank"
    className="text-blue-600 underline break-all"
  >
    {`${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`}
  </a>
</div>


      <div className="mb-4">
        <p className="font-semibold">Original URL:</p>
        <p className="break-all">{link.url}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Total Clicks:</p>
        <p>{link.click_count}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Last Clicked:</p>
        <p>
          {link.last_clicked_at
            ? new Date(link.last_clicked_at).toLocaleString()
            : "Never"}
        </p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Created At:</p>
        <p>{new Date(link.created_at).toLocaleString()}</p>
      </div>

      <a href="/" className="text-blue-600 hover:underline inline-block mt-4">
        ← Back to Dashboard
      </a>
    </div>
  );
}
