import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 gap-8 p-8">
      <h1 className="text-4xl font-bold">1v1 Games</h1>
      <p className="text-gray-500">Challenge a friend to a real-time match.</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/lobby?game=rps"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors text-center"
        >
          Rock Paper Scissors
        </Link>
        <Link
          href="/lobby?game=wordle"
          className="px-6 py-3 bg-purple-600 text-white rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors text-center"
        >
          Wordle
        </Link>
        <Link
          href="/lobby?game=tetris"
          className="px-6 py-3 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors text-center"
        >
          Tetris
        </Link>
      </div>
    </main>
  );
}
