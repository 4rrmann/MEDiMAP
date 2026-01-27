"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import conceptMap from "../data/namaste_icd11_tm2_conceptmap.json";
import { logAuditEvent } from "../lib/auditLogger";

export default function Translator() {
  const [namasteQuery, setNamasteQuery] = useState("");
  const [icdQuery, setIcdQuery] = useState("");
  const [namasteResults, setNamasteResults] = useState([]);
  const [icdResults, setIcdResults] = useState([]);

  // Flatten ConceptMap data dynamically
  const flattenedData = (conceptMap.group || []).flatMap((g) =>
    (g.element || []).map((el) => {
      const elExtensions = el.extension || [];
      const shortDefinition = elExtensions.find((ex) =>
        ex.url?.includes("shortDefinition")
      )?.valueString;
      const longDefinition = elExtensions.find((ex) =>
        ex.url?.includes("longDefinition")
      )?.valueString;
      const ayushSystem =
        elExtensions.find((ex) => ex.url?.includes("ayushSystem"))
          ?.valueString || "N/A";

      const targets = el.target || [];

      let tm2Target = targets.find((t) => t.code?.startsWith("TM2"));
      if (!tm2Target) tm2Target = targets[0] || {};
      let icdTarget = targets.find((t) => t.code?.startsWith("ICD11"));
      if (!icdTarget) icdTarget = targets[1] || targets[0] || {};

      const ayushSystemTarget =
        tm2Target.extension?.find((ex) => ex.url?.includes("ayushSystem"))
          ?.valueString ||
        icdTarget.extension?.find((ex) => ex.url?.includes("ayushSystem"))
          ?.valueString;

      return {
        namasteCode: el.code || "N/A",
        namasteDisplay: el.display || "N/A",
        tm2Code: tm2Target.code || "N/A",
        tm2Display: tm2Target.display || "N/A",
        icdCode: icdTarget.code || "N/A",
        icdDisplay: icdTarget.display || "N/A",
        shortDefinition: shortDefinition || "",
        longDefinition: longDefinition || "",
        ayushSystem: ayushSystemTarget || ayushSystem || "N/A",
      };
    })
  );
  // Initialize Fuse instances
  const fuseNamaste = new Fuse(flattenedData, {
    keys: [
      "namasteCode",
      "namasteDisplay",
      "shortDefinition",
      "longDefinition",
      "ayushSystem",
    ],
    threshold: 0.3,
  });

  const fuseICD = new Fuse(flattenedData, {
    keys: [
      "icdCode",
      "icdDisplay",
      "tm2Code",
      "tm2Display",
      "shortDefinition",
      "longDefinition",
      "ayushSystem",
    ],
    threshold: 0.3,
  });

  // NAMASTE search
  useEffect(() => {
    if (!namasteQuery.trim()) {
      setNamasteResults([]);
    } else {
      const results = fuseNamaste.search(namasteQuery).map((r) => r.item);
      setNamasteResults(results);

      // Log audit for search
      logAuditEvent({
        page: "translator",
        featureId: "namasteSearch",
        action: "search",
        query: namasteQuery,
        resultsCount: results.length,
      });
    }
  }, [namasteQuery]);

  // ICD-11 search
  useEffect(() => {
    if (!icdQuery.trim()) {
      setIcdResults([]);
    } else {
      const results = fuseICD.search(icdQuery).map((r) => r.item);
      setIcdResults(results);

      // Log audit for search
      logAuditEvent({
        page: "translator",
        featureId: "namasteSearch",
        action: "search",
        query: namasteQuery,
        resultsCount: results.length,
      });
    }
  }, [icdQuery]);

  // Function to log click on a result
  const handleClickResult = (item) => {
    logAuditEvent({
      page: "translator",
      featureId: "translatorResultClick",
      action: "click",
      clickedCode: item.namasteCode,
      clickedDisplay: item.namasteDisplay,
      codeFilter: "all",
      systemFilter: item.ayushSystem,
      resultsCount: 1,
    });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col md:flex-row gap-8">
      {/* NAMASTE Search Card */}
      <div className="flex-1 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-purple-600 mb-4">
          Search by NAMASTE
        </h2>
        <input
          type="text"
          placeholder="Enter NAMASTE term, code or description..."
          value={namasteQuery}
          onChange={(e) => setNamasteQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <div>
          {namasteResults.length > 0 ? (
            namasteResults.map((item, i) => (
              <div
                key={i}
                className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer"
                onClick={() => handleClickResult(item)}
              >
                <p>
                  <strong>NAMASTE:</strong> {item.namasteDisplay} (
                  {item.namasteCode})
                </p>
                <p>
                  <strong>TM2:</strong> {item.tm2Display} ({item.tm2Code})
                </p>
                <p>
                  <strong>ICD-11:</strong> {item.icdDisplay} ({item.icdCode})
                </p>
                <p>
                  <strong>AYUSH System:</strong> {item.ayushSystem}
                </p>
              </div>
            ))
          ) : namasteQuery ? (
            <p className="text-gray-500">No NAMASTE match found.</p>
          ) : (
            <p className="text-gray-400">
              Start typing NAMASTE term/code/description...
            </p>
          )}
        </div>
      </div>

      {/* ICD-11 Search Card */}
      <div className="flex-1 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          Search by ICD-11
        </h2>
        <input
          type="text"
          placeholder="Enter ICD-11 code, disorder or description..."
          value={icdQuery}
          onChange={(e) => setIcdQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div>
          {icdResults.length > 0 ? (
            icdResults.map((item, i) => (
              <div
                key={i}
                className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer"
                onClick={() => handleClickResult(item)}
              >
                <p>
                  <strong>NAMASTE:</strong> {item.namasteDisplay} (
                  {item.namasteCode})
                </p>
                <p>
                  <strong>TM2:</strong> {item.tm2Display} ({item.tm2Code})
                </p>
                <p>
                  <strong>ICD-11:</strong> {item.icdDisplay} ({item.icdCode})
                </p>
                <p>
                  <strong>AYUSH System:</strong> {item.ayushSystem}
                </p>
              </div>
            ))
          ) : icdQuery ? (
            <p className="text-gray-500">No ICD-11 match found.</p>
          ) : (
            <p className="text-gray-400">
              Start typing ICD-11 code/disorder/description...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
