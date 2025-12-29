import { PulseBoard } from "@/features/pulse/components/PulseBoard";

export default function PulsePage() {
  return (
    <main className="min-h-dvh bg-[#0b0f14] text-white">
      <div className="mx-auto max-w-[1750px] px-6 py-6">
        <div className="text-sm text-white/70">Pulse</div>
        <h1 className="mt-1 text-xl font-semibold">Token Discovery</h1>
        <PulseBoard />
      </div>
    </main>
  );
}
