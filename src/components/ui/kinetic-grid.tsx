"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

// Floating paper dust / star speckles for antique library vibe
interface DustParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE = 56; // Grid cell size
const INFLUENCE_RADIUS = 280;
const MAX_WARP = 26;
const DOT_SPACING = 32;
const LERP_SPEED = 0.08;

const LINE_BASE = { r: 217, g: 175, b: 107, a: 0.09 }; // Warm antique parchment grid
const NODE_BASE_RADIUS = 1.6;
const NODE_ACTIVE_RADIUS = 3.4;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number,
): string {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KineticGrid({
  children,
  className,
  globalColor = "book-archive",
}: {
  children?: ReactNode;
  className?: string;
  globalColor?: "default" | "monochrome" | "book-archive";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const targetMouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<DustParticle[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Initialize floating subtle warm particles
  const initParticles = useCallback((w: number, h: number) => {
    const count = 45;
    const particles: DustParticle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.5,
        speedY: -Math.random() * 0.3 - 0.1, // Floating gently upward like paper dust
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    particlesRef.current = particles;
  }, []);

  // ── Warp ────────────────────────────────────────────────────────────────────

  const getWarpedPoint = useCallback(
    (
      gx: number,
      gy: number,
      col: number,
      row: number,
      mouse: Point,
      ripples: Ripple[],
      cols: number,
      rows: number,
    ): { pt: Point; proximity: number } => {
      const edgeMargin = 1.5;
      const colPin = Math.min(
        col / edgeMargin,
        (cols - 1 - col) / edgeMargin,
        1,
      );
      const rowPin = Math.min(
        row / edgeMargin,
        (rows - 1 - row) / edgeMargin,
        1,
      );
      const pinFactor = colPin * colPin * rowPin * rowPin;

      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      // Ripple displacement
      let rx = 0,
        ry = 0;
      for (const r of ripples) {
        const rdx = gx - r.x;
        const rdy = gy - r.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const waveWidth = 60;
        const diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          const strength =
            (1 - Math.abs(diff) / waveWidth) * r.opacity * 20 * pinFactor;
          const angle = Math.atan2(rdy, rdx);
          const sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      // Cursor warp with smooth bell falloff
      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        const t = dist / INFLUENCE_RADIUS;
        const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        const warpAmt = eased * MAX_WARP * pinFactor;
        const angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry,
          },
          proximity,
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity };
    },
    [],
  );

  // ── Draw ────────────────────────────────────────────────────────────────────

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w: W, h: H } = sizeRef.current;
      if (W === 0 || H === 0) return;

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;
      const particles = particlesRef.current;

      // Special Book Archive Palette: Deep vintage mahogany/espresso room with warm golden amber nodes
      const theme = {
        "book-archive": {
          bg: "#0d0c0b", // Deep warm charcoal/espresso
          ambientGradientStart: "#1a1612", // Warm leather / mahogany tint
          ambientGradientEnd: "#080706",
          lineActive: { r: 245, g: 197, b: 66, a: 0.85 }, // Golden foil amber
          nodeActive: { r: 255, g: 215, b: 110, a: 1.0 }, // Gold leaf brilliance
          glow: "245, 197, 66",
          ripple: "250, 204, 88",
          particleColor: "rgba(234, 179, 8, 0.35)",
        },
        default: {
          bg: "#161618",
          ambientGradientStart: "#1c1b1f",
          ambientGradientEnd: "#101012",
          lineActive: { r: 239, g: 68, b: 68, a: 0.9 },
          nodeActive: { r: 248, g: 113, b: 113, a: 1.0 },
          glow: "239,68,68",
          ripple: "248,113,113",
          particleColor: "rgba(255, 255, 255, 0.2)",
        },
        monochrome: {
          bg: "#000000",
          ambientGradientStart: "#0a0a0a",
          ambientGradientEnd: "#000000",
          lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
          nodeActive: { r: 255, g: 255, b: 255, a: 1.0 },
          glow: "255,255,255",
          ripple: "255,255,255",
          particleColor: "rgba(255, 255, 255, 0.2)",
        },
      }[globalColor ?? "book-archive"];

      ctx.clearRect(0, 0, W, H);

      // Radial subtle ambient light in center to feel like an ambient library reading lamp
      const ambientGrd = ctx.createRadialGradient(
        W * 0.5,
        H * 0.35,
        50,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.75,
      );
      ambientGrd.addColorStop(0, theme.ambientGradientStart);
      ambientGrd.addColorStop(1, theme.ambientGradientEnd);
      ctx.fillStyle = ambientGrd;
      ctx.fillRect(0, 0, W, H);

      // Book Library Ambient: Floating Warm Dust / Gold Leaf Specks
      for (let p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = H;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme.particleColor;
        ctx.fill();
      }

      // Static background dot texture with subtle parchment tone
      ctx.fillStyle = "rgba(217, 185, 135, 0.04)";
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 380);
        r.opacity = Math.max(0, 1 - age * 1.1);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      // ── Build warped grid ─────────────────────────────────────────────────
      const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);

      const pts: Point[][] = [];
      const prox: number[][] = [];

      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col++) {
          const { pt, proximity } = getWarpedPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            mouse,
            ripples,
            cols,
            rows,
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      // ── Grid lines ────────────────────────────────────────────────────────
      const drawSeg = (p1: Point, p2: Point, pr1: number, pr2: number) => {
        const avg = (pr1 + pr2) / 2;
        const t = avg * avg * (3 - 2 * avg); // smoothstep
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, t);
        ctx.lineWidth = lerpN(0.75, 1.6, t);
        ctx.stroke();
      };

      ctx.lineCap = "round";

      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols - 1; col++)
          drawSeg(
            pts[row][col],
            pts[row][col + 1],
            prox[row][col],
            prox[row][col + 1],
          );

      for (let col = 0; col < cols; col++)
        for (let row = 0; row < rows - 1; row++)
          drawSeg(
            pts[row][col],
            pts[row + 1][col],
            prox[row][col],
            prox[row + 1][col],
          );

      // ── Intersection nodes ────────────────────────────────────────────────
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = pts[row][col];
          const pr = prox[row][col];
          const t = pr * pr * (3 - 2 * pr); // smoothstep
          const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

          // Outer warm gold glow for active book library nodes
          if (t > 0.25) {
            const glowR = r + lerpN(0, 7, (t - 0.25) / 0.75);
            const grd = ctx.createRadialGradient(
              p.x,
              p.y,
              r * 0.4,
              p.x,
              p.y,
              glowR,
            );
            grd.addColorStop(0, `rgba(${theme.glow}, ${(t * 0.35).toFixed(3)})`);
            grd.addColorStop(1, `rgba(${theme.glow}, 0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          // Node fill: warm parchment gold
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(
            { r: 217, g: 185, b: 135, a: 0.18 },
            theme.nodeActive,
            t,
          );
          ctx.fill();
        }
      }

      // ── Golden Ripple rings on click ──────────────────────────────────────
      for (const r of ripples) {
        const safeRadius = Math.max(0, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${theme.ripple}, ${(r.opacity * 0.35).toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    },
    [getWarpedPoint, globalColor],
  );

  // ── Animation loop ──────────────────────────────────────────────────────────

  const animate = useCallback(
    (now: number) => {
      const m = mouseRef.current;
      const t = targetMouseRef.current;

      m.x = lerpN(m.x, t.x, LERP_SPEED);
      m.y = lerpN(m.y, t.y, LERP_SPEED);

      draw(now);
      rafRef.current = requestAnimationFrame(animate);
    },
    [draw],
  );

  // ── Setup ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { w, h };
      initParticles(w, h);
      if (mouseRef.current.x === -9999) {
        mouseRef.current = { x: -9999, y: -9999 };
        targetMouseRef.current = { x: -9999, y: -9999 };
      }
    };

    setSize();
    window.addEventListener("resize", setSize);

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, initParticles]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "relative w-full min-h-screen overflow-hidden",
        globalColor === "monochrome"
          ? "bg-[#000000]"
          : globalColor === "book-archive"
          ? "bg-[#0d0c0b]"
          : "bg-[#161618]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
