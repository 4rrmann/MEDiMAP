"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Image for favicon
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [fhirOpen, setFhirOpen] = useState(false);
  const [mobileFhirOpen, setMobileFhirOpen] = useState(false);

  const [show, setShow] = useState(true); // Navbar visibility
  const [lastScroll, setLastScroll] = useState(0);

  // Scroll listener to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center h-16 px-6">
        {/* Logo + Favicon */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Image
            src="/logo.png" // ✅ Place your favicon in /public folder
            alt="MediMap Logo"
            width={30}
            height={30}
            className="rounded"
          />
          MediMap
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 font-semibold items-center">
          {/* FHIR Features Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFhirOpen(!fhirOpen)}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              FHIR Features{" "}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  fhirOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {fhirOpen && (
              <div className="absolute top-full left-0 bg-white border shadow-md rounded mt-1 flex flex-col w-48 z-20">
                <Link href="/terminology" className="px-4 py-2 hover:bg-gray-100">
                  Terminology
                </Link>
                <Link href="/translator" className="px-4 py-2 hover:bg-gray-100">
                  Translator
                </Link>
                <Link href="/fhir" className="px-4 py-2 hover:bg-gray-100">
                  FHIR Validator
                </Link>
                <Link href="/insertion" className="px-4 py-2 hover:bg-gray-100">
                  Insertion
                </Link>
                <Link href="/conceptmap" className="px-4 py-2 hover:bg-gray-100">
                  Concept Map
                </Link>
                <Link href="/demo" className="px-4 py-2 hover:bg-gray-100">
                  Patient Report Creation
                </Link>
              </div>
            )}
          </div>

          <Link href="/docs" className="hover:text-blue-600">
            Docs
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="flex flex-col gap-2 pb-4 font-semibold md:hidden px-4">
          {/* FHIR Features Mobile */}
          <div className="flex flex-col">
            <button
              onClick={() => setMobileFhirOpen(!mobileFhirOpen)}
              className="flex justify-between items-center py-1 hover:text-blue-600"
            >
              FHIR Features{" "}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileFhirOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileFhirOpen && (
              <div className="flex flex-col pl-4 mt-1 gap-1">
                <Link href="/terminology" className="hover:text-blue-600">
                  Terminology
                </Link>
                <Link href="/translator" className="hover:text-blue-600">
                  Translator
                </Link>
                <Link href="/fhir" className="hover:text-blue-600">
                  FHIR Validator
                </Link>
                <Link href="/conceptmap" className="hover:text-blue-600">
                  Concept Map
                </Link>
                <Link href="/demo" className="hover:text-blue-600">
                  Patient Report Creation
                </Link>
              </div>
            )}
          </div>

          <Link href="/docs" className="hover:text-blue-600">
            Docs
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
