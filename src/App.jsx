import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SLIDES } from "./slides.jsx";
import { Icon } from "./ui.jsx";
import { DeckContext } from "./deck.js";

const isTyping = (el) => el && (el.closest?.("input, textarea, select") || el.isContentEditable);

// слайд из адреса: #kanban или #12 — можно дать ссылку сразу на нужный слайд
function indexFromHash() {
  const h = decodeURIComponent(window.location.hash.slice(1));
  if (!h) return 0;
  const byId = SLIDES.findIndex((s) => s.id === h);
  if (byId >= 0) return byId;
  const n = parseInt(h, 10);
  return Number.isFinite(n) ? Math.max(0, Math.min(SLIDES.length - 1, n - 1)) : 0;
}

export default function App() {
  const [i, setI] = useState(indexFromHash);
  const [dir, setDir] = useState(1);
  const [toc, setToc] = useState(false);
  const touch = useRef(null);
  const total = SLIDES.length;

  const go = useCallback(
    (next) => {
      setI((cur) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        setDir(clamped >= cur ? 1 : -1);
        return clamped;
      });
    },
    [total]
  );

  const deck = useMemo(
    () => ({
      goTo: (id) => {
        const idx = SLIDES.findIndex((s) => s.id === id);
        if (idx >= 0) go(idx);
        setToc(false);
      },
    }),
    [go]
  );

  useEffect(() => {
    const id = SLIDES[i].id;
    if (window.location.hash.slice(1) !== id) window.history.replaceState(null, "", i === 0 ? window.location.pathname : `#${id}`);
  }, [i]);

  useEffect(() => {
    const onHash = () => go(indexFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go]);

  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(e.target)) return;
      if (e.key === "Escape") return setToc(false);
      if (toc) return;
      if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(i + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(i - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go, total, toc]);

  const onTouchStart = (e) => {
    touch.current = e.target.closest?.("[data-noswipe], input") ? null : e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 70) go(i + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  const slide = SLIDES[i];
  const progress = ((i + 1) / total) * 100;

  // оглавление: разделы в порядке появления
  const groups = useMemo(() => {
    const g = [];
    SLIDES.forEach((s, idx) => {
      if (!s.title) return;
      let last = g[g.length - 1];
      if (!last || last.section !== s.section) g.push((last = { section: s.section, items: [] }));
      last.items.push({ ...s, idx });
    });
    return g;
  }, []);

  return (
    <DeckContext.Provider value={deck}>
      <div className="grain relative h-[100dvh] w-full overflow-hidden bg-[#EEF3E6]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* aurora glass background — drifting orbs behind every slide */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="drift-a absolute -left-24 -top-28 h-[40rem] w-[40rem] rounded-full bg-emerald-400/30 blur-[110px]" />
          <div className="drift-b absolute right-[-8rem] top-1/4 h-[38rem] w-[38rem] rounded-full bg-lime-300/30 blur-[120px]" />
          <div className="drift-a absolute bottom-[-10rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-amber-300/28 blur-[120px]" />
          <div className="drift-b absolute bottom-0 right-1/4 h-[28rem] w-[28rem] rounded-full bg-green-300/28 blur-[110px]" />
        </div>

        {/* top progress hairline */}
        <div className="absolute inset-x-0 top-0 z-50 h-[3px] bg-espresso/[0.06]">
          <div className="h-full bg-ember transition-all duration-700 ease-spring" style={{ width: `${progress}%` }} />
        </div>

        {/* contents button */}
        <button
          onClick={() => setToc(true)}
          className="absolute left-5 top-4 z-40 flex items-center gap-2 rounded-full bg-white/55 px-3.5 py-1.5 text-xs font-semibold text-espresso ring-1 ring-espresso/10 backdrop-blur-md transition-all duration-300 ease-spring hover:bg-white/80"
        >
          <Icon.grid className="h-4 w-4 stroke-current fill-none text-ember" />
          <span className="hidden sm:inline">Содержание</span>
        </button>

        {/* section + counter */}
        <div className="absolute right-5 top-4 z-40 flex items-center gap-3 text-xs font-medium text-umber">
          <span className="hidden rounded-full bg-white/45 px-3 py-1 uppercase tracking-[0.18em] ring-1 ring-espresso/[0.06] backdrop-blur-md sm:inline">
            {slide.section}
          </span>
          <span className="rounded-full bg-white/45 px-2.5 py-1 tabular-nums ring-1 ring-espresso/[0.06] backdrop-blur-md">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* the slide — direction-aware entrance; scrolls if taller than the screen */}
        <div
          key={slide.id}
          className="thin-scroll relative z-10 h-full w-full overflow-y-auto overflow-x-hidden"
          style={{ animation: `${dir >= 0 ? "slideInRight" : "slideInLeft"} 0.6s cubic-bezier(0.32,0.72,0,1) both` }}
        >
          {slide.el}
        </div>

        {/* nav arrows */}
        <div className="absolute bottom-5 right-5 z-40 flex items-center gap-2">
          <NavBtn disabled={i === 0} onClick={() => go(i - 1)} flip />
          <NavBtn disabled={i === total - 1} onClick={() => go(i + 1)} />
        </div>

        {/* dot rail */}
        <div className="absolute bottom-7 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-white/35 px-2.5 py-1.5 ring-1 ring-white/50 backdrop-blur-md lg:flex">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => go(idx)}
              aria-label={`Слайд ${idx + 1}`}
              title={s.title || s.section}
              className={`h-1.5 rounded-full transition-all duration-500 ease-spring ${idx === i ? "w-5 bg-ember" : "w-1.5 bg-espresso/15 hover:bg-espresso/30"}`}
            />
          ))}
        </div>

        {/* table of contents */}
        {toc && (
          <div className="absolute inset-0 z-[70] flex items-start justify-center bg-espresso/25 p-4 backdrop-blur-sm md:items-center" onClick={() => setToc(false)}>
            <div
              className="glass-card thin-scroll relative max-h-[88dvh] w-full max-w-5xl animate-floatUp overflow-y-auto rounded-[1.75rem] bg-white/80 p-6 [animation-duration:0.45s] md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-espresso">Содержание</h2>
                <button onClick={() => setToc(false)} className="rounded-full bg-espresso/[0.05] px-3 py-1.5 text-xs font-semibold text-umber ring-1 ring-espresso/10 hover:bg-espresso/10">
                  Закрыть · Esc
                </button>
              </div>
              <div className="mt-5 columns-1 gap-6 sm:columns-2 lg:columns-3">
                {groups.map((g) => (
                  <div key={g.section + g.items[0].idx} className="mb-5 break-inside-avoid">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ember">{g.section}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {g.items.map((s) => (
                        <li key={s.id}>
                          <button
                            onClick={() => deck.goTo(s.id)}
                            className={`flex w-full items-baseline gap-2 rounded-lg px-2 py-1 text-left text-[13.5px] transition-colors ${
                              s.idx === i ? "bg-ember/10 font-semibold text-espresso" : "text-espresso/80 hover:bg-espresso/[0.04]"
                            }`}
                          >
                            <span className="w-5 shrink-0 text-[11px] tabular-nums text-umber/60">{s.idx + 1}</span>
                            {s.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DeckContext.Provider>
  );
}

function NavBtn({ onClick, disabled, flip }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={flip ? "Назад" : "Вперёд"}
      className={`group flex h-11 w-11 items-center justify-center rounded-full ring-1 transition-all duration-500 ease-spring active:scale-95 ${
        disabled ? "cursor-not-allowed bg-espresso/[0.03] text-espresso/20 ring-espresso/[0.05]" : "bg-espresso text-cream ring-espresso hover:bg-bark"
      }`}
    >
      <Icon.arrow className={`h-5 w-5 stroke-current fill-none transition-transform duration-500 ease-spring ${flip ? "rotate-180" : ""} ${disabled ? "" : "group-hover:translate-x-0.5"}`} />
    </button>
  );
}
