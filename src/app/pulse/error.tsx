"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-dvh bg-[#0b0f14] text-white">
      <div className="mx-auto max-w-[900px] px-3 py-10">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/70">{error.message}</p>

        <button
          onClick={reset}
          className="mt-5 rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
