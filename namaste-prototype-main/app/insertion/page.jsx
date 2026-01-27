"use client";

import { useState } from "react";
import * as XLSX from "xlsx"; 
import conceptMapData from "../data/insertion_concept.json";

export default function ConceptMapUpdaterSimple() {
  const [namasteCode, setNamasteCode] = useState("");
  const [namasteDisplay, setNamasteDisplay] = useState("");
  const [shortDefinition, setShortDefinition] = useState("");
  const [longDefinition, setLongDefinition] = useState("");
  const [ayushSystem, setAyushSystem] = useState("");
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [conceptMap, setConceptMap] = useState(conceptMapData);

  const handleAddConcept = () => {
    if (!namasteCode || !namasteDisplay || !ayushSystem) {
      alert("Please fill NAMASTE Code, Term, and AYUSH System.");
      return;
    }

    let group = conceptMap.group[0];
    let existingElement = group.element.find((el) => el.code === namasteCode);

    const newElementData = {
      code: namasteCode,
      display: namasteDisplay,
      target: [
        {
          extension: [
            {
              shortDefinition,
              longDefinition,
              ayushSystem,
            },
          ],
        },
      ],
    };

    if (existingElement) {
      existingElement.target[0].extension = [
        {
          shortDefinition,
          longDefinition,
          ayushSystem,
        },
      ];
    } else {
      group.element.push(newElementData);
    }

    setRecentUpdates([
      {
        namasteCode,
        namasteDisplay,
        shortDefinition,
        longDefinition,
        ayushSystem,
      },
    ]);

    setNamasteCode("");
    setNamasteDisplay("");
    setShortDefinition("");
    setLongDefinition("");
    setAyushSystem("");

    setConceptMap({ ...conceptMap });
  };

  // 📌 File Upload & Bulk Insert
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      let group = conceptMap.group[0];

      worksheet.forEach((row) => {
        const code = row["NAMASTE Code"];
        const display = row["NAMASTE Term"];
        const ayush = row["AYUSH System"];
        const shortDef = row["Short Description"] || "";
        const longDef = row["Long Description"] || "";

        if (code && display && ayush) {
          let existingElement = group.element.find((el) => el.code === code);

          const newElementData = {
            code,
            display,
            target: [
              {
                extension: [
                  {
                    shortDefinition: shortDef,
                    longDefinition: longDef,
                    ayushSystem: ayush,
                  },
                ],
              },
            ],
          };

          if (existingElement) {
            existingElement.target[0].extension = [
              {
                shortDefinition: shortDef,
                longDefinition: longDef,
                ayushSystem: ayush,
              },
            ];
          } else {
            group.element.push(newElementData);
          }
        }
      });

      setConceptMap({ ...conceptMap });
      alert("Bulk concepts added from file successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  // 📌 Download Updated JSON
  const downloadConceptMap = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(conceptMap, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "conceptmap.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Update Concept Map
      </h1>

      {/* 🔹 Manual Entry Section */}
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-purple-600">NAMASTE Term</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            placeholder="NAMASTE Code"
            value={namasteCode}
            onChange={(e) => setNamasteCode(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="NAMASTE Term"
            value={namasteDisplay}
            onChange={(e) => setNamasteDisplay(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <h2 className="text-lg font-semibold text-green-600">Additional Info</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            placeholder="AYUSH System (e.g., Siddha)"
            value={ayushSystem}
            onChange={(e) => setAyushSystem(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="Short Description"
            value={shortDefinition}
            onChange={(e) => setShortDefinition(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="Long Description"
            value={longDefinition}
            onChange={(e) => setLongDefinition(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleAddConcept}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
        >
          Add / Update Concept
        </button>

        <button
          onClick={downloadConceptMap}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4 ml-2"
        >
          Download ConceptMap JSON
        </button>
      </div>

      {/* 🔹 OR Upload Section */}
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-red-600">
          OR Upload CSV/Excel File
        </h2>
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileUpload}
          className="border p-2 rounded w-full"
        />
        <p className="text-sm text-gray-600 mt-2">
          File should have headers: <br />
          <code>NAMASTE Code, NAMASTE Term, AYUSH System, Short Description, Long Description</code>
        </p>
      </div>

      {/* 🔹 Recent Updates */}
      {recentUpdates.length > 0 && (
        <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-2">
          <h2 className="text-lg font-semibold text-green-600">
            Recent Addition
          </h2>
          {recentUpdates.map((item, idx) => (
            <div
              key={idx}
              className="p-3 border border-gray-300 rounded bg-white"
            >
              <p>
                <strong>NAMASTE:</strong> {item.namasteDisplay} (
                {item.namasteCode})
              </p>
              <p>
                <strong>AYUSH System:</strong> {item.ayushSystem}
              </p>
              {item.shortDefinition && (
                <p>
                  <strong>Short:</strong> {item.shortDefinition}
                </p>
              )}
              {item.longDefinition && (
                <p>
                  <strong>Long:</strong> {item.longDefinition}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
