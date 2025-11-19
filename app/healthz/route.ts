export function GET() {
  return Response.json({
    ok: true,
    version: "1.0",
    uptime: process.uptime(),
  });
}
