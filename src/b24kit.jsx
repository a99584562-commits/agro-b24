/* eslint-disable react-refresh/only-export-components */
// Мини-набор «как в Битрикс24» (интерфейс 2025–2026): синий градиентный фон, узкое меню
// слева, верхняя панель, цветные «стрелки» стадий, плашки таймлайна. Только визуал.

export const B24_FONT = { fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif' };
export const B24_BG = "linear-gradient(135deg, #0b2a9e 0%, #1346d8 38%, #2a6ff2 72%, #4f9cff 100%)";

const s = "stroke-current fill-none";
export const BI = {
  menu: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.8" {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  ),
  home: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <path d="M4 11l8-6 8 6v8H4z" strokeLinejoin="round" />
    </svg>
  ),
  feed: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  ),
  chat: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <path d="M5 5h14v10H10l-4 4v-4H5z" strokeLinejoin="round" />
    </svg>
  ),
  cal: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" strokeLinecap="round" />
    </svg>
  ),
  crm: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <path d="M4 6h16l-6 7v5l-4 2v-7z" strokeLinejoin="round" />
    </svg>
  ),
  task: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  robot: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 4v4M9 13h0M15 13h0M9 16h6" strokeLinecap="round" />
    </svg>
  ),
  gear: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.8" {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" strokeLinecap="round" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinejoin="round" />
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="2" {...p}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="2.2" {...p}>
      <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pencil: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <path d="M4 20l4-1 11-11-3-3L5 16z" strokeLinejoin="round" />
    </svg>
  ),
  bp: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <rect x="3" y="4" width="8" height="5" rx="1.2" />
      <rect x="13" y="15" width="8" height="5" rx="1.2" />
      <path d="M7 9v3a3 3 0 0 0 3 3h3" strokeLinecap="round" />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" className={s} strokeWidth="1.6" {...p}>
      <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
      <path d="M14 3v4h4" />
    </svg>
  ),
};

/** Оболочка портала: синий фон, узкое меню слева, верхняя панель. */
export function B24Shell({ tabs = [], active = 0, rail = 4, children, className = "" }) {
  const RAIL = [BI.home, BI.feed, BI.chat, BI.cal, BI.crm, BI.task, BI.robot, BI.gear];
  return (
    <div className={`relative flex overflow-hidden text-[#333] ${className}`} style={{ ...B24_FONT, background: B24_BG }}>
      {/* rail */}
      <div className="hidden w-11 shrink-0 flex-col items-center gap-2.5 pt-3 sm:flex">
        <BI.menu className={`${s} h-[18px] w-[18px] text-white/80`} />
        <div className="mt-1 flex flex-col items-center gap-2">
          {RAIL.map((G, k) => (
            <span key={k} className={`flex h-7 w-7 items-center justify-center rounded-lg ${k === rail ? "bg-white/25 text-white" : "text-white/70"}`}>
              <G className={`${s} h-[17px] w-[17px]`} />
            </span>
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <div className="flex h-10 shrink-0 items-center gap-1 px-3 text-[12px] text-white/85">
          {tabs.map((t, k) => (
            <span key={t} className={`rounded-md px-2.5 py-1 ${k === active ? "bg-white/20 font-semibold text-white" : ""}`}>
              {t}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-3">
            <BI.search className={`${s} h-4 w-4`} />
            <span className="hidden text-[13px] font-semibold text-white md:inline">
              Битрикс24<sup className="ml-0.5 text-[8px]">©</sup>
            </span>
            <span className="hidden rounded-md bg-white/15 px-2 py-0.5 text-[11px] lg:inline">Пригласить</span>
          </span>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/** Цветная «стрелка» стадии для колонок канбана. */
export function StageHead({ name, count, color, dark }) {
  return (
    <div
      className="flex h-7 items-center gap-1.5 pl-2.5 pr-4 text-[12px] font-semibold"
      style={{
        background: color,
        color: dark ? "#fff" : "#1f2a37",
        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
        borderRadius: "6px 0 0 6px",
      }}
    >
      <span className="truncate">{name}</span>
      {count != null && <span className="shrink-0 font-normal opacity-75">({count})</span>}
    </div>
  );
}

/** Полоса стадий в карточке элемента (кликабельная). */
export function StageBar({ stages, current, onPick }) {
  return (
    <div className="flex gap-[3px]">
      {stages.map((st, k) => {
        const passed = k <= current;
        return (
          <button
            key={st.t}
            onClick={() => onPick?.(k)}
            className="group relative h-6 min-w-0 flex-1 text-left text-[11px] font-semibold transition-opacity hover:opacity-90"
            title={st.t}
          >
            <span
              className="absolute inset-0"
              style={{
                background: passed ? st.c : "#e7ebf0",
                clipPath:
                  k === 0
                    ? "polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)"
                    : "polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%, 7px 50%)",
                borderRadius: k === 0 ? "5px 0 0 5px" : 0,
              }}
            />
            <span className={`relative block truncate px-3 leading-6 ${passed ? (st.dark ? "text-white" : "text-[#1f2a37]") : "text-[#7b8794]"}`}>{st.t}</span>
            {!passed && <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full" style={{ background: st.c, opacity: 0.8 }} />}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ ini, color = "#5a8dee", size = 22 }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ background: color, width: size, height: size, fontSize: size * 0.42 }}>
      {ini}
    </span>
  );
}

/** Таймлайн-иконка в круге на вертикальной линии. */
export function TLDot({ glyph: G, color = "#2fc6f6" }) {
  return (
    <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ background: color }}>
      <G className={`${s} h-3.5 w-3.5`} />
    </span>
  );
}

export function Pill({ children, color = "#9dcf00" }) {
  return (
    <div className="flex justify-center py-1">
      <span className="rounded-full px-3 py-0.5 text-[10.5px] font-semibold text-white" style={{ background: color }}>
        {children}
      </span>
    </div>
  );
}
