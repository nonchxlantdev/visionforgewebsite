export type Clang = { play(zone: "perfect" | "good" | "crack", combo: number): void; close(): void };

/** A synthesised anvil hit. Returns null when WebAudio is unavailable. */
export function createClang(): Clang | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  let ctx: AudioContext;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }

  const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);

  return {
    play(zone, combo) {
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.value = zone === "crack" ? 0.18 : 0.32;
      out.connect(ctx.destination);

      const hit = ctx.createBufferSource();
      hit.buffer = noise;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = zone === "crack" ? 900 : 3200;
      hit.connect(band).connect(out);
      hit.start(now);

      if (zone === "crack") return;
      const base = 520 * Math.pow(1.06, Math.min(combo, 8));
      [1, 2.76, 5.4].forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = i === 0 ? "triangle" : "sine";
        osc.frequency.value = base * ratio + (i === 1 ? 7 : 0);
        env.gain.setValueAtTime(zone === "perfect" ? 0.5 / (i + 1) : 0.3 / (i + 1), now);
        env.gain.exponentialRampToValueAtTime(0.0001, now + (zone === "perfect" ? 1.1 : 0.6) / (i + 1));
        osc.connect(env).connect(out);
        osc.start(now);
        osc.stop(now + 1.2);
      });
    },
    close() {
      void ctx.close();
    },
  };
}
