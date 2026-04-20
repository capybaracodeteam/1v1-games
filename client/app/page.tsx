import Link from "next/link";

const games = [
  { href: "/lobby?game=rps", emoji: "✊", label: "RPS", slug: "rps" },
  { href: "/lobby?game=wordle", emoji: "📝", label: "Wordle", slug: "wordle" },
  { href: "/lobby?game=tetris", emoji: "🧱", label: "Tetris", slug: "tetris" },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 gap-12 px-6 py-16 bg-background">

      {/* VS Header */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <p className="font-bebas text-6xl sm:text-8xl text-foreground leading-none">1</p>
        </div>

        <div className="flex flex-col items-center shrink-0 px-4">
          <span
            className="font-bebas text-7xl sm:text-9xl text-accent leading-none"
            style={{ textShadow: "0 0 40px #F5C518, 0 0 80px #F5C51866" }}
          >
            VS
          </span>
        </div>

        <div className="flex-1 text-left">
          <p className="font-bebas text-6xl sm:text-8xl text-foreground leading-none">1</p>
        </div>
      </div>

      {/* Subtitle */}
      <div className="text-center space-y-2">
        <div className="h-px w-48 bg-accent/30 mx-auto" />
        <p className="font-bebas text-2xl tracking-[0.3em] text-foreground/60 uppercase">Pick Your Game</p>
        <div className="h-px w-48 bg-accent/30 mx-auto" />
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={game.href}
            className="
              group flex flex-col items-center gap-4 p-8
              border border-white/10 rounded-2xl bg-white/5
              transition-all duration-200
              hover:border-accent/60 hover:bg-accent/5
              hover:shadow-[0_0_24px_-4px_#F5C51844]
            "
          >
            <span className="text-5xl">{game.emoji}</span>
            <span className="font-bebas text-xl tracking-wider text-foreground group-hover:text-accent transition-colors duration-200 text-center">
              {game.label}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
