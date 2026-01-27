"use client";

import { useEffect, useState } from "react";
import conceptMapJson from "../data/namaste_icd11_tm2_conceptmap.json"; // import the JSON file

export default function ConceptMapPage() {
  const [conceptMap, setConceptMap] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // Load JSON file directly instead of generating dynamically
    setConceptMap(conceptMapJson);

    // Send ConceptMap to WHO API
    fetch("/api/conceptmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conceptMap: conceptMapJson }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data))
      .catch((err) => console.error("Error sending ConceptMap:", err));
  }, []);

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Generated ConceptMap</h1>
      {conceptMap ? (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(conceptMap, null, 2)}
        </pre>
      ) : (
        <p>Loading ConceptMap...</p>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">WHO API Response</h2>
      {response ? (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      ) : (
        <p>Sending ConceptMap to WHO...</p>
      )}
    </main>
  );
}
