"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Star, RefreshCw } from "lucide-react";

interface MangaEntry {
  mal_id: number;
  url: string;
  title: string;
  rank: number;
  score: number | null;
  images: { jpg: { image_url: string } };
  authors: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  published: { string: string };
}

const GENRE_COLORS: Record<string, string> = {
  Action: "text-brand-pink border-brand-pink/30 bg-brand-pink/10",
  Adventure: "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10",
  Fantasy: "text-brand-purple border-brand-purple/30 bg-brand-purple/10",
  Romance: "text-pink-400 border-pink-400/30 bg-pink-400/10",
  Drama: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "Slice of Life": "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Horror: "text-red-400 border-red-400/30 bg-red-400/10",
  Mystery: "text-violet-400 border-violet-400/30 bg-violet-400/10",
  "Sci-Fi": "text-sky-400 border-sky-400/30 bg-sky-400/10",
};

function genreClass(name: string) {
  return GENRE_COLORS[name] ?? "text-slate-400 border-white/10 bg-white/5";
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden manga-card-panel flex flex-col animate-pulse">
      <div className="w-full aspect-[3/4] bg-white/5" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 w-1/3 bg-white/5 rounded" />
        <div className="h-4 w-4/5 bg-white/8 rounded" />
        <div className="h-3 w-1/2 bg-white/5 rounded" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-4 w-14 bg-white/5 rounded-full" />
          <div className="h-4 w-14 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function TrendingManga() {
  const [manga, setManga] = useState<MangaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch("/api/trending")
      .then((r) => {
        if (!r.ok) throw new Error("api error");
        return r.json();
      })
      .then((data) => {
        setManga(data.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [refreshKey]);

  return (
    <section className="py-24 relative overflow-hidden bg-brand-bg bg-manga-draft-grid bg-manga-screentone">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-pink/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-purple/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-brand-cyan uppercase mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Estudo de Traço · Referências de Estilo Consagradas
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Inspire seu Traço com{" "}
              <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink bg-clip-text text-transparent">
                Estilos de Sucesso
              </span>
            </h3>
            <p className="text-slate-400 font-light text-sm mt-3 max-w-2xl">
              Estude as técnicas e os traços das maiores obras do mundo. Nossa IA analisa a line-art e as retículas desses títulos populares para calibrar seus pincéis e guias de perspectiva.
            </p>
          </div>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl manga-card-panel border-white/10 hover:border-brand-cyan/40 text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-40 self-start sm:self-auto flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        {/* Grid */}
        {error ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            Não foi possível carregar os dados. Verifique sua conexão.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : manga.map((item, i) => (
                  <motion.a
                    key={item.mal_id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="group overflow-hidden manga-card-panel flex flex-col cursor-pointer"
                    whileHover={{ y: -5 }}
                  >
                    {/* Cover */}
                    <div className="relative w-full aspect-[3/4] bg-slate-950 overflow-hidden">
                      <Image
                        src={item.images.jpg.image_url}
                        alt={item.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />

                      {/* Rank badge */}
                      <div className="absolute top-2 left-2 bg-brand-bg/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-mono font-bold text-brand-cyan">
                        #{item.rank}
                      </div>

                      {/* Score badge */}
                      {item.score && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-brand-bg/85 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-yellow-500/20 text-[10px] font-mono font-bold text-yellow-400">
                          <Star className="w-2.5 h-2.5 fill-yellow-400" />
                          {item.score.toFixed(1)}
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan bg-brand-cyan/15 px-2.5 py-1 rounded-full border border-brand-cyan/20">
                          Estudar Estilo IA
                        </span>
                        <span className="text-[9px] text-slate-300 font-light">
                          Analise line-art & retículas
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col gap-1.5 flex-grow bg-[#0C0915]">
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        {item.authors[0]?.name ?? "—"}
                      </p>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-auto pt-1">
                        {item.genres.slice(0, 2).map((g) => (
                          <span
                            key={g.name}
                            className={`px-1.5 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wider ${genreClass(g.name)}`}
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.a>
                ))}
          </div>
        )}

        {/* Attribution */}
        <p className="text-[10px] font-mono text-slate-600 text-center mt-8">
          Dados fornecidos pela{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-400 transition-colors"
          >
            Jikan API
          </a>{" "}
          · MyAnimeList · Atualização automática a cada hora
        </p>
      </div>
    </section>
  );
}
