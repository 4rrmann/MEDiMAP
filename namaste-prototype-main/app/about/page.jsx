"use client";
import { useState } from "react";

export default function AboutPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="min-h-screen max-w-5xl mx-auto p-6 sm:p-12 space-y-12">
      <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">
        About MediMap
      </h1>

      {/* Overview Section */}
      <section className="space-y-4 text-gray-700">
        <p>
          <strong>MediMap</strong> is a FHIR-powered terminology service that
          bridges <strong>NAMASTE</strong>, <strong>ICD-11 (TM2)</strong>, and{" "}
          <strong>AYUSH</strong> codes into modern Electronic Health Records
          (EHR) systems and healthcare applications. Our goal is to simplify{" "}
          <span className="font-medium">healthcare data interoperability</span>{" "}
          with precision, speed, and scalability.
        </p>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            expanded ? "max-h-full" : "max-h-0 sm:max-h-full"
          }`}
        >
          <p>
            With MediMap, healthcare providers, developers, and organizations
            can seamlessly access validated medical terminologies, perform code
            translations, validate FHIR Bundles, and build solutions that align
            with global healthcare standards.
          </p>
          <p>
            Our platform is designed with a focus on{" "}
            <strong>reliability, usability, and interoperability</strong>,
            ensuring that terminology usage remains consistent across diverse
            healthcare ecosystems. Whether you are building an EMR/EHR, a
            research system, or an integration platform — MediMap has you
            covered.
          </p>
        </div>

        {/* Read More / Read Less button for mobile */}
        <button
          className="mt-2 text-blue-600 font-semibold hover:underline sm:hidden"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      </section>

      {/* Mission Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-600">Our Mission</h2>
        <p className="text-gray-700">
          To make healthcare terminologies{" "}
          <strong>accessible, standardized, and easy-to-integrate</strong> for
          better patient care, enhanced clinical workflows, and seamless system
          interoperability.
        </p>
      </section>

      {/* Vision Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-600">Our Vision</h2>
        <p className="text-gray-700">
          To become the <strong>global reference platform</strong> for
          healthcare terminology and FHIR integrations, empowering developers
          and healthcare professionals to create interoperable, future-ready
          solutions worldwide.
        </p>
      </section>

      {/* Values Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-600">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Innovation:</strong> Driving modern solutions for complex
            healthcare data challenges.
          </li>
          <li>
            <strong>Collaboration:</strong> Partnering with healthcare providers
            and developers for better outcomes.
          </li>
          <li>
            <strong>Trust:</strong> Ensuring accuracy, consistency, and
            compliance in all terminology mappings.
          </li>
        </ul>
      </section>
    </main>
  );
}
