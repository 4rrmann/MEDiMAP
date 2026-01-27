import { NextResponse } from "next/server";
import dataset from "../../data/namaste_icd.json";

function stripHtmlFromObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripHtmlFromObject);
  } else if (typeof obj === "object" && obj !== null) {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = stripHtmlFromObject(obj[key]);
    }
    return cleaned;
  } else if (typeof obj === "string") {
    return obj.replace(/<[^>]*><em>/g , ""); // remove <em>, <span>, etc.
  }
  return obj;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const query = q.toLowerCase();

    const results = dataset
      .filter((item) => {
        return (
          item.namasteCode?.toLowerCase() === query ||
          item.namasteTerm?.toLowerCase().includes(query) ||
          item.tm2Code?.toLowerCase() === query ||
          item.tm2Disorder?.toLowerCase().includes(query)
        );
      })
      .map((item) => stripHtmlFromObject(item)); // 🧹 clean everything

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Terminology API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
