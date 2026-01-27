export default async function handler(req, res) {
  const { healthId } = req.body;

  try {
    const response = await fetch("https://dev.abdm.gov.in/gateway/v0.5/users/auth/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": process.env.ABDM_CLIENT_ID,
        "client-secret": process.env.ABDM_CLIENT_SECRET
      },
      body: JSON.stringify({
        authMethod: "MOBILE_OTP", // or AADHAAR_OTP
        healthid: healthId
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "ABHA Auth Init Failed", details: error.message });
  }
}
