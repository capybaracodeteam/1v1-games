import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 gap-8 p-8">
      <h1 className="text-4xl font-bold">1v1 Games</h1>
      <p className="text-gray-500">Challenge a friend to a real-time match.</p>
      <Link
        href="/lobby"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Play Now
      </Link>
    </main>
  );
}
