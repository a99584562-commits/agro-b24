import { useMemo, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo app #3 — дашборд «План-факт по сезону». Отдельное SPA-приложение в левом меню Б24.
// Считает выполнение плана по культурам и менеджерам из истории сделок —
// то, чего штатные воронки-отчёты не дают в нужном разрезе.

const DATA = {
  Весна: {
    crops: [
      { name: "Пшеница", plan: 12.0, fact: 13.4 },
      { name: "Ячмень", plan: 8.0, fact: 6.9 },
      { name: "Рапс", plan: 9.5, fact: 10.8 },
      { name: "Горох", plan: 4.0, fact: 3.2 },
      { name: "Подсолнечник", plan: 6.0, fact: 7.1 },
    ],
    managers: [
      { name: "Отдел СЗР", v: 11.2 },
      { name: "Семена опт", v: 18.6 },
      { name: "Удобрения", v: 7.4 },
    ],
  },
  Осень: {
    crops: [
      { name: "Озимая пшеница", plan: 15.0, fact: 14.2 },
      { name: "Озимый рапс", plan: 7.0, fact: 8.3 },
      { name: "Рожь", plan: 5.0, fact: 5.6 },
      { name: "Тритикале", plan: 3.0, fact: 2.4 },
      { name: "Сидераты", plan: 4.5, fact: 5.1 },
    ],
    managers: [
      { name: "Отдел СЗР", v: 9.1 },
      { name: "Семена опт", v: 21.3 },
      { name: "Удобрения", v: 6.2 },
    ],
  },
};

const mln = (n) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(n);

export default function Dashboard() {
  const [season, setSeason] = useState("Весна");
  const d = DATA[season];

  const totals = useMemo(() => {
    const plan = d.crops.reduce((s, c) => s + c.plan, 0);
    const fact = d.crops.reduce((s, c) => s + c.fact, 0);
    return { plan, fact, exec: Math.round((fact / plan) * 100) };
  }, [d]);

  const maxBar = Math.max(...d.crops.map((c) => Math.max(c.plan, c.fact)));
  const maxMgr = Math.max(...d.managers.map((m) => m.v));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.chart className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">План-факт по сезону</p>
            <p className="text-[10px] text-umber">Приложение в левом меню портала · млн ₽</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-full bg-espresso/[0.05] p-0.5 ring-1 ring-espresso/10">
          {Object.keys(DATA).map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ease-spring ${
                season === s ? "bg-espresso text-cream" : "text-umber hover:text-espresso"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1.25fr_0.75fr]">
        {/* plan vs fact per crop */}
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-umber">Выполнение по культурам</p>
          <div className="space-y-3">
            {d.crops.map((c, i) => {
              const ex = Math.round((c.fact / c.plan) * 100);
              return (
                <div key={c.name}>
                  <div className="mb-1 flex items-baseline justify-between text-[12px]">
                    <span className="font-medium text-espresso">{c.name}</span>
                    <span className={`font-semibold tabular-nums ${ex >= 100 ? "text-[#3c6b32]" : "text-gold"}`}>{ex}%</span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-espresso/[0.06]">
                    {/* plan ghost */}
                    <div className="absolute inset-y-0 left-0 rounded-full bg-espresso/12" style={{ width: `${(c.plan / maxBar) * 100}%` }} />
                    {/* fact */}
                    <div
                      className="grow-x absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sage to-ember"
                      style={{ width: `${(c.fact / maxBar) * 100}%`, animationDelay: `${i * 90}ms` }}
                    />
                  </div>
                  <div className="mt-0.5 flex justify-between text-[10px] tabular-nums text-umber/70">
                    <span>факт {mln(c.fact)}</span>
                    <span>план {mln(c.plan)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KPI + managers */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
            <Kpi label="Факт, млн ₽" value={mln(totals.fact)} tone="ember" />
            <Kpi label="План, млн ₽" value={mln(totals.plan)} tone="ghost" />
            <Kpi label="Выполнение" value={`${totals.exec}%`} tone={totals.exec >= 100 ? "sage" : "gold"} />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-umber">Выручка по направлениям</p>
            <div className="space-y-2">
              {d.managers.map((m, i) => (
                <div key={m.name}>
                  <div className="mb-0.5 flex justify-between text-[11px]">
                    <span className="text-umber">{m.name}</span>
                    <span className="font-semibold tabular-nums text-espresso">{mln(m.v)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-espresso/[0.06]">
                    <div className="grow-x h-full rounded-full bg-espresso/70" style={{ width: `${(m.v / maxMgr) * 100}%`, animationDelay: `${i * 110}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }) {
  const tones = {
    ember: "bg-ember text-cream",
    sage: "bg-sage text-white",
    gold: "bg-gold text-white",
    ghost: "bg-espresso/[0.04] text-espresso ring-1 ring-espresso/10",
  };
  return (
    <div className={`rounded-xl px-3.5 py-2.5 ${tones[tone]}`}>
      <p className={`text-[9px] font-semibold uppercase tracking-wide ${tone === "ghost" ? "text-umber" : "text-white/70"}`}>{label}</p>
      <p className="font-display text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
