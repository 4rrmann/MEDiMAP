"use client";
import { useState } from "react";

export default function AbhaLogin() {
  const [healthId, setHealthId] = useState("");
  const [txnId, setTxnId] = useState("");
  const [otp, setOtp] = useState("");
  const [profile, setProfile] = useState(null);

  async function initLogin() {
    const res = await fetch("/api/abha/auth-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ healthId })
    });
    const data = await res.json();
    setTxnId(data.txnId);
  }

  async function confirmLogin() {
    const res = await fetch("/api/abha/auth-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txnId, otp })
    });
    const data = await res.json();

    if (data.token) {
      // Fetch profile
      const profileRes = await fetch("/api/abha/fetch-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token })
      });
      const profileData = await profileRes.json();
      setProfile(profileData);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto flex justify-center items-center flex-col w-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">ABHA Login</h1>
      
      <input
        type="text"
        placeholder="Enter ABHA ID"
        value={healthId}
        onChange={(e) => setHealthId(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button onClick={initLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Send OTP
      </button>

      {txnId && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button onClick={confirmLogin} className="bg-green-600 text-white px-4 py-2 rounded">
            Confirm Login
          </button>
        </div>
      )}

      {profile && (
        <pre className="mt-6 bg-gray-100 p-4 rounded">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </div>
  );
}
