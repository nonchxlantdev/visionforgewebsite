"use client";

import {
  CalendarDays,
  ChartColumn,
  ClipboardList,
  CreditCard,
  Globe,
  MessageCircle,
  Pause,
  Play,
  Receipt,
  Table,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CatmullRomCurve3, CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, TubeGeometry, Vector3 } from "three";
import { cameraDistance, HUB_BODY_Y, HUB_TOOLS, hubCableEnd, hubPhase, tileLayout, type HubToolId } from "@/lib/hub";

const ICONS: Record<HubToolId, LucideIcon> = {
  whatsapp: MessageCircle,
  sheets: Table,
  forms: ClipboardList,
  bookings: CalendarDays,
  accounting: Receipt,
  website: Globe,
  payments: CreditCard,
  reports: ChartColumn,
};

const LOGO_SRC = "/brand/vision-forge-logo-512.webp";
// Matched to the logo: navy hub, brushed-silver tiles, gold light.
const COLORS = {
  ink: 0x0b1626,
  tile: 0xd9dee6,
  cableIdle: 0x3a475c,
  glow: 0xe7b54a,
  coral: 0xe8573f,
  green: 0x2fbf7f,
} as const;

const CAPTION = {
  off: "Today: tools that don't talk to each other",
  on: "With Vision Forge: everything connected",
} as const;

const clamp = (u: number) => Math.min(0.999, Math.max(0.001, Number.isFinite(u) ? u : 0));

/** Draws one tile top: the tool's icon and its name. */
async function tileTexture(svgMarkup: string, label: string, fontFamily: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const face = ctx.createLinearGradient(0, 0, 512, 512);
  face.addColorStop(0, "#f4f6f9");
  face.addColorStop(1, "#d5dbe3");
  ctx.fillStyle = face;
  ctx.fillRect(0, 0, 512, 512);
  const svg = svgMarkup.replace(/currentColor/g, "#0b1626").replace(/width="\d+"/, 'width="200"').replace(/height="\d+"/, 'height="200"');
  const img = new window.Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode().catch(() => undefined);
  ctx.drawImage(img, 156, 96, 200, 200);
  ctx.fillStyle = "#0b1626";
  ctx.font = `700 54px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillText(label, 256, 392);
  return canvas;
}

/** A soft round glow used under the hub. */
function haloTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  return canvas;
}

function Fallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-5">
      <div className="rounded-3xl border border-gold/40 bg-ink-hover p-6 shadow-[0_0_50px_rgba(231,181,74,0.25)]">
        <Image src="/brand/vision-forge-logo.png" alt="" width={1348} height={1114} className="h-20 w-auto" sizes="100px" />
      </div>
      <ul className="flex max-w-xl flex-wrap justify-center gap-2">
        {HUB_TOOLS.map((tool) => {
          const Icon = ICONS[tool.id];
          return (
            <li key={tool.id} className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[14px] font-semibold text-paper">
              <Icon aria-hidden className="h-4 w-4 text-gold" />
              {tool.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The homepage's 3D hub: everyday tools, disconnected and then connected to Vision Forge. */
export function HubScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [fallback, setFallback] = useState(false);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const iconBox = iconsRef.current;
    if (!wrap || !canvas || !iconBox) return;

    let disposed = false;
    let started = false;
    let cleanup: () => void = () => undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduceMotion);

    async function start() {
      if (started || disposed || !canvas || !wrap || !iconBox) return;
      started = true;
      try {
        const THREE = await import("three");
        const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.shadowMap.enabled = true;
        // The "soft" PCF mode was removed from three.js; PCF plus a shadow radius gives the same soft edge.
        renderer.shadowMap.type = THREE.PCFShadowMap;
        // Our materials are all three.js built-ins; skipping the per-shader check avoids noisy driver
        // warnings in the console and speeds up first render (three.js recommends this in production).
        renderer.debug.checkShaderErrors = false;

        const scene = new THREE.Scene();
        // Soft studio reflections so the silver tiles and the logo read as polished metal.
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;
        scene.environmentIntensity = 0.55;
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

        scene.add(new THREE.HemisphereLight(0xdfe6f0, 0x0b1626, 1.1));
        const sun = new THREE.DirectionalLight(0xffffff, 2.4);
        sun.position.set(4, 11, 7);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        sun.shadow.camera.left = -9;
        sun.shadow.camera.right = 9;
        sun.shadow.camera.top = 9;
        sun.shadow.camera.bottom = -9;
        sun.shadow.radius = 6;
        scene.add(sun);
        // Sits low, below the hub's top, so it lights the floor, cables and tiles but not the logo.
        const hubLight = new THREE.PointLight(COLORS.glow, 0, 9, 1.6);
        hubLight.position.set(0, 0.3, 0);
        scene.add(hubLight);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.45 }));
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // Hub: a raised navy block carrying the logo.
        const hub = new THREE.Group();
        const hubBody = new THREE.Mesh(
          new RoundedBoxGeometry(2.5, 0.9, 2.5, 5, 0.22),
          new THREE.MeshStandardMaterial({ color: COLORS.ink, roughness: 0.5, metalness: 0.35 }),
        );
        hubBody.position.y = HUB_BODY_Y;
        hubBody.castShadow = true;
        hub.add(hubBody);
        const logoTex = await new THREE.TextureLoader().loadAsync(LOGO_SRC);
        logoTex.colorSpace = THREE.SRGBColorSpace;
        logoTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const logo = new THREE.Mesh(
          new THREE.PlaneGeometry(1.95, 1.61),
          new THREE.MeshStandardMaterial({ map: logoTex, transparent: true, roughness: 0.35, metalness: 0.25 }),
        );
        logo.rotation.x = -Math.PI / 2;
        logo.position.y = HUB_BODY_Y + 0.455;
        hub.add(logo);
        const halo = new THREE.Mesh(
          new THREE.PlaneGeometry(8, 8),
          new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(haloTexture()),
            color: COLORS.glow,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        halo.rotation.x = -Math.PI / 2;
        halo.position.y = 0.02;
        hub.add(halo);
        scene.add(hub);

        // Tool tiles, their cables and the light pulses that travel along them.
        const fontFamily = getComputedStyle(document.body).fontFamily;
        await document.fonts.ready;
        const portrait = wrap.clientWidth < wrap.clientHeight;
        const spots = tileLayout(HUB_TOOLS.length, portrait);
        const tileGeo = new RoundedBoxGeometry(1.3, 0.48, 1.3, 4, 0.16);
        const topGeo = new THREE.PlaneGeometry(1.12, 1.12);
        const badgeGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.1, 24);
        const pulseGeo = new THREE.SphereGeometry(0.075, 16, 12);
        const pulseMat = new THREE.MeshBasicMaterial({ color: COLORS.glow, transparent: true, opacity: 0 });

        type Tile = {
          group: Group;
          home: Vector3;
          scatter: Vector3;
          spin: number;
          phase: number;
          badge: Mesh<CylinderGeometry, MeshStandardMaterial>;
        };
        const tiles: Tile[] = [];
        const cables: Array<{ mesh: Mesh<TubeGeometry, MeshStandardMaterial>; curve: CatmullRomCurve3; pulses: Mesh[]; speed: number }> = [];

        for (const [i, tool] of HUB_TOOLS.entries()) {
          const [x, z] = spots[i];
          const svg = iconBox.querySelector(`[data-icon="${tool.id}"] svg`)?.outerHTML ?? "";
          const top = new THREE.CanvasTexture(await tileTexture(svg, tool.label, fontFamily));
          top.colorSpace = THREE.SRGBColorSpace;
          top.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const group = new THREE.Group();
          const body = new THREE.Mesh(tileGeo, new THREE.MeshStandardMaterial({ color: COLORS.tile, roughness: 0.32, metalness: 0.75 }));
          body.position.y = 0.24;
          body.castShadow = true;
          body.receiveShadow = true;
          group.add(body);
          const face = new THREE.Mesh(topGeo, new THREE.MeshStandardMaterial({ map: top, roughness: 0.45, metalness: 0.2 }));
          face.rotation.x = -Math.PI / 2;
          face.position.y = 0.485;
          group.add(face);

          const badge = new THREE.Mesh(
            badgeGeo,
            new THREE.MeshStandardMaterial({
              color: COLORS.coral,
              emissive: COLORS.coral,
              emissiveIntensity: 0.45,
            }),
          );
          badge.position.set(0.55, 0.55, -0.55);
          group.add(badge);

          const home = new THREE.Vector3(x, 0, z);
          const away = new THREE.Vector3(x, 0, z).normalize().multiplyScalar(0.35);
          const scatter = home.clone().add(new THREE.Vector3(away.x + (i % 2 ? 0.18 : -0.18), 0, away.z + (i % 3 ? -0.14 : 0.14)));
          group.position.copy(scatter);
          scene.add(group);
          tiles.push({
            group,
            home,
            scatter,
            spin: (i % 2 ? 1 : -1) * (0.18 + (i % 3) * 0.06),
            phase: i * 0.7,
            badge,
          });

          const dir = new THREE.Vector3(-x, 0, -z).normalize();
          const startPt = new THREE.Vector3(x, 0.08, z).addScaledVector(dir, 0.7);
          const contact = hubCableEnd(x, z);
          const endPt = new THREE.Vector3(contact.x, contact.y, contact.z);
          const out = new THREE.Vector3(x, 0, z).normalize();
          const bend = new THREE.Vector3(-out.z, 0, out.x).multiplyScalar(i % 2 ? 0.22 : -0.22);
          const mid = startPt.clone().lerp(endPt, 0.5).add(bend);
          // Runs hub → tile, so a partial draw range looks like the cable growing out from Vision Forge.
          const curve = new THREE.CatmullRomCurve3([endPt, mid, startPt]);
          const mesh = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 48, 0.05, 8, false),
            new THREE.MeshStandardMaterial({ color: COLORS.cableIdle, emissive: COLORS.glow, emissiveIntensity: 0, roughness: 0.28, metalness: 0.8 }),
          );
          scene.add(mesh);
          const pulses = [0, 1].map(() => {
            const p = new THREE.Mesh(pulseGeo, pulseMat);
            scene.add(p);
            return p;
          });
          cables.push({ mesh, curve, pulses, speed: 0.32 + (i % 3) * 0.06 });
        }

        const idle = new THREE.Color(COLORS.cableIdle);
        const lit = new THREE.Color(COLORS.glow);
        const coral = new THREE.Color(COLORS.coral);
        const green = new THREE.Color(COLORS.green);
        const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        let mix = reduceMotion ? 1 : 0;
        let elapsed = reduceMotion ? 999_999 : 0;
        let clock = performance.now();
        let visible = true;
        let frame = 0;
        let lastConnected: boolean | null = null;

        const resize = () => {
          const { width, height } = wrap.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };

        const place = (time: number, motion: boolean) => {
          const dist = cameraDistance(camera.aspect);
          const azimuth = (motion ? Math.sin(time * 0.00012) * 0.07 : 0) + pointer.x * 0.12;
          const elevation = 0.92 + pointer.y * 0.05;
          camera.position.set(Math.sin(azimuth) * Math.cos(elevation) * dist, Math.sin(elevation) * dist, Math.cos(azimuth) * Math.cos(elevation) * dist);
          camera.lookAt(0, 0, 0.55);

          for (const t of tiles) {
            t.group.position.lerpVectors(t.scatter, t.home, mix);
            t.group.position.y = mix * 0.12 + (motion ? Math.sin(time * 0.0015 + t.phase) * 0.04 : 0);
            t.group.rotation.y = t.spin * (1 - mix);
            t.badge.material.color.lerpColors(coral, green, mix);
            t.badge.material.emissive.lerpColors(coral, green, mix);
          }
          for (const c of cables) {
            c.mesh.material.color.lerpColors(idle, lit, mix);
            c.mesh.material.emissiveIntensity = mix * 0.22;
            const count = c.mesh.geometry.index?.count ?? 0;
            c.mesh.visible = mix > 0.01;
            c.mesh.geometry.setDrawRange(0, Math.floor((count * mix) / 6) * 6);
            c.pulses.forEach((p, k) => {
              // Pulses flow from the tool into the hub. Clamp: float error can push u past the curve's end.
              const u = (time * 0.001 * c.speed + k * 0.5) % 1;
              p.position.copy(c.curve.getPointAt(clamp(1 - u)));
              p.position.y += 0.02;
              p.visible = mix > 0.6;
            });
          }
          pulseMat.opacity = Math.max(0, (mix - 0.6) / 0.4);
          hubLight.intensity = mix * 12;
          (halo.material as MeshBasicMaterial).opacity = mix * 0.7;
          hubBody.position.y = HUB_BODY_Y + mix * 0.06;
          logo.position.y = HUB_BODY_Y + 0.455 + mix * 0.06;
        };

        const render = (now: number) => {
          // Cap a single step so a slow phone or a background tab doesn't jump, without making slow devices crawl.
          const dt = Math.min(250, Math.max(0, now - clock));
          clock = now;
          const motion = !reduceMotion && !pausedRef.current;
          if (motion) elapsed += dt;
          const phase = hubPhase(elapsed);
          if (phase.connected !== lastConnected) {
            lastConnected = phase.connected;
            setConnected(phase.connected);
          }
          const target = phase.connected ? 1 : 0;
          if (motion) mix += (target - mix) * Math.min(1, dt * 0.0035);
          pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 0.004);
          pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 0.004);
          place(motion ? elapsed : 0, motion);
          renderer.render(scene, camera);
        };

        const tick = (now: number) => {
          frame = 0;
          if (disposed) return;
          render(now);
          if (visible && !reduceMotion && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const wake = () => {
          if (!frame && visible && !document.hidden && !reduceMotion) {
            clock = performance.now();
            frame = requestAnimationFrame(tick);
          }
        };

        const onPointer = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = wrap.getBoundingClientRect();
          pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        const onLeave = () => {
          pointer.tx = 0;
          pointer.ty = 0;
        };
        const ro = new ResizeObserver(() => {
          resize();
          render(performance.now());
        });
        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          wake();
        });
        const onVisibility = () => wake();

        resize();
        ro.observe(wrap);
        io.observe(wrap);
        document.addEventListener("visibilitychange", onVisibility);
        if (!reduceMotion) {
          wrap.addEventListener("pointermove", onPointer);
          wrap.addEventListener("pointerleave", onLeave);
        }
        render(performance.now());
        wake();

        cleanup = () => {
          cancelAnimationFrame(frame);
          ro.disconnect();
          io.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          wrap.removeEventListener("pointermove", onPointer);
          wrap.removeEventListener("pointerleave", onLeave);
          scene.traverse((object) => {
            const mesh = object as Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const material of materials) {
              const withMap = material as MeshStandardMaterial;
              withMap.map?.dispose();
              material.dispose();
            }
          });
          envMap.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
        };
        if (disposed) cleanup();
      } catch {
        if (!disposed) setFallback(true);
      }
    }

    const gate = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gate.disconnect();
          void start();
        }
      },
      { rootMargin: "200px" },
    );
    gate.observe(wrap);

    return () => {
      disposed = true;
      gate.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={wrapRef} className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[2/1]">
        {fallback ? <Fallback /> : <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />}
      </div>
      <p className="sr-only">
        An illustration of a business&apos;s everyday tools: {HUB_TOOLS.map((tool) => tool.label).join(", ")}. At first they don&apos;t talk to
        each other, and paper forms, accounting and reports slow things down. Then each one connects to Vision Forge in the middle, and work
        flows between them.
      </p>
      {fallback ? null : (
        <div className="mx-auto mt-2 flex max-w-md items-center justify-center gap-3">
          {reduced ? null : (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Play animation" : "Pause animation"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-paper transition-colors hover:bg-white/10"
            >
              {paused ? <Play aria-hidden className="h-4 w-4" /> : <Pause aria-hidden className="h-4 w-4" />}
            </button>
          )}
          <p aria-live="polite" className="text-[15px] font-semibold text-paper">
            <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle ${connected ? "bg-gold" : "bg-[#e8573f]"}`} aria-hidden />
            {connected ? CAPTION.on : CAPTION.off}
          </p>
        </div>
      )}
      <div ref={iconsRef} aria-hidden="true" className="hidden">
        {HUB_TOOLS.map((tool) => {
          const Icon = ICONS[tool.id];
          return (
            <span key={tool.id} data-icon={tool.id}>
              <Icon width={24} height={24} strokeWidth={1.75} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
