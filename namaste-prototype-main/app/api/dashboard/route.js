import { NextResponse } from "next/server";
import dataset from "../../data/namaste_icd.json";

export async function GET() {
  const totalTerminologies = dataset.length;

  const mapped = dataset.filter((d) => d.tm2Code && d.tm2Code.trim() !== "");
  const mappingCoverage = Math.round(
    (mapped.length / totalTerminologies) * 100
  );

  const ayushSystems = [...new Set(dataset.map((d) => d.ayushSystem))];

  return NextResponse.json({
    totalTerminologies,
    mappingCoverage,
    ayushSystems,
    fhirEndpoints: 15,
    uptime: "99.9%",
    securityEvents: 0,
  });
}
