import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour server-side

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://api.jikan.moe/v4/top/manga?limit=6&type=manga", {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({ error: "Jikan API unavailable" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch trending manga" }, { status: 500 });
  }
}
