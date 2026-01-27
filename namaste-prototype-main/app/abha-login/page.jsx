"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logAuditEvent } from "../lib/auditLogger"; // import logger

export default function AbhaLoginPage() {
  const [healthId, setHealthId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [profile, setProfile] = useState(null);

  const router = useRouter();

  const dummyProfile = {
    abhaId: "23-4567-8901-2345",
    name: "Rahul Sharma",
    gender: "male",
    dob: "1995-08-14",
    mobile: "+91-9876543210",
  };

  function sendOtp() {
    if (!healthId) {
      alert("Please enter ABHA ID or Number");
      return;
    }
    logAuditEvent("E", `ABHA/${healthId}`, "0");
    setStep("otp");
  }

  function confirmOtp() {
    if (otp === "042351") {
      setProfile(dummyProfile);
      setStep("done");
      logAuditEvent("E", `ABHA/${healthId}`, "0");
      router.push("/dashboard");
    } else {
      alert("Invalid OTP..");
      logAuditEvent("E", `ABHA/${healthId}`, "8");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">ABHA Login</h1>

        {step === "login" && (
          <>
            <input
              type="password" // 🔹 changed to password
              placeholder="Enter ABHA ID or Number"
              value={healthId}
              onChange={(e) => setHealthId(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />
            <p className="text-gray-500 py-1">
              Dont have an ABHA account?{" "}
              <a
                href="https://abha.abdm.gov.in/abha/v3/register"
                target="_blank"
                className="text-blue-600 font-semibold"
              >
                Register
              </a>
            </p>
            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white px-4 py-2 w-full rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="password" // 🔹 OTP now hidden with dots
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />
            <button
              onClick={confirmOtp}
              className="bg-green-600 text-white px-4 py-2 w-full rounded"
            >
              Confirm Login
            </button>
          </>
        )}

        {step === "done" && profile && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">✅ Logged in as</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
