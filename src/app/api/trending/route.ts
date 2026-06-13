import { NextResponse } from "next/server";

export const revalidate = 3600;

// ---------- Jikan raw shape (only what we use) ----------
interface JikanManga {
  mal_id: number;
  url: string;
  title: string;
  title_english: string | null;
  rank: number;
  score: number | null;
  members: number;
  images: { jpg: { image_url: string; large_image_url: string } };
  authors: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  themes: Array<{ name: string }>;
  demographics: Array<{ name: string }>;
  status: string;
  volumes: number | null;
  chapters: number | null;
  synopsis: string | null;
  published: { string: string };
}

// ---------- Normalised shape exposed to the client ----------
export interface TrendingItem {
  id: number;
  title: string;
  titleEn: string | null;
  rank: number;
  score: number | null;
  members: number;
  imageUrl: string;
  url: string;
  authors: string[];
  genres: string[];
  themes: string[];
  demographic: string | null;
  status: string;
  volumes: number | null;
  chapters: number | null;
  synopsis: string | null;
  published: string;
}

function normalize(raw: JikanManga): TrendingItem {
  return {
    id: raw.mal_id,
    title: raw.title,
    titleEn: raw.title_english ?? null,
    rank: raw.rank,
    score: raw.score ?? null,
    members: raw.members,
    imageUrl: raw.images.jpg.large_image_url || raw.images.jpg.image_url,
    url: raw.url,
    authors: raw.authors.map((a) => a.name),
    genres: raw.genres.map((g) => g.name),
    themes: raw.themes.map((t) => t.name),
    demographic: raw.demographics[0]?.name ?? null,
    status: raw.status,
    volumes: raw.volumes ?? null,
    chapters: raw.chapters ?? null,
    synopsis: raw.synopsis ?? null,
    published: raw.published?.string ?? "",
  };
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/top/manga?limit=12&type=manga",
      { next: { revalidate: 3600 }, signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Jikan API unavailable", items: [] },
        { status: 502 }
      );
    }

    const json = await res.json();
    const items: TrendingItem[] = (json.data ?? []).map(normalize);

    return NextResponse.json({ items });
  } catch (err) {
    clearTimeout(timeout);
    const isAbort = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: isAbort ? "Request timed out" : "Fetch failed", items: [] },
      { status: isAbort ? 504 : 500 }
    );
  }
}
