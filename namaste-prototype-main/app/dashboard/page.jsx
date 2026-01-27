"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "../globals.css";

// Import your actual components
import TerminologySearchComponent from "../components/TerminologySearchComponent";
import Translator from "../translator/page";
import DemoPage from "../demo/page";
import FhirValidatorPage from "../fhir/page";

export default function DashboardPage() {
  const [openCards, setOpenCards] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(10); 

  // Mark as client for gtag
  useEffect(() => setIsClient(true), []);

  // Fetch backend audit logs
  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => setAuditLogs(data))
      .catch((err) => console.error("Error fetching audit logs:", err))
      .finally(() => setLoading(false));
  }, []);

  // Generic audit log function
  const logAuditEvent = async ({
    page = null,
    featureId = null,
    action = null,
    query = null,
    codeFilter = null,
    systemFilter = null,
    resultsCount = null,
    clickedCode = null,
    clickedDisplay = null,
  }) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      page: page || featureId || "-",
      featureId,
      action,
      query,
      codeFilter,
      systemFilter,
      resultsCount,
      clickedCode,
      clickedDisplay,
      timestamp,
      user: "anonymous",
    };

    setAuditLogs((prev) => [logEntry, ...prev]);

    try {
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
    } catch (err) {
      console.error("Audit log failed:", err);
    }

    if (isClient && typeof window.gtag === "function") {
      window.gtag("event", action, {
        event_category: "Dashboard Feature",
        event_label: featureId,
        value: 1,
      });
    }
  };

  // Card open/close handlers
  const toggleCard = (id) => {
    setOpenCards((prev) => ({ ...prev, [id]: true }));
    logAuditEvent({ featureId: id, action: "opened" });
  };

  const closeCard = (id) => {
    setOpenCards((prev) => ({ ...prev, [id]: false }));
    logAuditEvent({ featureId: id, action: "closed" });
  };

  const features = [
    {
      id: "terminology",
      title: "Terminology Search",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-blue-600",
    },
    {
      id: "translator",
      title: "Code Translator",
      btnColor: "bg-purple-600 hover:bg-purple-700",
      textColor: "text-purple-600",
    },
    {
      id: "demo",
      title: "Patient Report",
      btnColor: "bg-green-600 hover:bg-green-700",
      textColor: "text-green-600",
    },
    {
      id: "validator",
      title: "FHIR Validator",
      btnColor: "bg-indigo-600 hover:bg-indigo-700",
      textColor: "text-indigo-600",
    },
  ];

  const featureComponents = {
    terminology: <TerminologySearchComponent logAuditEvent={logAuditEvent} />,
    translator: <Translator logAuditEvent={logAuditEvent} />,
    demo: <DemoPage logAuditEvent={logAuditEvent} />,
    validator: <FhirValidatorPage logAuditEvent={logAuditEvent} />,
  };

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto space-y-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-8">
        FHIR Terminology Service Dashboard
      </h1>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`relative p-4 bg-white border rounded shadow flex flex-col ${
              openCards[feature.id] ? "h-[650px]" : "h-auto"
            } transition-all duration-300`}
          >
            <h2 className={`text-2xl font-bold ${feature.textColor} mb-4`}>
              {feature.title}
            </h2>

            <div className="flex-1 overflow-auto">
              {openCards[feature.id] ? (
                <>
                  <div className="mb-2">{featureComponents[feature.id]}</div>
                  <button
                    onClick={() => closeCard(feature.id)}
                    className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition"
                  >
                    <X className="w-4 h-4" /> Close
                  </button>
                </>
              ) : (
                <button
                  onClick={() => toggleCard(feature.id)}
                  className={`${feature.btnColor} text-white px-4 py-2 rounded transition`}
                >
                  Load {feature.title}{" "}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Logs */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
        {auditLogs.length === 0 ? (
          <p>No audit logs available.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Timestamp</th>
                    <th className="p-2 border">Page / Feature</th>
                    <th className="p-2 border">Action</th>
                    <th className="p-2 border">Query</th>
                    <th className="p-2 border">Code Filter</th>
                    <th className="p-2 border">System Filter</th>
                    <th className="p-2 border">Results Count</th>
                    <th className="p-2 border">Clicked Code</th>
                    <th className="p-2 border">Clicked Display</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.slice(0, visibleLogs).map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2 border">
                        {log.page || log.featureId || "-"}
                      </td>
                      <td className="p-2 border">{log.action || "-"}</td>
                      <td className="p-2 border">{log.query || "-"}</td>
                      <td className="p-2 border">{log.codeFilter || "-"}</td>
                      <td className="p-2 border">{log.systemFilter || "-"}</td>
                      <td className="p-2 border">{log.resultsCount || "-"}</td>
                      <td className="p-2 border">{log.clickedCode || "-"}</td>
                      <td className="p-2 border">
                        {log.clickedDisplay || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show More / Show Less button */}
            <div className="mt-4 flex justify-center">
              {visibleLogs < auditLogs.length ? (
                <button
                  onClick={() => setVisibleLogs((prev) => prev + 10)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
                >
                  Show More ↓
                </button>
              ) : (
                <button
                  onClick={() => setVisibleLogs(10)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded shadow"
                >
                  Show Less ↑
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
