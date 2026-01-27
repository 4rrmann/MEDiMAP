"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center py-6 px-6 gap-4 bg-blue-600 text-white text-sm">
      <p className="text-center md:text-left">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">
          FHIR Terminology Service
        </span>
        . All rights reserved.
      </p>

      <div className="flex flex-wrap justify-center items-center gap-4 font-semibold">
        <a
          href="https://icd.who.int/en/"
          className="hover:text-gray-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          ICD-11 API
        </a>
        <Link href="/about" className="hover:text-gray-300">
          About
        </Link>
        <Link href="/contact" className="hover:text-gray-300">
          Contact
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
