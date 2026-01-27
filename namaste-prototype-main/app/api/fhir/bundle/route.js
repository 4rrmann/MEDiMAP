import { NextResponse } from "next/server";

let latestBundle = null; // in-memory storage for demo

// GET -> return latest saved bundle
export async function GET() {
  if (!latestBundle) {
    return NextResponse.json({ message: "No bundle saved yet." });
  }
  return NextResponse.json(latestBundle);
}

// POST -> save new bundle
export async function POST(req) {
  try {
    const body = await req.json();
    latestBundle = body;
    return NextResponse.json({ status: "ok", saved: latestBundle });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload", details: error.message },
      { status: 400 }
    );
  }
}
