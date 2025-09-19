import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const domain = email.split("@")[1];

  try {
    const resp = await fetch(
      `https://api.api-ninjas.com/v1/mxlookup?domain=${domain}`,
      {
        headers: {
          "X-Api-Key": process.env.API_NINJAS_KEY as string,
        },
      }
    );

    if (!resp.ok) {
      res.status(resp.status).json({ error: "Failed to fetch MX records" });
      return;
    }

    const data: { priority: number; value: string }[] = await resp.json();

    const microsoftPatterns = [
      /\.outlook\.com$/i,
      /\.protection\.outlook\.com\.?$/i,
      /\.office365\.com$/i,
      /\.microsoft\.com$/i,
      /\.mail\.protection\.office365\.us$/i,
    ];

    const isMicrosoft = data.some((record) =>
      microsoftPatterns.some((pattern) => pattern.test(record.value))
    );

    res.status(200).json({ isMicrosoft });
  } catch {
    res.status(500).json({ error: "MX lookup failed" });
  }
}
