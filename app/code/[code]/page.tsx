import Link from "next/link";

async function getStats(code: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function StatsPage({ params }: { params: { code: string } }) {
  const { code } = params;
  const link = await getStats(code);

  if (!link) {
    return <div className="p-10 text-red-600">Stats not found (404)</div>;
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Stats for: {link.code}</h1>

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

      <p className="mt-4 font-semibold">Original URL:</p>
      <p>{link.url}</p>

      <p className="mt-4 font-semibold">Total Clicks:</p>
      <p>{link.click_count}</p>

      <p className="mt-4 font-semibold">Last Clicked:</p>
      <p>{link.last_clicked_at || "Never"}</p>

      <p className="mt-4 font-semibold">Created At:</p>
      <p>{new Date(link.created_at).toLocaleString()}</p>

      <Link className="mt-6 text-blue-600 underline block" href="/">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
