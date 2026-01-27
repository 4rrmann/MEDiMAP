"use client";
import { useState } from "react";
import Link from "next/link";

export default function Documentation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100">
      {/* Header */}
      <header className="bg-gray-50 shadow-sm p-4 sm:p-6 sticky top-0 z-10 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
            AYUSH API Docs
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <Link href="#overview" className="hover:text-blue-600">
              Overview
            </Link>
            <Link href="#auth" className="hover:text-blue-600">
              Authentication
            </Link>
            <Link href="#endpoints" className="hover:text-blue-600">
              Endpoints
            </Link>
            <Link href="#examples" className="hover:text-blue-600">
              Examples
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-200"
          >
            ☰
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="mt-4 flex flex-col space-y-2 md:hidden">
            <Link
              href="#overview"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Overview
            </Link>
            <Link
              href="#auth"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Authentication
            </Link>
            <Link
              href="#endpoints"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Endpoints
            </Link>
            <Link
              href="#examples"
              className="hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Examples
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12 sm:space-y-16">
        {/* Overview */}
        <section id="overview">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700">
            Our FHIR Terminology Service allows you to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-1">
            <li>Search NAMASTE, ICD-11 (TM2), and regional AYUSH terms</li>
            <li>Translate NAMASTE codes to ICD-11 TM2 and vice versa</li>
            <li>
              Generate and validate FHIR Bundles with Patient, Encounter, and
              Condition resources
            </li>
            <li>
              Access an interactive dashboard showing terminologies, endpoints,
              and security metrics
            </li>
          </ul>
        </section>

        {/* Authentication */}
        <section id="auth">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            🔑 Authentication
          </h2>
          <p className="text-gray-700 mb-2">
            Include your API key in the request header:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
            {`Authorization: Bearer YOUR_API_KEY`}
          </pre>
        </section>

        {/* Endpoints */}
        <section id="endpoints">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Endpoints</h2>

          {/* Terminology Search */}
          <div className="mb-8">
            <h3 className="font-bold text-blue-600">1. Terminology Search</h3>
            <p className="text-gray-700 mb-2">
              Search NAMASTE or ICD-11 terms:
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`GET /api/search/namaste?q=term
GET /api/search/icd?q=term`}
            </pre>
          </div>

          {/* Code Translator */}
          <div className="mb-8">
            <h3 className="font-bold text-purple-600">2. Code Translator</h3>
            <p className="text-gray-700 mb-2">
              Translate between NAMASTE and ICD-11 TM2 codes:
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`GET /api/map/namaste-to-icd?code=NAM001
GET /api/map/icd-to-namaste?code=1683919439`}
            </pre>
          </div>

          {/* FHIR Demo / Bundle */}
          <div className="mb-8">
            <h3 className="font-bold text-green-600">
              3. FHIR Demo / Bundle Generator
            </h3>
            <p className="text-gray-700 mb-2">
              Generate a FHIR Bundle with Patient, Encounter, and Condition
              resources:
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`POST /api/fhir/bundle
Request Body: {
  "patient": { "given": "John", "family": "Doe", "gender": "male", "birthDate": "1980-01-01" },
  "encounter": { "classCode": "AMB", "classDisplay": "ambulatory" },
  "condition": { "namasteCode": "NAM001", "icdCode": "1683919439" }
}
Response: FHIR Bundle JSON`}
            </pre>
          </div>

          {/* FHIR Validator */}
          <div className="mb-8">
            <h3 className="font-bold text-indigo-600">4. FHIR Validator</h3>
            <p className="text-gray-700 mb-2">Validate any FHIR Bundle JSON:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`POST /api/fhir/validate
Request Body: FHIR Bundle JSON
Response: Validation Result JSON`}
            </pre>
          </div>
        </section>

        {/* Examples */}
        <section id="examples">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Example Response
          </h2>
          <pre className="bg-gray-900 text-yellow-300 p-4 rounded-lg text-sm overflow-x-auto">
            {`{
  "patient": { "given": "John", "family": "Doe", "gender": "male", "birthDate": "1980-01-01" },
  "encounter": { "classCode": "AMB", "classDisplay": "ambulatory" },
  "condition": { 
    "namasteCode": "NAM001", 
    "namasteTerm": "Amlapitta (Hyperacidity)", 
    "icdCode": "1683919439", 
    "icdDisorder": "Gastritis" 
  },
  "bundleId": "urn:uuid:12345"
}`}
          </pre>
        </section>
      </main>
    </div>
  );
}
