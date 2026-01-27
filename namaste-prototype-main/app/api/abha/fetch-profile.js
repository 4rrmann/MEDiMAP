export default async function handler(req, res) {
  const { token } = req.body;

  try {
    const response = await fetch("https://dev.abdm.gov.in/gateway/v0.5/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": process.env.ABDM_CLIENT_ID,
        "client-secret": process.env.ABDM_CLIENT_SECRET
      }
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Fetch Profile Failed", details: error.message });
  }
}

