"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all links
  async function fetchLinks() {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();

      if (Array.isArray(data)) {
        setLinks(data);
      } else {
        setLinks([]);
      }
    } catch (err) {
      console.error(err);
      setLinks([]);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  // Create link
  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setUrl("");
    setCode("");
    setLoading(false);
    fetchLinks();
  }

  // Delete link
  async function deleteLink(c: string) {
    await fetch(`/api/links/${c}`, { method: "DELETE" });
    fetchLinks();
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">TinyLink Dashboard</h1>

      {/* Add Link Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow mb-8">
        
        {/* Long URL */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Long URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
            autoComplete="off"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Custom Code */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Custom Code (optional)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="mydocs"
            autoComplete="off"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Short Link"}
        </button>
      </form>

      {/* Links Table */}
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">URL</th>
            <th className="p-3 text-left">Clicks</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(links) &&
            links.map((link: any) => (
              <tr key={link.code} className="border-b">
                <td className="p-3 font-semibold">{link.code}</td>
                <td className="p-3 truncate max-w-xs">{link.url}</td>
                <td className="p-3">{link.click_count}</td>

                <td className="p-3 space-x-3">
                  
                  {/* Copy Button */}
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${link.code}`
                      )
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Copy
                  </button>

                  {/* Stats Page */}
                  <Link
                    href={`/code/${link.code}`}
                    className="text-green-600 hover:underline"
                  >
                    Stats
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deleteLink(link.code)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {links.length === 0 && (
        <p className="mt-6 text-center text-gray-500">No links yet</p>
      )}
    </div>
  );
}
