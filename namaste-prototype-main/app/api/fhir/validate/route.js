import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Call HL7 official validator (or your local validator JAR)
    const res = await fetch(
      "https://hapi.fhir.org/baseR4/Bundle/$validate", // <-- official HAPI FHIR test server
      {
        method: "POST",
        headers: { "Content-Type": "application/fhir+json" },
        body: JSON.stringify(body),
      }
    );

    const validation = await res.json();
    return NextResponse.json(validation);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
