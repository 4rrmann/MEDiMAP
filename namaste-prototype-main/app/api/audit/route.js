// app/api/audit/route.js
let auditLogs = []; // simple in-memory store for prototype

export async function GET() {
  return new Response(JSON.stringify(auditLogs), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const log = await req.json();
  auditLogs.unshift(log); // prepend so latest is first
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
}
