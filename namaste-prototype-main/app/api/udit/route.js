import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.timestamp) {
      body.timestamp = new Date().toISOString();
    }

    // Define audit logs file path (in project root for simplicity)
    const filePath = path.join(process.cwd(), "audit-logs.json");

    // Read existing logs
    let logs = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      logs = JSON.parse(data);
    }

    // Add new log
    logs.push(body);

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

    return new Response(JSON.stringify({ success: true, log: body }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Audit log error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
