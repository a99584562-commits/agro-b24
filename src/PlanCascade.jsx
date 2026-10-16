import { useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — каскадное планирование продаж семян на сезон. Коммерческий директор раскладывает
// план компании по регионам, руководитель региона — по своим торговым представителям.
// Рядом всегда факт прошлого сезона для ориентира. Пока суммы не сходятся на всех уровнях,
// утвердить нельзя; когда сошлись — Б24 создаёт плановые сделки на каждого менеджера.

const TOTAL = 12000; // т, план компании
const STEP = 100;

const REGIONS = [
  {
    id: "south", name: "Юг", fact: 3400, plan: 3600,
    mgrs: [
      { id: "s1", name: "Д. Кравец", fact: 1050, plan: 1100 },
      { id: "s2", name: "С. Мельник", fact: 900, plan: 1000 },
      { id: "s3", name: "А. Гончаров", fact: 850, plan: 900 },
      { id: "s4", name: "Л. Белова", fact: 600, plan: 600 },
    ],
  },
  {
    id: "center", name: "Центр", fact: 2600, plan: 2800,
    mgrs: [
      { id: "c1", name: "Е. Тарасова", fact: 1000, plan: 1100 },
      { id: "c2", name: "П. Зуев", fact: 850, plan: 900 },
      { id: "c3", name: "О. Лаптева", fact: 750, plan: 800 },
    ],
  },
  {
    id: "volga", name: "Поволжье", fact: 2300, plan: 2400,
    mgrs: [
      { id: "v1", name: "К. Дьячков", fact: 900, plan: 900 },
      { id: "v2", name: "Н. Ершова", fact: 800, plan: 800 },
      { id: "v3", name: "Р. Валиев", fact: 600, plan: 600 },
    ],
  },
  {
    id: "ural", name: "Урал", fact: 1550, plan: 1600,
    mgrs: [
      { id: "u1", name: "В. Носков", fact: 600, plan: 600 },
      { id: "u2", name: "Т. Шилова", fact: 520, plan: 500 },
      { id: "u3", name: "Г. Пахомов", fact: 430, plan: 500 },
    ],
  },
  {
    id: "siberia", name: "Сибирь", fact: 1200, plan: 1200,
    mgrs: [
      { id: "b1", name: "А. Рябов", fact: 480, plan: 500 },
      { id: "b2", name: "Ю. Климова", fact: 400, plan: 400 },
      { id: "b3", name: "М. Седов", fact: 320, plan: 300 },
    ],
  },
];

const initRegions = () => Object.fromEntries(REGIONS.map((r) => [r.id, r.plan]));
const initMgrs = () => Object.fromEntries(REGIONS.flatMap((r) => r.mgrs.map((m) => [m.id, m.plan])));

const fmt = (n) => Math.round(n).toLocaleString("ru-RU");
const sumBy = (arr, f) => arr.reduce((s, x) => s + f(x), 0);

function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

// разложить total пропорционально факту прошлого сезона, кратно step; остаток — самым крупным
function splitByFact(total, items, step) {
  const factSum = sumBy(items, (x) => x.fact) || 1;
  const out = items.map((x) => Math.floor((total * x.fact) / factSum / step) * step);
  let rest = total - out.reduce((a, b) => a + b, 0);
  const order = items.map((_, i) => i).sort((a, b) => items[b].fact - items[a].fact);
  let k = 0;
  while (rest >= step) {
    out[order[k % order.length]] += step;
    rest -= step;
    k += 1;
  }
  if (rest > 0) out[order[0]] += rest;
  return out;
}

export default function PlanCascade() {
  const [plans, setPlans] = useState(initRegions);
  const [mplans, setMplans] = useState(initMgrs);
  const [sel, setSel] = useState("volga");
  const [approved, setApproved] = useState(false);

  const region = REGIONS.find((r) => r.id === sel);
  const regionSum = sumBy(REGIONS, (r) => plans[r.id]);
  const mgrSum = (r) => sumBy(r.mgrs, (m) => mplans[m.id]);

  const issues = [];
  if (regionSum < TOTAL) issues.push({ tone: "under", text: `Распределите по регионам ещё ${fmt(TOTAL - regionSum)} т` });
  if (regionSum > TOTAL) issues.push({ tone: "over", text: `Регионам выдано на ${fmt(regionSum - TOTAL)} т больше плана компании` });
  REGIONS.forEach((r) => {
    const ms = mgrSum(r);
    if (ms !== plans[r.id]) {
      issues.push({
        tone: ms < plans[r.id] ? "under" : "over",
        text: `${r.name}: менеджерам разнесено ${fmt(ms)} из ${fmt(plans[r.id])} т`,
      });
    }
  });
  const ok = issues.length === 0;
  const deals = sumBy(REGIONS, (r) => r.mgrs.filter((m) => mplans[m.id] > 0).length);

  function setRegion(id, v) {
    if (approved) return;
    setPlans((p) => ({ ...p, [id]: Math.max(0, v) }));
  }
  function setMgr(id, v) {
    if (approved) return;
    setMplans((p) => ({ ...p, [id]: Math.max(0, v) }));
  }
  function autoRegions() {
    if (approved) return;
    const vals = splitByFact(TOTAL, REGIONS, STEP);
    setPlans(Object.fromEntries(REGIONS.map((r, i) => [r.id, vals[i]])));
  }
  function autoMgrs() {
    if (approved) return;
    const vals = splitByFact(plans[region.id], region.mgrs, STEP);
    setMplans((p) => ({ ...p, ...Object.fromEntries(region.mgrs.map((m, i) => [m.id, vals[i]])) }));
  }
  function reset() {
    setPlans(initRegions());
    setMplans(initMgrs());
    setSel("volga");
    setApproved(false);
  }

  const firstIssue = issues[0];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember ring-1 ring-ember/20">
            <Icon.layers className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Каскадное планирование · сезон 2027</p>
            <p className="text-[10px] text-umber">Семена · план компании {fmt(TOTAL)} т → регионы → торговые представители</p>
          </div>
        </div>
        {approved ? (
          <span className="hidden rounded-full bg-sage/10 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline">план утверждён</span>
        ) : ok ? (
          <span className="hidden rounded-full bg-sage/10 px-2.5 py-1 text-[10px] font-semibold text-[#3c6b32] ring-1 ring-sage/25 sm:inline">всё сходится</span>
        ) : (
          <span className="hidden rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-[#8a6418] ring-1 ring-gold/25 sm:inline">
            черновик · {issues.length} {plural(issues.length, ["расхождение", "расхождения", "расхождений"])}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1.08fr_1fr]">
        {/* шаг 1 — регионы */}
        <div className="min-w-0">
          <StepHead n={1} title="Регионы" who="коммерческий директор" onAuto={autoRegions} disabled={approved} />
          <Alloc sum={regionSum} target={TOTAL} />
          <ColHead first="Регион" />
          <div className="space-y-1">
            {REGIONS.map((r) => {
              const ms = mgrSum(r);
              const match = ms === plans[r.id];
              const active = r.id === sel;
              return (
                <div
                  key={r.id}
                  onClick={() => setSel(r.id)}
                  className={`grid cursor-pointer grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-1.5 ring-1 transition-all duration-300 ease-spring sm:grid-cols-[1fr_4.25rem_auto_3rem] ${
                    active ? "bg-ember/[0.06] ring-ember/40" : "bg-white/50 ring-espresso/[0.06] hover:bg-white/70"
                  }`}
                >
                  <div className="min-w-0 leading-tight">
                    <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-espresso">
                      {r.name}
                      {active && <Icon.arrow className="h-3.5 w-3.5 stroke-current fill-none text-ember" />}
                    </p>
                    <p className={`truncate text-[10.5px] tabular-nums ${match ? "text-[#3c6b32]" : ms < plans[r.id] ? "text-[#8a6418]" : "text-red-700"}`}>
                      {match ? `✓ разнесено на ${r.mgrs.length} ТП` : `ТП: ${fmt(ms)} из ${fmt(plans[r.id])} т`}
                    </p>
                  </div>
                  <span className="hidden text-right text-[12px] tabular-nums text-umber sm:block">{fmt(r.fact)}</span>
                  <Stepper value={plans[r.id]} onChange={(v) => setRegion(r.id, v)} disabled={approved} label={`План региона ${r.name}`} />
                  <Delta plan={plans[r.id]} fact={r.fact} />
                </div>
              );
            })}
          </div>
        </div>

        {/* шаг 2 — менеджеры региона */}
        <div className="flex min-w-0 flex-col">
          <StepHead n={2} title={region.name} who="руководитель региона" onAuto={autoMgrs} disabled={approved} />
          <Alloc sum={mgrSum(region)} target={plans[region.id]} />
          <ColHead first="Торговый представитель" />
          <div className="space-y-1">
            {region.mgrs.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl bg-white/50 px-3 py-1.5 ring-1 ring-espresso/[0.06] sm:grid-cols-[1fr_4.25rem_auto_3rem]"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember ring-1 ring-ember/20">
                    <Icon.user className="h-3.5 w-3.5 stroke-current fill-none" />
                  </span>
                  <span className="truncate text-[12.5px] font-semibold text-espresso">{m.name}</span>
                </div>
                <span className="hidden text-right text-[12px] tabular-nums text-umber sm:block">{fmt(m.fact)}</span>
                <Stepper value={mplans[m.id]} onChange={(v) => setMgr(m.id, v)} disabled={approved} label={`План ${m.name}`} />
                <Delta plan={mplans[m.id]} fact={m.fact} />
              </div>
            ))}
          </div>

          {/* утверждение */}
          <div className="mt-auto pt-3">
            {approved ? (
              <div className="animate-floatUp flex items-center gap-3 rounded-xl bg-sage/10 px-3.5 py-2.5 ring-1 ring-sage/25">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-white">
                  <Icon.check className="h-4 w-4 stroke-current fill-none" />
                </span>
                <p className="min-w-0 flex-1 text-[11.5px] leading-snug text-espresso/90">
                  Созданы <b className="tabular-nums">{deals}</b> {plural(deals, ["плановая сделка", "плановые сделки", "плановых сделок"])} в воронке «Выполнение плана», руководители получили уведомления
                </p>
                <button
                  onClick={reset}
                  className="shrink-0 rounded-full bg-espresso px-3.5 py-2 text-[12px] font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] hover:bg-bark"
                >
                  Сбросить
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`flex min-w-0 flex-1 basis-48 items-start gap-1.5 text-[11.5px] leading-snug ${
                    ok ? "text-[#3c6b32]" : firstIssue.tone === "over" ? "text-red-700" : "text-[#8a6418]"
                  }`}
                >
                  {ok ? (
                    <Icon.check className="mt-px h-3.5 w-3.5 shrink-0 stroke-current fill-none" />
                  ) : (
                    <Icon.warn className="mt-px h-3.5 w-3.5 shrink-0 stroke-current fill-none" />
                  )}
                  <span>
                    {ok ? `Всё сходится: ${fmt(TOTAL)} т разнесены на ${deals} ТП` : firstIssue.text}
                    {issues.length > 1 && <span className="text-umber"> · и ещё {issues.length - 1}</span>}
                  </span>
                </p>
                <button
                  onClick={reset}
                  className="rounded-full bg-espresso/[0.05] px-3.5 py-2 text-[12px] font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring hover:bg-espresso/10"
                >
                  Сбросить
                </button>
                <button
                  onClick={() => ok && setApproved(true)}
                  disabled={!ok}
                  title={ok ? "" : firstIssue.text}
                  className="flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-[13px] font-semibold text-cream transition-all duration-300 ease-spring active:scale-[0.98] enabled:hover:brightness-105 disabled:opacity-40"
                >
                  <Icon.check className="h-4 w-4 stroke-current fill-none" /> Утвердить план
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHead({ n, title, who, onAuto, disabled }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-umber">
        Шаг {n} · {title} <span className="font-medium normal-case tracking-normal text-umber/70">— {who}</span>
      </p>
      <button
        onClick={onAuto}
        disabled={disabled}
        className="flex shrink-0 items-center gap-1 rounded-full bg-espresso/[0.05] px-2.5 py-1 text-[10.5px] font-medium text-umber ring-1 ring-espresso/10 transition-all duration-300 ease-spring enabled:hover:bg-espresso/10 disabled:opacity-40"
      >
        <Icon.spark className="h-3 w-3 stroke-current fill-none text-ember" /> по доле прошлого сезона
      </button>
    </div>
  );
}

function ColHead({ first }) {
  return (
    <div className="mb-1 mt-2.5 grid grid-cols-[1fr_auto] gap-3 px-3 text-[10px] font-semibold uppercase tracking-wide text-umber/80 sm:grid-cols-[1fr_4.25rem_auto_3rem]">
      <span>{first}</span>
      <span className="hidden text-right sm:block">Факт 2026</span>
      <span className="w-[7.5rem] text-center">План 2027, т</span>
      <span className="hidden text-right sm:block">к факту</span>
    </div>
  );
}

function Alloc({ sum, target }) {
  const diff = sum - target;
  const tone = diff === 0 ? "ok" : diff < 0 ? "under" : "over";
  const pct = target > 0 ? Math.min(100, (sum / target) * 100) : sum > 0 ? 100 : 0;
  const bar = { ok: "bg-sage", under: "bg-gold", over: "bg-red-500" }[tone];
  const chip = {
    ok: "bg-sage/10 text-[#3c6b32] ring-sage/25",
    under: "bg-gold/10 text-[#8a6418] ring-gold/25",
    over: "bg-red-500/10 text-red-700 ring-red-500/20",
  }[tone];
  return (
    <div className="rounded-xl bg-white/50 px-3 py-2 ring-1 ring-espresso/[0.06]">
      <div className="flex items-center justify-between gap-2 text-[11.5px]">
        <span className="truncate text-umber">
          Распределено <b className="font-semibold tabular-nums text-espresso">{fmt(sum)}</b> из <span className="tabular-nums">{fmt(target)}</span> т
        </span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ring-1 transition-colors duration-300 ${chip}`}>
          {tone === "ok" ? "сходится" : tone === "under" ? `осталось ${fmt(-diff)} т` : `перебор ${fmt(diff)} т`}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-espresso/[0.07]">
        <div className={`h-full rounded-full transition-all duration-500 ease-spring ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Stepper({ value, onChange, disabled, label }) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-full text-[15px] font-medium text-umber transition-all duration-300 ease-spring enabled:hover:bg-espresso/[0.07] enabled:active:scale-90 disabled:opacity-40";
  return (
    <div className="flex w-[7.5rem] items-center justify-between rounded-full bg-white/70 ring-1 ring-espresso/10">
      <button type="button" aria-label="Уменьшить на 100 т" disabled={disabled || value <= 0} onClick={() => onChange(value - STEP)} className={btn}>
        −
      </button>
      <input
        data-noswipe
        aria-label={label}
        inputMode="numeric"
        disabled={disabled}
        value={fmt(value)}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(Number.isNaN(n) ? 0 : Math.min(n, 99999));
        }}
        onKeyDown={(e) => {
          // стрелки внутри поля не должны листать слайды; ↑/↓ — шаг ±100 т
          e.stopPropagation();
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(value + STEP);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, value - STEP));
          }
        }}
        className="w-12 bg-transparent text-center text-[12.5px] font-semibold tabular-nums text-espresso outline-none disabled:text-espresso/70"
      />
      <button type="button" aria-label="Увеличить на 100 т" disabled={disabled} onClick={() => onChange(value + STEP)} className={btn}>
        +
      </button>
    </div>
  );
}

function Delta({ plan, fact }) {
  const d = fact ? Math.round(((plan - fact) / fact) * 100) : 0;
  return (
    <span className={`hidden text-right text-[11px] font-semibold tabular-nums sm:block ${d < 0 ? "text-[#8a6418]" : "text-umber"}`}>
      {d > 0 ? "+" : d < 0 ? "−" : ""}
      {Math.abs(d)}%
    </span>
  );
}
