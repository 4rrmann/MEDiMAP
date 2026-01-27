import fetch from "node-fetch";

const CLIENT_ID = "1e44b6f0-c8d7-4df5-823a-fe2dc6c1abb8_b1a05ca8-cf75-4104-aaff-ba585297e7a9";
const CLIENT_SECRET = "epiC00sV4kZiNC7faw9KIQQF5rv4pk10RoNDnBJzMho=";

export async function POST(req) {
  const { conceptMap } = await req.json();

  // 1. Get bearer token
  const tokenRes = await fetch("https://id.who.int/icd/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Failed to get access token" }), { status: 500 });
  }

  // 2. Send ConceptMap to WHO API
  const mapRes = await fetch("https://id.who.int/icd/release/11/tm2", {
    method: "POST",
    headers: {
      "Content-Type": "application/fhir+json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(conceptMap),
  });

  const mapData = await mapRes.json();
  return new Response(JSON.stringify(mapData), { status: mapRes.status });
}
