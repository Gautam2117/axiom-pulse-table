export default function Loading() {
  return (
    <main className="min-h-dvh bg-[#0b0f14] text-white">
      <div className="mx-auto max-w-[1400px] px-3 py-4">
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-6 w-48 animate-pulse rounded bg-white/10" />

        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
