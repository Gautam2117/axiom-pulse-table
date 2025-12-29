export function hashColor(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 80% 55%)`;
}
