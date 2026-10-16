// Shared premium UI primitives — Editorial Luxury system.
// Thin-line icons (Phosphor-light style), double-bezel cards, eyebrow tags.
import { useRef } from "react";

const ic = "stroke-current fill-none";
const sw = 1.25;

export const Icon = {
  funnel: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  channels: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
    </svg>
  ),
  chart: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M4 4v16h16" strokeLinecap="round" />
      <path d="M8 14l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  ),
  crane: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M5 21V5l14 2M5 8h9M5 5l4-2M11 8v4m0 0H8m3 0h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  handshake: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M3 8l4-2 5 3 5-3 4 2v7l-4 2-3-2M3 8v7l4 2 3-2 2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M6 3h8l4 4v14H6V3Z" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  ),
  people: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" strokeLinecap="round" />
    </svg>
  ),
  gauge: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M4 16a8 8 0 1 1 16 0" strokeLinecap="round" />
      <path d="M12 16l4-4" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" className="fill-current" />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  track: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M3 12h4l2-7 3 14 2-7h7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  grid: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  ),
  spark: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" strokeLinecap="round" />
    </svg>
  ),
  route: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5" strokeLinecap="round" />
    </svg>
  ),
  arrow: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={1.4} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowUpRight: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={1.4} {...p}>
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={1.5} {...p}>
      <path d="M5 12l4 4 10-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sprout: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 21v-7" strokeLinecap="round" />
      <path d="M12 14c0-3.3-2.7-5-6-5 0 3.3 2.7 5 6 5Z" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 12c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  truck: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M3 6h11v9H3z" strokeLinejoin="round" />
      <path d="M14 9h4l3 3v3h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  ),
  box: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" strokeLinejoin="round" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  drop: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" strokeLinejoin="round" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  calc: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 19h6" strokeLinecap="round" />
    </svg>
  ),
  bell: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 3l9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5M3 17l9 5 9-5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  calendar: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4M8 13h2M12 13h0M8 17h2M14 13h2" strokeLinecap="round" />
    </svg>
  ),
  coins: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <ellipse cx="9" cy="7" rx="5" ry="2.5" />
      <path d="M4 7v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" strokeLinecap="round" />
      <path d="M14 12.5c.6.3 1.3.5 2 .5 2.8 0 5-1.1 5-2.5s-2.2-2.5-5-2.5c-1 0-1.9.1-2.6.4" strokeLinecap="round" />
      <path d="M14 17c.9.3 2 .5 3 .5 2.8 0 5-1.1 5-2.5" strokeLinecap="round" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
    </svg>
  ),
  flow: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <rect x="3" y="4" width="7" height="5" rx="1.5" />
      <rect x="14" y="15" width="7" height="5" rx="1.5" />
      <path d="M6.5 9v4a4 4 0 0 0 4 4H14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  map: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" strokeLinecap="round" />
    </svg>
  ),
  warn: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M12 4 21 19H3L12 4Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h0" strokeLinecap="round" />
    </svg>
  ),
  repeat: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M4 9a6 6 0 0 1 6-6h7M4 9l3-3M4 9l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15a6 6 0 0 1-6 6H7M20 15l-3 3M20 15l-3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  beaker: (p) => (
    <svg viewBox="0 0 24 24" className={ic} strokeWidth={sw} {...p}>
      <path d="M9 3v6l-4 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-4-9V3" strokeLinejoin="round" />
      <path d="M8 3h8M6.5 15h11" strokeLinecap="round" />
    </svg>
  ),
};

export function Eyebrow({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-espresso/15 bg-espresso/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-umber ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-ember" />
      {children}
    </span>
  );
}

// Double-bezel card: outer machined tray + inner core with inset highlight.
export function Bezel({ children, className = "", inner = "", tone = "light" }) {
  const trays = {
    light: "bg-white/25 ring-1 ring-white/50",
    warm: "bg-white/25 ring-1 ring-white/50",
    dark: "bg-bark/40 ring-1 ring-white/15",
  };
  const cores = {
    light: "glass-card",
    warm: "glass-card",
    dark: "bg-bark text-cream shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]",
  };
  return (
    <div className={`rounded-[2rem] p-1.5 ${trays[tone]} ${className}`}>
      <div className={`h-full rounded-[calc(2rem-0.375rem)] ${cores[tone]} ${inner}`}>{children}</div>
    </div>
  );
}

export function IconCircle({ glyph: Glyph, className = "", tone = "ember" }) {
  const tones = {
    ember: "bg-ember/10 text-ember ring-ember/15",
    bark: "bg-bark/[0.06] text-bark ring-bark/10",
    sage: "bg-sage/12 text-sage ring-sage/20",
    cream: "bg-white/10 text-cream ring-white/15",
  };
  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${tones[tone]} ${className}`}>
      <Glyph className="h-6 w-6 stroke-current fill-none" />
    </span>
  );
}

export function PillButton({ children, tone = "dark" }) {
  const tones = {
    dark: "bg-espresso text-cream",
    ember: "bg-ember text-cream",
    ghost: "bg-espresso/[0.04] text-espresso ring-1 ring-espresso/10",
  };
  return (
    <span className={`group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-500 ease-spring active:scale-[0.98] ${tones[tone]}`}>
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
        <Icon.arrowUpRight className="h-4 w-4" />
      </span>
    </span>
  );
}

// staggered float-up; pass index for delay
export function Reveal({ children, i = 0, className = "" }) {
  return (
    <div className={`animate-floatUp ${className}`} style={{ animationDelay: `${120 + i * 90}ms` }}>
      {children}
    </div>
  );
}

// Magnetic 3D tilt — follows the mouse (disabled for touch). Wrap any card.
export function Tilt({ children, className = "", max = 7 }) {
  const ref = useRef(null);
  const raf = useRef(0);

  function onMove(e) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale(1.015)`;
    });
  }
  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`[transition:transform_400ms_cubic-bezier(0.32,0.72,0,1)] will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
