// Liveness check for scripts/smoke and for deploy probes. Touches no database.
export function GET() {
  return Response.json({ status: "ok" });
}
