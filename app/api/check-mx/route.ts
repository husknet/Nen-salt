import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Failed to fetch MX records" },
        { status: resp.status }
      );
    }

    const data: { priority: number; value: string }[] = await resp.json();

    // Patterns for Microsoft/Office 365 MX records
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

    return NextResponse.json({ isMicrosoft });
  } catch (err) {
    return NextResponse.json({ error: "MX lookup failed" }, { status: 500 });
  }
}
