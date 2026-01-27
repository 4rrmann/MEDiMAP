"use client";
import { useState } from "react";

// 🔹 Audit Logger
function logAuditEvent(action, entity, outcome = "0") {
  const doctorId = `doctor-${Math.floor(Math.random() * 10000)}`;
  const auditEvent = {
    resourceType: "AuditEvent",
    type: { code: "rest", display: "RESTful Operation" },
    action, // R = read, E = execute, C = create
    recorded: new Date().toISOString(),
    outcome, // 0 = success, 8 = failure
    agent: [
      {
        who: {
          identifier: {
            system: "urn:fake:doctor-id",
            value: doctorId,
          },
        },
        requestor: true,
      },
    ],
    entity: [{ what: { reference: entity } }],
  };

  // Save to backend API
  fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auditEvent),
  }).catch((err) => console.error("Failed to save audit log:", err));

  console.log("AUDIT LOG:", auditEvent);
}

export default function FhirValidatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateFhir = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/validate-fhir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: input, // raw JSON text
      });

      const data = await res.json();
      setResult(data);

      // 🔹 log successful validation
      logAuditEvent("E", "FHIR/ValidatePage", "0");
    } catch (err) {
      setResult({ error: err.message });

      // 🔹 log failed validation
      logAuditEvent("E", "FHIR/ValidatePage", "8");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">FHIR Validator</h1>

      <textarea
        className="w-full min-h-[300px] font-mono text-sm p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste your FHIR Bundle JSON here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={validateFhir}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-lg text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Validating..." : "Validate Bundle"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Validation Result:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
