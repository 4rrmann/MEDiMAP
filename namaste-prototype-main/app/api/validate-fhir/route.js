import { NextResponse } from "next/server";

const VALIDATOR_URL = "https://hapi.fhir.org/baseR4/Bundle/$validate";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(VALIDATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/fhir+json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      // If response is not JSON, return raw text
      return NextResponse.json({ error: "Non-JSON response", raw: text });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
