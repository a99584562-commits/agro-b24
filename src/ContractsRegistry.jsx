import { useMemo, useState } from "react";
import { Icon } from "./ui.jsx";

// Demo — реестр договоров. Сроки, суммы, пролонгации и напоминания об окончании.
// Коробка хранит договоры как файлы, но реестра со сроками и алертами не даёт.

const ROWS = [
  { no: "7-2026", who: "КФХ «Восход»", kind: "Поставка", sum: "4,2 млн ₽", left: 212, st: "active" },
  { no: "12-2026", who: "Агрохолдинг «Степь»", kind: "Рамочный", sum: "11,0 млн ₽", left: 18, st: "soon" },
  { no: "5-2026", who: "Агрофирма «Заря»", kind: "Услуги", sum: "1,8 млн ₽", left: 8, st: "soon" },
  { no: "31-2025", who: "ООО «Нива»", kind: "Поставка", sum: "3,1 млн ₽", left: -8, st: "overdue" },
  { no: "9-2026", who: "ИП Лебедев", kind: "Поставка", sum: "0,9 млн ₽", left: 120, st: "active" },
  { no: "44-2025", who: "КХ «Колос»", kind: "Услуги", sum: "0,6 млн ₽", left: -1, st: "renew" },
];

// даты окончания считаются от сегодняшнего дня — демо не «стареет»
const fmt = (left) => {
  const d = new Date();
  d.setDate(d.getDate() + left);
  return d.toLocaleDateString("ru-RU");
};
ROWS.forEach((r) => (r.end = fmt(r.left)));

const ST = {
  active: { label: "Активен", c: "#3c6b32", s: "rgba(111,168,92,0.16)" },
  soon: { label: "Истекает", c: "#8a6410", s: "rgba(194,146,46,0.16)" },
  overdue: { label: "Просрочен", c: "#C0563B", s: "rgba(192,86,59,0.14)" },
  renew: { label: "На пролонгацию", c: "#2F8F4E", s: "rgba(47,143,78,0.14)" },
};

export default function ContractsRegistry() {
  const [filter, setFilter] = useState("all");
  const [renewed, setRenewed] = useState([]);
  const rows = ROWS.filter((r) => filter === "all" || r.st === filter);

  const counts = useMemo(() => ({
    active: ROWS.filter((r) => r.st === "active").length,
    soon: ROWS.filter((r) => r.st === "soon" || r.st === "renew").length,
    overdue: ROWS.filter((r) => r.st === "overdue").length,
  }), []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/12 text-ember ring-1 ring-ember/20">
            <Icon.doc className="h-4 w-4 stroke-current fill-none" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-espresso">Реестр договоров</p>
            <p className="text-[10px] text-umber">Сроки · суммы · пролонгации</p>
          </div>
        </div>
        <div className="hidden gap-1.5 sm:flex">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>Все</Chip>
          {Object.entries(ST).map(([k, v]) => (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)} dot={v.c}>{v.label}</Chip>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* summary */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          <Sum label="Активных" value={counts.active} tone="sage" />
          <Sum label="Истекают / пролонгация" value={counts.soon} tone="gold" />
          <Sum label="Просрочены" value={counts.overdue} tone="bad" />
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-2xl ring-1 ring-espresso/[0.08]">
          <div className="grid grid-cols-[3.5rem_1.4fr_0.9fr_0.9fr_1fr_auto] gap-2 bg-espresso/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-umber">
            <span>№</span><span>Контрагент</span><span>Тип</span><span>Сумма</span><span>Окончание</span><span></span>
          </div>
          {rows.map((r) => {
            const s = ST[r.st];
            const isRenewed = renewed.includes(r.no);
            return (
              <div key={r.no} className="grid grid-cols-[3.5rem_1.4fr_0.9fr_0.9fr_1fr_auto] items-center gap-2 border-t border-espresso/[0.06] px-3 py-2.5 text-[12.5px]">
                <span className="font-mono text-[11px] text-umber">{r.no}</span>
                <span className="truncate font-semibold text-espresso">{r.who}</span>
                <span className="text-umber">{r.kind}</span>
                <span className="font-semibold tabular-nums text-espresso">{r.sum}</span>
                <span>
                  <span className="block tabular-nums text-espresso">{r.end}</span>
                  <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold" style={{ background: s.s, color: s.c }}>
                    {isRenewed ? "продлён" : s.label}{!isRenewed && r.left <= 30 && r.left >= 0 && ` · ${r.left} дн.`}{!isRenewed && r.left < 0 && ` · ${-r.left} дн.`}
                  </span>
                </span>
                {(r.st === "soon" || r.st === "renew" || r.st === "overdue") && !isRenewed ? (
                  <button onClick={() => setRenewed((x) => [...x, r.no])} className="rounded-full bg-espresso px-2.5 py-1 text-[10.5px] font-semibold text-cream transition-all active:scale-95 hover:bg-bark">Продлить</button>
                ) : (
                  <span className="text-[10px] text-sage">{isRenewed ? "✓" : ""}</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-umber/80"><Icon.bell className="h-3.5 w-3.5 stroke-current fill-none text-ember" /> За 30 дней до окончания — авто-напоминание ответственному.</p>
      </div>
    </div>
  );
}

function Sum({ label, value, tone }) {
  const tones = { sage: "bg-sage/12 text-[#3c6b32]", gold: "bg-gold/12 text-[#8a6410]", bad: "bg-[#C0563B]/12 text-[#C0563B]" };
  return (
    <div className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 ${tones[tone]}`}>
      <span className="font-display text-2xl font-semibold tabular-nums">{value}</span>
      <span className="text-[11px] font-medium leading-tight opacity-80">{label}</span>
    </div>
  );
}

function Chip({ active, onClick, children, dot }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ease-spring ${active ? "bg-espresso text-cream" : "bg-espresso/[0.05] text-umber ring-1 ring-espresso/10 hover:bg-espresso/10"}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}
