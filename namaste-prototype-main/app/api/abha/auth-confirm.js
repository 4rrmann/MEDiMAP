export default async function handler(req, res) {
  const { txnId, otp } = req.body;

  try {
    const response = await fetch("https://dev.abdm.gov.in/gateway/v0.5/users/auth/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": process.env.ABDM_CLIENT_ID,
        "client-secret": process.env.ABDM_CLIENT_SECRET
      },
      body: JSON.stringify({
        txnId,
        otp
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "ABHA Auth Confirm Failed", details: error.message });
  }
}
