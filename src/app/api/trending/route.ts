import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour server-side

const FALLBACK_MANGA = {
  data: [
    {
      mal_id: 2,
      url: "https://myanimelist.net/manga/2/Berserk",
      title: "Berserk",
      rank: 1,
      score: 9.47,
      images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" } },
      authors: [{ name: "Miura, Kentarou" }],
      genres: [{ name: "Action" }, { name: "Fantasy" }],
      published: { string: "Aug 25, 1989 to ?" }
    },
    {
      mal_id: 13,
      url: "https://myanimelist.net/manga/13/One_Piece",
      title: "One Piece",
      rank: 2,
      score: 9.22,
      images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/2/253132.jpg" } },
      authors: [{ name: "Oda, Eiichiro" }],
      genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
      published: { string: "Jul 22, 1997 to ?" }
    },
    {
      mal_id: 126287,
      url: "https://myanimelist.net/manga/126287/Sousou_no_Frieren",
      title: "Sousou no Frieren (Frieren)",
      rank: 3,
      score: 8.95,
      images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/3/262743.jpg" } },
      authors: [{ name: "Yamada, Kanehito" }],
      genres: [{ name: "Adventure" }, { name: "Fantasy" }],
      published: { string: "Apr 28, 2020 to ?" }
    },
    {
      mal_id: 116778,
      url: "https://myanimelist.net/manga/116778/Chainsaw_Man",
      title: "Chainsaw Man",
      rank: 4,
      score: 8.65,
      images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/3/216464.jpg" } },
      authors: [{ name: "Fujimoto, Tatsuki" }],
      genres: [{ name: "Action" }, { name: "Sci-Fi" }],
      published: { string: "Dec 3, 2018 to ?" }
    },
    {
      mal_id: 1,
      url: "https://myanimelist.net/manga/1/Monster",
      title: "Monster",
      rank: 5,
      score: 9.15,
      images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/3/258224.jpg" } },
      authors: [{ name: "Urasawa, Naoki" }],
      genres: [{ name: "Drama" }, { name: "Mystery" }],
      published: { string: "Dec 5, 1994 to Dec 20, 2001" }
    },
    {
      mal_id: 96792,
      url: "https://myanimelist.net/manga/96792/Kimetsu_no_Yaiba",
      title: "Kimetsu no Yaiba (Demon Slayer)",
      rank: 6,
      score: 8.35,
      images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/3/179023.jpg" } },
      authors: [{ name: "Gotouge, Koyoharu" }],
      genres: [{ name: "Action" }, { name: "Fantasy" }],
      published: { string: "Feb 15, 2016 to May 18, 2020" }
    }
  ]
};

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch("https://api.jikan.moe/v4/top/manga?limit=6&type=manga", {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn("Jikan API rate limited or returned error, using fallback manga list");
      return NextResponse.json(FALLBACK_MANGA);
    }

    const data = await res.json();
    // Verify structure is correct, otherwise fallback
    if (!data || !data.data || data.data.length === 0) {
      return NextResponse.json(FALLBACK_MANGA);
    }
    return NextResponse.json(data);
  } catch (err) {
    console.warn("Fetch to Jikan API failed, returning fallback manga data", err);
    return NextResponse.json(FALLBACK_MANGA);
  }
}

