"use client";

import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import conceptMap from "../data/namaste_icd11_tm2_conceptmap.json";

// Audit log function
function logSearchEvent({ page, query, codeFilter, systemFilter, resultsCount, clickedCode = null, clickedDisplay = null }) {
  const logData = {
    page,
    query,
    codeFilter,
    systemFilter,
    resultsCount,
    clickedCode,
    clickedDisplay,
    timestamp: new Date().toISOString(),
  };

  fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData),
  }).catch((err) => console.error("Audit log error:", err));
}

// Highlight matching text
function highlightMatches(text, matches, key) {
  if (!matches || matches.length === 0) return text;
  const match = matches.find((m) => m.key === key);
  if (!match) return text;

  let lastIndex = 0;
  const parts = [];

  match.indices.forEach(([start, end]) => {
    if (lastIndex < start) parts.push(text.slice(lastIndex, start));
    parts.push(
      <span key={start} className="bg-yellow-200 font-semibold">
        {text.slice(start, end + 1)}
      </span>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function TerminologySearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [codeFilter, setCodeFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");

  // Flatten the ConceptMap
  const flattenedData = conceptMap.group.flatMap((g) =>
    g.element.map((el) => {
      const shortDefinition = el.extension?.find((ex) => ex.url.includes("shortDefinition"))?.valueString || "";
      const longDefinition = el.extension?.find((ex) => ex.url.includes("longDefinition"))?.valueString || "";
      const ayushSystem = el.extension?.find((ex) => ex.url.includes("ayushSystem"))?.valueString || "";

      const targets = el.target || [];
      const tm2 = targets.find((t) => t.equivalence === "equivalent") || targets[0];
      const icd11 = targets.length > 1 ? targets[1] : targets[0];

      return {
        namasteCode: el.code || "N/A",
        namasteDisplay: el.display || "N/A",
        tm2Code: tm2?.code || "N/A",
        tm2Display: tm2?.display || "N/A",
        icd11Code: icd11?.code || "N/A",
        icd11Display: icd11?.display || "N/A",
        shortDefinition,
        longDefinition,
        ayushSystem,
      };
    })
  );

  // Initialize Fuse
  useEffect(() => {
    setFuse(
      new Fuse(flattenedData, {
        includeScore: true,
        includeMatches: true,
        threshold: 0.4,
        keys: [
          "namasteCode",
          "namasteDisplay",
          "tm2Code",
          "tm2Display",
          "icd11Code",
          "icd11Display",
          "shortDefinition",
          "longDefinition",
          "ayushSystem",
        ],
      })
    );
  }, []);

  // Perform search & log audit
  useEffect(() => {
    if (!fuse) return;

    let searchKeys;
    if (codeFilter === "namaste") searchKeys = ["namasteCode", "namasteDisplay"];
    else if (codeFilter === "tm2") searchKeys = ["tm2Code", "tm2Display"];
    else if (codeFilter === "icd11") searchKeys = ["icd11Code", "icd11Display"];
    else searchKeys = [
      "namasteCode",
      "namasteDisplay",
      "tm2Code",
      "tm2Display",
      "icd11Code",
      "icd11Display",
      "shortDefinition",
      "longDefinition",
      "ayushSystem",
    ];

    const fuseInstance = new Fuse(flattenedData, {
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
      keys: searchKeys,
    });

    let searchResults = query
      ? fuseInstance.search(query)
      : flattenedData.map((item) => ({ item, matches: [] }));

    if (systemFilter !== "all") {
      searchResults = searchResults.filter((r) => (r.item || r).ayushSystem === systemFilter);
    }

    setResults(searchResults);

    if (query) {
      logSearchEvent({
        page: "terminology",
        query,
        codeFilter,
        systemFilter,
        resultsCount: searchResults.length,
      });
    }
  }, [query, codeFilter, systemFilter]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-4xl sm:text-5xl font-semibold text-blue-600 mb-6">
        Terminology Search
      </h1>

      {/* Search Box */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-[70%]">
        <input
          className="border p-2 rounded flex-1 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search NAMASTE / TM2 / ICD-11 / disease name / description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mt-4 w-full sm:w-[70%]">
        <select className="border p-2 rounded" value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)}>
          <option value="all">All Codes</option>
          <option value="namaste">NAMASTE Code</option>
          <option value="tm2">TM2 Code</option>
          <option value="icd11">ICD-11 Code</option>
        </select>

        <select className="border p-2 rounded" value={systemFilter} onChange={(e) => setSystemFilter(e.target.value)}>
          <option value="all">All Systems</option>
          <option value="Ayurveda">Ayurveda</option>
          <option value="Siddha">Siddha</option>
          <option value="Unani">Unani</option>
        </select>
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-1 gap-4 w-full sm:w-[70%]">
        {results.length > 0 ? (
          results.map((r, idx) => {
            const item = r.item || r;
            const matches = r.matches || [];

            return (
              <div
                key={idx}
                onClick={() =>
                  logSearchEvent({
                    page: "terminology",
                    query,
                    codeFilter,
                    systemFilter,
                    resultsCount: results.length,
                    clickedCode: item.namasteCode,
                    clickedDisplay: item.namasteDisplay,
                  })
                }
                className="p-4 sm:p-5 border rounded bg-white shadow cursor-pointer text-sm sm:text-base"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-2">
                  {highlightMatches(item.namasteDisplay, matches, "namasteDisplay")}
                </h2>
                <p><b>NAMASTE Code:</b> {highlightMatches(item.namasteCode, matches, "namasteCode")}</p>
                <p><b>TM2 Code:</b> {highlightMatches(item.tm2Code, matches, "tm2Code")} – {highlightMatches(item.tm2Display, matches, "tm2Display")}</p>
                <p><b>ICD-11 Code:</b> {highlightMatches(item.icd11Code, matches, "icd11Code")} – {highlightMatches(item.icd11Display, matches, "icd11Display")}</p>
                <p><b>AYUSH System:</b> {highlightMatches(item.ayushSystem, matches, "ayushSystem")}</p>
                <p><b>Short Description:</b> {highlightMatches(item.shortDefinition, matches, "shortDefinition")}</p>
                <p><b>Long Description:</b> {highlightMatches(item.longDefinition?.slice(0, 300), matches, "longDefinition")}</p>
              </div>
            );
          })
        ) : query ? (
          <p className="mt-4 text-red-500 text-sm sm:text-base">No results found</p>
        ) : null}
      </div>
    </div>
  );
}
