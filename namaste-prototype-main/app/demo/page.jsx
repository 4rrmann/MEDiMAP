"use client";

import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import conceptMap from "../data/namaste_icd11_tm2_conceptmap.json";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* 🔹 Audit Logger */
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

  fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auditEvent),
  }).catch((err) => console.error("Failed to save audit log:", err));

  console.log("AUDIT LOG:", auditEvent);
}

/* 🔹 Utility: Strip HTML tags */
function stripTags(str) {
  return str ? str.replace(/<[^>]*>/g, "") : "";
}

/* 🔹 Utility: Generate HTML Report */
/* 🔹 Utility: Generate Styled HTML Report */
function reportHTML(formData) {
  return `
    <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <!-- Header with Validation Symbol -->
      <div class="flex items-center mb-4">
        <span class="text-green-600 text-2xl font-bold mr-2">✔</span>
        <h2 class="text-2xl font-bold text-blue-700">Validated Patient Report</h2>
      </div>

      <!-- Patient Section -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-blue-600 border-b pb-1">Patient Details</h3>
        <p><b>Name:</b> ${formData.patient.family} ${formData.patient.given}</p>
        <p><b>Gender:</b> ${formData.patient.gender}</p>
        <p><b>Date of Birth:</b> ${formData.patient.birthDate}</p>
      </div>

      <!-- Encounter Section -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-blue-600 border-b pb-1">Encounter</h3>
        <p><b>Class:</b> ${formData.encounter.classCode} (${formData.encounter.classDisplay})</p>
      </div>

      <!-- Condition Section -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-blue-600 border-b pb-1">Condition</h3>
        <p><b>NAMASTE:</b> ${formData.condition.namasteDisplay} (${formData.condition.namasteCode})</p>
        <p><b>TM2:</b> ${formData.condition.tm2Display} (${formData.condition.tm2Code})</p>
        <p><b>ICD-11:</b> ${formData.condition.icdDisplay} (${formData.condition.icdCode})</p>
        <p><b>Status:</b> <span class="text-green-700 font-medium">${formData.condition.clinicalStatus}</span></p>
      </div>

      <!-- Description Section -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-blue-600 border-b pb-1">Definitions</h3>
        <p><b>Short:</b> ${formData.condition.shortDefinition}</p>
        <p><b>Long:</b> ${formData.condition.longDefinition}</p>
      </div>
    </div>
  `;
}

export default function DemoPage() {
  const [formData, setFormData] = useState({
    patient: { family: "", given: "", gender: "", birthDate: "" },
    encounter: { classCode: "AMB", classDisplay: "ambulatory" },
    condition: {
      namasteCode: "",
      namasteDisplay: "",
      tm2Code: "",
      tm2Display: "",
      icdCode: "",
      icdDisplay: "",
      shortDefinition: "",
      longDefinition: "",
      clinicalStatus: "active",
    },
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const reportRef = useRef();

  /* 🔹 Build Fuse.js index */
  useEffect(() => {
    const flattenedData = conceptMap.group.flatMap((g) =>
      g.element.map((el) => {
        const extensions = el.extension || [];
        const shortDefinition =
          extensions.find((ex) => ex.url.includes("shortDefinition"))
            ?.valueString || "";
        const longDefinition =
          extensions.find((ex) => ex.url.includes("longDefinition"))
            ?.valueString || "";

        const targets = el.target || [];
        const tm2Target = targets.find(
          (t) =>
            t.code.toUpperCase().startsWith("TM2") ||
            t.equivalence === "equivalent"
        );
        const icdTarget = targets.find(
          (t) =>
            t.code.toUpperCase().startsWith("ICD11") ||
            /^[0-9A-Z]{2,}/.test(t.code)
        );

        return {
          namasteCode: el.code || "N/A",
          namasteTerm: el.display || "N/A",
          tm2Code: tm2Target?.code || "N/A",
          tm2Display: tm2Target?.display || "N/A",
          icdCode: icdTarget?.code || "N/A",
          icdDisplay: icdTarget?.display || "N/A",
          shortDefinition,
          longDefinition,
        };
      })
    );

    setFuse(
      new Fuse(flattenedData, {
        threshold: 0.3,
        keys: ["namasteCode", "namasteTerm", "tm2Code", "icdCode"],
      })
    );
  }, []);

  useEffect(() => {
    if (query && fuse) {
      const searchResults = fuse.search(query);
      setResults(searchResults.map((res) => res.item));
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  const handleChange = (e, section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: e.target.value },
    }));
  };

  const selectDisease = (r) => {
    setFormData((prev) => ({
      ...prev,
      condition: {
        ...prev.condition,
        namasteCode: r.namasteCode,
        namasteDisplay: stripTags(r.namasteTerm),
        tm2Code: r.tm2Code,
        tm2Display: stripTags(r.tm2Display),
        icdCode: r.icdCode,
        icdDisplay: stripTags(r.icdDisplay),
        shortDefinition: r.shortDefinition,
        longDefinition: r.longDefinition,
      },
    }));
    setQuery("");
    setResults([]);
  };

  const generateBundle = (formData) => {
    const patientId = uuidv4();
    const encounterId = uuidv4();
    const conditionId = uuidv4();

    return {
      resourceType: "Bundle",
      type: "collection",
      entry: [
        {
          fullUrl: `urn:uuid:${patientId}`,
          resource: {
            resourceType: "Patient",
            id: patientId,
            text: {
              status: "generated",
              div: `<div xmlns='http://www.w3.org/1999/xhtml'>
              Patient: ${formData.patient.given} ${formData.patient.family}, ${formData.patient.gender}, born ${formData.patient.birthDate}
            </div>`,
            },
            name: [
              {
                use: "official",
                given: [formData.patient.given],
                family: formData.patient.family,
              },
            ],
            gender: formData.patient.gender,
            birthDate: formData.patient.birthDate,
          },
        },
        {
          fullUrl: `urn:uuid:${encounterId}`,
          resource: {
            resourceType: "Encounter",
            id: encounterId,
            text: {
              status: "generated",
              div: `<div xmlns='http://www.w3.org/1999/xhtml'>
              Encounter for ${formData.patient.given} ${formData.patient.family}
            </div>`,
            },
            status: "finished",
            class: 
              {
                // coding: [
                  // {
                    system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                    code: formData.encounter.classCode,
                    display: formData.encounter.classDisplay,
                  // },
                // ],
                // text: formData.encounter.classDisplay,
              },
            // ],
            subject: {
              reference: `urn:uuid:${patientId}`,
            },
          },
        },
        {
          fullUrl: `urn:uuid:${conditionId}`,
          resource: {
            resourceType: "Condition",
            id: conditionId,
            text: {
              status: "generated",
              div: `<div xmlns='http://www.w3.org/1999/xhtml'>
              Condition: ${formData.condition.namasteDisplay}
            </div>`,
            },
            clinicalStatus: {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/condition-clinical",
                  code: formData.condition.clinicalStatus,
                },
              ],
            },
            code: {
              coding: [
                {
                  system: "https://namaste.ayush.gov.in/codesystem/namaste",
                  code: formData.condition.namasteCode,
                  display: formData.condition.namasteDisplay,
                },
                {
                  system: "https://tm2.who.int",
                  code: formData.condition.tm2Code,
                  display: formData.condition.tm2Display,
                },
                {
                  system: "http://who.int/icd/entity",
                  code: formData.condition.icdCode,
                  display: formData.condition.icdDisplay,
                },
              ],
            },
            subject: {
              reference: `urn:uuid:${patientId}`,
            },
            encounter: {
              reference: `urn:uuid:${encounterId}`,
            },
          },
        },
      ],
    };
  };

  const handleSubmit = async () => {
    const bundle = generateBundle(formData);
    try {
      const res = await fetch("/api/fhir/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bundle),
      });
      if (!res.ok) throw new Error("Failed to save bundle");
      await res.json();

      logAuditEvent("C", "FHIR/Bundle", "0");
      alert("FHIR Bundle successfully submitted!");
    } catch (err) {
      logAuditEvent("C", "FHIR/Bundle", "8");
      alert("Error submitting bundle: " + err.message);
    }
  };

  const handleValidate = async () => {
    const bundle = generateBundle(formData);
    const res = await fetch("/api/fhir/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bundle),
    });
    const data = await res.json();
    setValidationResult(data);

    logAuditEvent("E", "FHIR/Validate", "0");
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Patient_Report_${formData.patient.given}.pdf`);

    logAuditEvent("R", "PatientReport/PDF", "0");
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-blue-600 text-center">
        Patient Report Creation
      </h1>

      {/* Patient Form */}
      <div className="p-4 border rounded shadow space-y-3 bg-white">
        <h2 className="font-semibold text-lg text-blue-600">Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Family Name"
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(e, "patient", "family")}
          />
          <input
            placeholder="Given Name"
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(e, "patient", "given")}
          />
          <select
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(e, "patient", "gender")}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="date"
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(e, "patient", "birthDate")}
          />
        </div>
      </div>

      {/* Encounter Form */}
      <div className="p-4 border rounded shadow space-y-3 bg-white">
        <h2 className="font-semibold text-lg text-blue-600">Encounter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            defaultValue="AMB"
            placeholder="Class Code"
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(e, "encounter", "classCode")}
          />
          <input
            defaultValue="ambulatory"
            placeholder="Class Display"
            className="border p-2 rounded w-full"
            onChange={(e) => handleChange(e, "encounter", "classDisplay")}
          />
        </div>
      </div>

      {/* Condition Form */}
      <div className="p-4 border rounded shadow space-y-3 bg-white">
        <h2 className="font-semibold text-lg text-blue-600">Condition</h2>
        <input
          placeholder="Search disease..."
          className="border p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results.length > 0 && (
          <div className="border mt-2 rounded bg-white shadow max-h-60 overflow-y-auto">
            {results.map((r, idx) => (
              <div
                key={idx}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => selectDisease(r)}
              >
                <b>{stripTags(r.namasteTerm)}</b> ({r.namasteCode}) → TM2:{" "}
                {r.tm2Code} {stripTags(r.tm2Display)} → ICD-11: {r.icdCode}{" "}
                {stripTags(r.icdDisplay)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Bundle
        </button>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Validate Bundle
        </button>
        <button
          onClick={() => {
            setShowReport(true);
            logAuditEvent("R", "PatientReport/HTML", "0");
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Generate Report
        </button>
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          {showCode ? "Hide Code Preview" : "Show Code Preview"}
        </button>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div className="p-4 border rounded shadow bg-gray-100 mt-4 relative">
          <button
            onClick={() => setValidationResult(null)}
            className="absolute top-2 right-2 text-red-500 font-bold"
          >
            ✖
          </button>
          <span className="text-green-600 font-bold text-xl">✔</span>
          <div className="mt-2">
            <h2 className="font-semibold text-blue-600 mb-1">
              Validation Result
            </h2>
            <pre className="whitespace-pre-wrap text-gray-800 text-sm">
              {JSON.stringify(validationResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Generated Report */}
      {showReport && (
        <div
          className="p-4 border rounded shadow bg-gray-50 mt-4"
          ref={reportRef}
        >
          <div dangerouslySetInnerHTML={{ __html: reportHTML(formData) }} />
          <div className="mt-4">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Code Preview */}
      {showCode && (
        <div className="p-4 border rounded shadow bg-gray-900 text-green-400 text-xs overflow-auto mt-4 max-h-96">
          <pre>{JSON.stringify(generateBundle(formData), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
