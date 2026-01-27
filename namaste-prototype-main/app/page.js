"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white py-24 px-6 sm:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
            Bridging NAMASTE & ICD-11 with FHIR
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-2">
            The first open-source API to connect AYUSH terminologies with ICD-11
            TM2, enabling interoperable electronic health records.
          </p>
          <p className="text-lg sm:text-lg opacity-90 mb-8">
            MediMap Connecting AYUSH with the world.
          </p>
          <Link
            href="/docs"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100 font-semibold transform transition duration-300 hover:-translate-y-1 hover:scale-105 inline-block"
          >
            Explore Docs →
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 sm:px-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          The Problem We’re Solving
        </h2>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto">
          India’s AYUSH sector uses diverse terminologies across Ayurveda,
          Siddha, and Unani. Without standardized digital integration, patient
          records remain fragmented and non-interoperable. Our API solves this
          by mapping <strong>NAMASTE codes</strong> to <strong>ICD-11 TM2</strong>,
          delivering FHIR-compliant resources ready for EHR systems.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 px-6 sm:px-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
           Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Cards */}
          {[
            {
              title: "Terminology Search",
              text: "Search across NAMASTE codes, ICD-11 TM2, and regional AYUSH terms with fuzzy matching.",
              color: "text-blue-600",
            },
            {
              title: "Mapping NAMASTE → ICD-11",
              text: "Directly map local AYUSH terminologies to ICD-11 disorders for global compatibility.",
              color: "text-indigo-600",
            },
            {
              title: "FHIR Bundle Support",
              text: "Generate and update complete FHIR bundles for patient encounters, conditions, and more.",
              color: "text-purple-600",
            },
            {
              title: "Condition Updater",
              text: "Select conditions from the terminology search and auto-update FHIR Condition resources in bundles.",
              color: "text-green-600",
            },
            {
              title: "EHR Ready",
              text: "Fully compliant with global FHIR standards, making integration with EMR/EHR systems seamless.",
              color: "text-teal-600",
            },
            {
              title: "Open Source",
              text: "Free and transparent, built for developers and healthcare providers in the AYUSH ecosystem.",
              color: "text-pink-600",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <h3 className={`text-xl font-semibold mb-3 ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="w-full mx-auto py-16 px-6 sm:px-20 text-center">
        <div className="relative overflow-hidden rounded-xl shadow-lg p-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x text-white">
          <h2 className="text-3xl font-bold mb-6"> Access Your Dashboard</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Manage your FHIR resources, perform terminology searches, and update
            patient bundles — all from a single, easy-to-use dashboard.
          </p>
          <Link
            href="/abha-login"
            className="px-6 py-3 bg-white text-red-600 rounded-lg shadow-lg hover:bg-gray-100 font-semibold inline-block transform transition duration-300 hover:-translate-y-1 hover:scale-105"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="w-full mx-auto text-center py-16 px-6 sm:px-20">
        <div className="relative overflow-hidden rounded-xl shadow-lg p-10 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 animate-gradient-x text-white">
          <h2 className="text-3xl font-bold mb-6"> Ready to get started?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Integrate our API today and bring AYUSH healthcare closer to digital
            interoperability.
          </p>
          <Link
            href="/docs"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100 font-semibold inline-block transform transition duration-300 hover:-translate-y-1 hover:scale-105"
          >
            Get Started →
          </Link>
        </div>
      </section>
    </main>
  );
}
